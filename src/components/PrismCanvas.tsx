/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId, useMemo, useState } from 'react';
import {
  DEFAULT_PRISM_CONFIG,
  degToRad,
  getPrismVertices,
  radToDeg,
} from '../physics/prismSolver';
import { Language, LightMode, PrismPhysicsResult, RayPathSegment } from '../types';

interface PrismCanvasProps {
  physicsResult: PrismPhysicsResult;
  incidenceAngle: number;
  onAngleChange: (newAngle: number) => void;
  lightMode: LightMode;
  showNormals: boolean;
  showAngles: boolean;
  showRayExtension: boolean;
  showScreen: boolean;
  activeStep: number; // 0 = all/continuous, 1 = incident, 2 = refracted, 3 = emergent, 4 = screen
  isPlaying: boolean;
  lang: Language;
  t: (key: string) => string;
}

export const PrismCanvas: React.FC<PrismCanvasProps> = ({
  physicsResult,
  incidenceAngle,
  onAngleChange,
  lightMode,
  showNormals,
  showAngles,
  showRayExtension,
  showScreen,
  activeStep,
  isPlaying,
  lang,
  t,
}) => {
  const gradientId = useId();
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);

  const config = DEFAULT_PRISM_CONFIG;
  const { A, B, C, face1Midpoint, face1Normal, face2Normal } = useMemo(
    () => getPrismVertices(config),
    [config]
  );

  // Representative ray for angle arcs & normals (middle ray: green or single mono ray)
  const refRay: RayPathSegment | undefined = useMemo(() => {
    if (!physicsResult.rays || physicsResult.rays.length === 0) return undefined;
    if (physicsResult.rays.length === 1) return physicsResult.rays[0];
    // For white light, pick Green (index 3) as the reference ray
    return physicsResult.rays[3] || physicsResult.rays[0];
  }, [physicsResult]);

  // Normal line lengths
  const normalLen = 65;

  // Face 1 Normal points
  const n1Out: { x: number; y: number } = {
    x: face1Midpoint.x + face1Normal.x * normalLen,
    y: face1Midpoint.y + face1Normal.y * normalLen,
  };
  const n1In: { x: number; y: number } = {
    x: face1Midpoint.x - face1Normal.x * normalLen,
    y: face1Midpoint.y - face1Normal.y * normalLen,
  };

  // Face 2 Normal points (at refRay.hit2)
  const hit2 = refRay?.hit2 || { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const n2Out: { x: number; y: number } = {
    x: hit2.x + face2Normal.x * normalLen,
    y: hit2.y + face2Normal.y * normalLen,
  };
  const n2In: { x: number; y: number } = {
    x: hit2.x - face2Normal.x * normalLen,
    y: hit2.y - face2Normal.y * normalLen,
  };

  // Incident ray extension (dotted line showing original direction)
  const incidentExtensionEnd = useMemo(() => {
    if (!refRay) return null;
    const dx = refRay.hit1.x - refRay.start.x;
    const dy = refRay.hit1.y - refRay.start.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) return null;
    const extendLen = 320;
    return {
      x: refRay.hit1.x + (dx / len) * extendLen,
      y: refRay.hit1.y + (dy / len) * extendLen,
    };
  }, [refRay]);

  // Backward extension of emergent ray to visually intersect with incident extension (showing D)
  const emergentExtension = useMemo(() => {
    if (!refRay || !refRay.isValid || refRay.hasTIR) return null;
    const dx = refRay.end.x - refRay.hit2.x;
    const dy = refRay.end.y - refRay.hit2.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) return null;
    return {
      x: refRay.hit2.x - (dx / len) * 75,
      y: refRay.hit2.y - (dy / len) * 75,
    };
  }, [refRay]);

  // Handle direct drag on canvas
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.dataset.dragHandle) {
      setIsDraggingHandle(true);
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingHandle) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;
    const mouseX = clientX * scaleX;
    const mouseY = clientY * scaleY;

    // Calculate angle of incoming ray from mouse to face1Midpoint
    const dx = face1Midpoint.x - mouseX;
    const dy = face1Midpoint.y - mouseY;
    const rayAngleRad = Math.atan2(dy, dx);
    const normalAngleRad = Math.atan2(-face1Normal.y, -face1Normal.x);
    let diffDeg = radToDeg(normalAngleRad - rayAngleRad);
    if (diffDeg < -180) diffDeg += 360;
    if (diffDeg > 180) diffDeg -= 360;

    // Clamp between 25 and 75
    const clamped = Math.max(25, Math.min(75, Math.round(diffDeg * 2) / 2));
    onAngleChange(clamped);
  };

  const handlePointerUp = () => {
    setIsDraggingHandle(false);
  };

  // Helper to draw an angle arc between two vectors
  const renderAngleArc = (
    center: { x: number; y: number },
    radius: number,
    startAngleRad: number,
    endAngleRad: number,
    color: string,
    label: string,
    labelOffsetRadius: number
  ) => {
    // Ensure counter-clockwise / small arc
    let start = startAngleRad;
    let end = endAngleRad;
    let diff = end - start;
    while (diff <= -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;

    const x1 = center.x + radius * Math.cos(start);
    const y1 = center.y + radius * Math.sin(start);
    const x2 = center.x + radius * Math.cos(start + diff);
    const y2 = center.y + radius * Math.sin(start + diff);

    const largeArc = Math.abs(diff) > Math.PI ? 1 : 0;
    const sweep = diff >= 0 ? 1 : 0;

    const midAngle = start + diff / 2;
    const labelX = center.x + labelOffsetRadius * Math.cos(midAngle);
    const labelY = center.y + labelOffsetRadius * Math.sin(midAngle);

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2} ${y2}`;

    return (
      <g className="transition-all duration-200">
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
        <rect
          x={labelX - 14}
          y={labelY - 10}
          width="28"
          height="20"
          rx="4"
          fill="rgba(15, 23, 42, 0.85)"
          stroke={color}
          strokeWidth="1"
        />
        <text
          x={labelX}
          y={labelY + 4}
          textAnchor="middle"
          fill={color}
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Top toolbar over canvas */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            {lightMode === 'white' ? t('light.white') : t('light.monochromatic')}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            (i = {incidenceAngle.toFixed(1)}°)
          </span>
        </div>

        {physicsResult.isTIR && (
          <div className="pointer-events-auto bg-amber-500/90 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {lang === 'vi' ? 'Phản xạ toàn phần tại mặt 2' : 'Total Internal Reflection at Face 2'}
          </div>
        )}
      </div>

      {/* SVG Experiment Viewport */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-auto max-h-[540px] block cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label={t('accessibility.rayDescription')}
        role="img"
      >
        <defs>
          {/* Subtle laboratory grid background */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.75" />
          </pattern>

          {/* Prism Glass Gradient */}
          <linearGradient id={`prismGrad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.28" />
          </linearGradient>

          {/* Light source collimator gradient */}
          <linearGradient id="collimatorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Screen gradient */}
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Glow filter for light rays */}
          <filter id="rayGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="800" height="500" fill="#030712" />
        <rect width="800" height="500" fill="url(#gridPattern)" />

        {/* Optical Bench Platform Line */}
        <line x1="40" y1="440" x2="760" y2="440" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />
        <text x="50" y="460" fill="#475569" fontSize="11" fontFamily="sans-serif">
          {lang === 'vi' ? 'Bàn quang học (Optical Bench)' : 'Optical Bench'}
        </text>

        {/* 1. Observation Screen */}
        {showScreen && (
          <g className="transition-opacity duration-300">
            {/* Screen Stand & Surface */}
            <rect
              x={config.screenX - 8}
              y="110"
              width="16"
              height="280"
              rx="4"
              fill="url(#screenGrad)"
              stroke="#94a3b8"
              strokeWidth="1.5"
              className="shadow-lg"
            />
            {/* Screen Stand base */}
            <path
              d={`M ${config.screenX - 25} 390 L ${config.screenX + 25} 390 L ${config.screenX + 15} 415 L ${config.screenX - 15} 415 Z`}
              fill="#334155"
              stroke="#475569"
            />
            <text
              x={config.screenX}
              y="98"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="bold"
            >
              {t('label.screen')} (E)
            </text>

            {/* Projected Spots / Band on the Screen */}
            {physicsResult.rays
              .filter((r) => r.isValid && !r.hasTIR)
              .map((r, idx) => (
                <g key={`screen-spot-${idx}`}>
                  <circle
                    cx={config.screenX}
                    cy={r.end.y}
                    r={lightMode === 'white' ? 4 : 5.5}
                    fill={r.color}
                    filter="url(#rayGlow)"
                  />
                  <line
                    x1={config.screenX + 12}
                    y1={r.end.y}
                    x2={config.screenX + 28}
                    y2={r.end.y}
                    stroke={r.color}
                    strokeWidth="1.2"
                  />
                  <text
                    x={config.screenX + 32}
                    y={r.end.y + 3.5}
                    fill={r.color}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {lang === 'vi' ? r.colorName : r.color}
                  </text>
                </g>
              ))}
          </g>
        )}

        {/* 2. Prism Polygon */}
        <g>
          {/* Subtle outer glow on prism */}
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
            fill={`url(#prismGrad-${gradientId})`}
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="filter drop-shadow-lg"
          />

          {/* Prism Face Highlights */}
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Vertex Labels: A (Apex), B, C */}
          <text x={A.x} y={A.y - 12} textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
            A (60°)
          </text>
          <text x={B.x - 14} y={B.y + 16} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            B
          </text>
          <text x={C.x + 14} y={C.y + 16} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            C
          </text>

          {/* Prism Base Indicator */}
          <text
            x={(B.x + C.x) / 2}
            y={B.y + 20}
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontStyle="italic"
          >
            {t('label.prismBase')} (Đáy)
          </text>

          {/* Apex angle arc at top */}
          <path
            d={`M ${A.x - 18 * Math.sin(degToRad(30))} ${A.y + 18 * Math.cos(degToRad(30))} A 18 18 0 0 0 ${A.x + 18 * Math.sin(degToRad(30))} ${A.y + 18 * Math.cos(degToRad(30))}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </g>

        {/* 3. Surface Normals (N1 and N2) */}
        {showNormals && (
          <g className="transition-opacity duration-300">
            {/* Normal 1 (at face 1 midpoint) */}
            <line
              x1={n1Out.x}
              y1={n1Out.y}
              x2={n1In.x}
              y2={n1In.y}
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <circle cx={face1Midpoint.x} cy={face1Midpoint.y} r="3" fill="#06b6d4" />
            <text
              x={n1Out.x - 8}
              y={n1Out.y - 6}
              fill="#22d3ee"
              fontSize="11"
              fontWeight="bold"
            >
              N₁ ({t('label.normal')})
            </text>

            {/* Normal 2 (at Face 2 hit point) */}
            {refRay?.isValid && (
              <>
                <line
                  x1={n2Out.x}
                  y1={n2Out.y}
                  x2={n2In.x}
                  y2={n2In.y}
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <circle cx={hit2.x} cy={hit2.y} r="3" fill="#06b6d4" />
                <text
                  x={n2Out.x + 8}
                  y={n2Out.y - 6}
                  fill="#22d3ee"
                  fontSize="11"
                  fontWeight="bold"
                >
                  N₂
                </text>
              </>
            )}
          </g>
        )}

        {/* 4. Incident Ray Extension (to show deviation angle D) */}
        {showRayExtension && incidentExtensionEnd && refRay?.isValid && (
          <g>
            <line
              x1={face1Midpoint.x}
              y1={face1Midpoint.y}
              x2={incidentExtensionEnd.x}
              y2={incidentExtensionEnd.y}
              stroke="#e2e8f0"
              strokeWidth="1.2"
              strokeDasharray="5 4"
              opacity="0.6"
            />
            {emergentExtension && (
              <line
                x1={refRay.hit2.x}
                y1={refRay.hit2.y}
                x2={emergentExtension.x}
                y2={emergentExtension.y}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            )}
          </g>
        )}

        {/* 5. Rays Tracing */}
        <g>
          {physicsResult.rays.map((ray, idx) => {
            const isWhiteLight = lightMode === 'white';
            const strokeColor = isWhiteLight ? ray.color : ray.color;
            const strokeWidth = isWhiteLight ? 2.2 : 3.2;

            // Visibility according to step-through mode:
            // step 1: incident ray only
            // step 2: incident + refracted in prism
            // step 3: incident + refracted + emergent
            // step 4 or 0: everything to screen
            const showIncident = activeStep === 0 || activeStep >= 1;
            const showRefracted = activeStep === 0 || activeStep >= 2;
            const showEmergent = activeStep === 0 || activeStep >= 3;

            return (
              <g key={`ray-${idx}`} className="transition-all duration-150">
                {/* 5.1 Incident Ray (from light source to face 1) */}
                {showIncident && (
                  <g>
                    {/* Glowing under-ray */}
                    <line
                      x1={ray.start.x}
                      y1={ray.start.y}
                      x2={ray.hit1.x}
                      y2={ray.hit1.y}
                      stroke={isWhiteLight ? '#f8fafc' : strokeColor}
                      strokeWidth={strokeWidth + 2}
                      strokeOpacity="0.4"
                      filter="url(#rayGlow)"
                    />
                    {/* Main ray line */}
                    <line
                      x1={ray.start.x}
                      y1={ray.start.y}
                      x2={ray.hit1.x}
                      y2={ray.hit1.y}
                      stroke={isWhiteLight ? '#ffffff' : strokeColor}
                      strokeWidth={strokeWidth}
                    />
                  </g>
                )}

                {/* 5.2 Refracted Ray inside prism */}
                {showRefracted && (
                  <g>
                    <line
                      x1={ray.hit1.x}
                      y1={ray.hit1.y}
                      x2={ray.hit2.x}
                      y2={ray.hit2.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      filter="url(#rayGlow)"
                      strokeOpacity="0.95"
                    />
                  </g>
                )}

                {/* 5.3 Emergent Ray (leaving face 2 towards screen) */}
                {showEmergent && (
                  <g>
                    <line
                      x1={ray.hit2.x}
                      y1={ray.hit2.y}
                      x2={ray.end.x}
                      y2={ray.end.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      filter="url(#rayGlow)"
                      strokeDasharray={ray.hasTIR ? '4 3' : undefined}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 6. Light Source (Collimator Box & Drag Handle) */}
        {refRay && (
          <g>
            {/* Collimator Box */}
            <g
              transform={`translate(${refRay.start.x - 40}, ${refRay.start.y - 18})`}
              className="cursor-grab active:cursor-grabbing"
              data-drag-handle="true"
            >
              <rect
                x="0"
                y="0"
                width="40"
                height="36"
                rx="6"
                fill="url(#collimatorGrad)"
                stroke="#64748b"
                strokeWidth="1.5"
                data-drag-handle="true"
              />
              {/* Slit opening */}
              <rect x="36" y="10" width="5" height="16" rx="2" fill="#38bdf8" data-drag-handle="true" />
              {/* Power LED */}
              <circle cx="12" cy="18" r="4" fill="#22c55e" data-drag-handle="true" className="animate-pulse" />
              <text x="24" y="22" fill="#cbd5e1" fontSize="9" fontWeight="bold" data-drag-handle="true">
                SRC
              </text>
            </g>

            {/* Interactive Drag Handle Icon */}
            <g
              transform={`translate(${refRay.start.x - 20}, ${refRay.start.y - 32})`}
              className="cursor-pointer"
              data-drag-handle="true"
            >
              <title>{t('accessibility.dragHandle')}</title>
              <circle cx="0" cy="0" r="11" fill="#38bdf8" data-drag-handle="true" />
              <path
                d="M -5 0 L 5 0 M -2 -3 L 2 3 M -2 3 L 2 -3"
                stroke="#0f172a"
                strokeWidth="2"
                strokeLinecap="round"
                data-drag-handle="true"
              />
            </g>

            <text
              x={refRay.start.x - 20}
              y={refRay.start.y + 34}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
            >
              {t('label.lightSource')}
            </text>
          </g>
        )}

        {/* 7. Accurate Angle Arcs & Labels (Measured from Normals) */}
        {showAngles && refRay && refRay.isValid && (
          <g>
            {/* 7.1 Angle of Incidence i: between incident ray and outward normal N1 */}
            {(() => {
              const normalAngle = Math.atan2(face1Normal.y, face1Normal.x);
              const incidentDirAngle = Math.atan2(
                refRay.start.y - refRay.hit1.y,
                refRay.start.x - refRay.hit1.x
              );
              return renderAngleArc(
                refRay.hit1,
                38,
                normalAngle,
                incidentDirAngle,
                '#38bdf8',
                `i = ${refRay.iDeg.toFixed(1)}°`,
                54
              );
            })()}

            {/* 7.2 Refraction angle r1: between ray inside prism and inward normal -N1 */}
            {(() => {
              const inwardNormalAngle = Math.atan2(-face1Normal.y, -face1Normal.x);
              const rayDirAngle = Math.atan2(
                refRay.hit2.y - refRay.hit1.y,
                refRay.hit2.x - refRay.hit1.x
              );
              return renderAngleArc(
                refRay.hit1,
                34,
                inwardNormalAngle,
                rayDirAngle,
                '#34d399',
                `r₁ = ${refRay.r1Deg.toFixed(1)}°`,
                50
              );
            })()}

            {/* 7.3 Internal incidence angle r2: at Face 2 between ray and inward normal -N2 */}
            {(() => {
              const inwardNormal2Angle = Math.atan2(-face2Normal.y, -face2Normal.x);
              const rayFromHit1Angle = Math.atan2(
                refRay.hit1.y - refRay.hit2.y,
                refRay.hit1.x - refRay.hit2.x
              );
              return renderAngleArc(
                refRay.hit2,
                32,
                inwardNormal2Angle,
                rayFromHit1Angle,
                '#f59e0b',
                `r₂ = ${refRay.r2Deg.toFixed(1)}°`,
                48
              );
            })()}

            {/* 7.4 Emergence angle e: at Face 2 between emergent ray and outward normal N2 */}
            {!refRay.hasTIR &&
              (() => {
                const outwardNormal2Angle = Math.atan2(face2Normal.y, face2Normal.x);
                const emergentRayAngle = Math.atan2(
                  refRay.end.y - refRay.hit2.y,
                  refRay.end.x - refRay.hit2.x
                );
                return renderAngleArc(
                  refRay.hit2,
                  36,
                  outwardNormal2Angle,
                  emergentRayAngle,
                  '#ec4899',
                  `e = ${refRay.eDeg.toFixed(1)}°`,
                  52
                );
              })()}

            {/* 7.5 Deviation angle D: between extended incident ray and emergent ray */}
            {showRayExtension &&
              !refRay.hasTIR &&
              incidentExtensionEnd &&
              (() => {
                // Approximate visual intersection for D arc near Face 2
                const centerD = { x: refRay.hit2.x + 35, y: refRay.hit2.y + 5 };
                const incAngle = Math.atan2(
                  incidentExtensionEnd.y - refRay.hit1.y,
                  incidentExtensionEnd.x - refRay.hit1.x
                );
                const emAngle = Math.atan2(
                  refRay.end.y - refRay.hit2.y,
                  refRay.end.x - refRay.hit2.x
                );
                return renderAngleArc(
                  centerD,
                  46,
                  incAngle,
                  emAngle,
                  '#f43f5e',
                  `D = ${refRay.deviationDeg.toFixed(1)}°`,
                  62
                );
              })()}
          </g>
        )}
      </svg>
    </div>
  );
};

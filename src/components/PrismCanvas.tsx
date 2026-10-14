/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Dragging states
  const [isDraggingHandle, setIsDraggingHandle] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  // Touch pinch-to-zoom tracking
  const touchDistanceRef = useRef<number | null>(null);

  const config = DEFAULT_PRISM_CONFIG;
  const { A, B, C, face1Midpoint, face1Normal, face2Normal } = useMemo(
    () => getPrismVertices(config),
    [config]
  );

  // Representative ray for angle arcs & normals (middle ray: green or single mono ray)
  const refRay: RayPathSegment | undefined = useMemo(() => {
    if (!physicsResult.rays || physicsResult.rays.length === 0) return undefined;
    if (physicsResult.rays.length === 1) return physicsResult.rays[0];
    return physicsResult.rays[3] || physicsResult.rays[0];
  }, [physicsResult]);

  // Normal line lengths
  const normalLen = 75;

  // Face 1 Normal points
  const n1Out = {
    x: face1Midpoint.x + face1Normal.x * normalLen,
    y: face1Midpoint.y + face1Normal.y * normalLen,
  };
  const n1In = {
    x: face1Midpoint.x - face1Normal.x * normalLen,
    y: face1Midpoint.y - face1Normal.y * normalLen,
  };

  // Face 2 Normal points (at refRay.hit2)
  const hit2 = refRay?.hit2 || { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const n2Out = {
    x: hit2.x + face2Normal.x * normalLen,
    y: hit2.y + face2Normal.y * normalLen,
  };
  const n2In = {
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
    const extendLen = 380;
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
      x: refRay.hit2.x - (dx / len) * 90,
      y: refRay.hit2.y - (dy / len) * 90,
    };
  }, [refRay]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((z) => Math.min(3.0, +(z * 1.2).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.5, +(z / 1.2).toFixed(2)));
  };

  const handleResetZoomPan = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Wheel to zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom((prev) => {
      const next = Math.max(0.5, Math.min(3.0, +(prev * zoomFactor).toFixed(2)));
      return next;
    });
  };

  // Pointer interactions: Drag Light Source or Pan Viewport
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;

    if (target.dataset.dragHandle) {
      // User clicked specifically on light source / handle to change angle i
      setIsDraggingHandle(true);
      (e.target as Element).setPointerCapture(e.pointerId);
    } else {
      // User clicked canvas background to pan view
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      if (svgRef.current) {
        svgRef.current.setPointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDraggingHandle) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Transform client coordinates through pan and zoom to get scene coordinates
      const scaleX = 960 / rect.width;
      const scaleY = 560 / rect.height;
      const rawSvgX = clientX * scaleX;
      const rawSvgY = clientY * scaleY;

      // Reverse pan and zoom from center (480, 280)
      const sceneX = 480 + (rawSvgX - 480 - pan.x) / zoom;
      const sceneY = 280 + (rawSvgY - 280 - pan.y) / zoom;

      // Calculate angle of incoming ray from scene point to face1Midpoint
      const dx = face1Midpoint.x - sceneX;
      const dy = face1Midpoint.y - sceneY;
      const rayAngleRad = Math.atan2(dy, dx);
      const normalAngleRad = Math.atan2(-face1Normal.y, -face1Normal.x);
      let diffDeg = radToDeg(normalAngleRad - rayAngleRad);
      if (diffDeg < -180) diffDeg += 360;
      if (diffDeg > 180) diffDeg -= 360;

      // Clamp between 25° and 75°
      const clamped = Math.max(25, Math.min(75, Math.round(diffDeg * 2) / 2));
      onAngleChange(clamped);
    } else if (isPanning) {
      const deltaX = e.clientX - panStartRef.current.clientX;
      const deltaY = e.clientY - panStartRef.current.clientY;
      setPan({
        x: panStartRef.current.panX + deltaX,
        y: panStartRef.current.panY + deltaY,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingHandle(false);
    setIsPanning(false);
  };

  // Touch Pinch-to-zoom support for mobile
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (touchDistanceRef.current !== null) {
        const delta = dist - touchDistanceRef.current;
        const zoomDelta = delta * 0.005;
        setZoom((z) => Math.max(0.5, Math.min(3.0, +(z + zoomDelta).toFixed(2))));
      }
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Keyboard accessibility for pan/zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoomPan();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          x={labelX - 16}
          y={labelY - 11}
          width="32"
          height="22"
          rx="5"
          fill="rgba(15, 23, 42, 0.9)"
          stroke={color}
          strokeWidth="1.2"
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
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-2 sm:inset-4 z-50 flex flex-col max-h-[96vh]'
          : 'min-h-[440px] sm:min-h-[500px]'
      }`}
    >
      {/* 1. Top HUD Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none gap-2">
        {/* Left Status Pill */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            {lightMode === 'white' ? t('light.white') : t('light.monochromatic')}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            (i = {incidenceAngle.toFixed(1)}°)
          </span>
        </div>

        {/* TIR Alert Pill */}
        {physicsResult.isTIR && (
          <div className="pointer-events-auto bg-amber-500/90 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              {lang === 'vi' ? 'Phản xạ toàn phần tại mặt 2' : 'Total Internal Reflection at Face 2'}
            </span>
          </div>
        )}

        {/* Right HUD: Expand/Shrink Viewport Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isExpanded ? t('canvas.collapseView') : t('canvas.expandView')}
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">{t('canvas.collapseView')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="hidden sm:inline">{t('canvas.expandView')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Floating Zoom & Pan Controls (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 3.0}
          className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
          title={t('canvas.zoomIn')}
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
          title={t('canvas.zoomOut')}
        >
          −
        </button>

        <span className="px-2 text-xs font-mono font-bold text-sky-400 select-none">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleResetZoomPan}
          className="px-2 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
          title={t('canvas.zoomReset')}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">100%</span>
        </button>
      </div>

      {/* 3. Bottom Gesture Hint (Center) */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-2 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 pointer-events-none">
        <span className="text-amber-400">✋</span>
        <span>{t('canvas.panHint')}</span>
      </div>

      {/* 4. Interactive SVG Simulation Viewport */}
      <svg
        ref={svgRef}
        viewBox="0 0 960 560"
        className={`w-full block select-none ${
          isPanning
            ? 'cursor-grabbing'
            : isDraggingHandle
            ? 'cursor-grab'
            : 'cursor-grab'
        } ${isExpanded ? 'h-full flex-1' : 'h-auto max-h-[600px]'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label={t('accessibility.rayDescription')}
        role="img"
      >
        <defs>
          {/* Subtle laboratory grid pattern */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.28)" strokeWidth="0.8" />
          </pattern>

          {/* Prism Glass Gradient */}
          <linearGradient id={`prismGrad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.30" />
          </linearGradient>

          {/* Light source collimator gradient */}
          <linearGradient id="collimatorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Observation Screen gradient */}
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

        {/* Global Dark Background & Grid */}
        <rect width="960" height="560" fill="#030712" />
        <rect width="960" height="560" fill="url(#gridPattern)" />

        {/* Transformed Scene Group with Pan & Zoom centered at (480, 280) */}
        <g transform={`translate(${480 + pan.x}, ${280 + pan.y}) scale(${zoom}) translate(-480, -280)`}>
          {/* Optical Bench Platform Line */}
          <line x1="30" y1="500" x2="930" y2="500" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="8 5" />
          <text x="45" y="522" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
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
                height="320"
                rx="4"
                fill="url(#screenGrad)"
                stroke="#94a3b8"
                strokeWidth="1.5"
                className="shadow-lg"
              />
              {/* Screen Stand base */}
              <path
                d={`M ${config.screenX - 25} 430 L ${config.screenX + 25} 430 L ${config.screenX + 15} 460 L ${config.screenX - 15} 460 Z`}
                fill="#334155"
                stroke="#475569"
              />
              <text
                x={config.screenX}
                y="95"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
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
                      r={lightMode === 'white' ? 4.5 : 6}
                      fill={r.color}
                      filter="url(#rayGlow)"
                    />
                    <line
                      x1={config.screenX + 12}
                      y1={r.end.y}
                      x2={config.screenX + 30}
                      y2={r.end.y}
                      stroke={r.color}
                      strokeWidth="1.4"
                    />
                    <text
                      x={config.screenX + 35}
                      y={r.end.y + 4}
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

          {/* 2. Prism Geometry */}
          <g>
            <polygon
              points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill={`url(#prismGrad-${gradientId})`}
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="filter drop-shadow-xl"
            />

            {/* Prism Face Highlights */}
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
            <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />

            {/* Vertex Labels: A (Apex), B, C */}
            <text x={A.x} y={A.y - 14} textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
              A (60°)
            </text>
            <text x={B.x - 16} y={B.y + 18} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
              B
            </text>
            <text x={C.x + 16} y={C.y + 18} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
              C
            </text>

            {/* Prism Base Indicator */}
            <text
              x={(B.x + C.x) / 2}
              y={B.y + 24}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontStyle="italic"
            >
              {t('label.prismBase')} (Đáy)
            </text>

            {/* Apex angle arc at top */}
            <path
              d={`M ${A.x - 20 * Math.sin(degToRad(30))} ${A.y + 20 * Math.cos(degToRad(30))} A 20 20 0 0 0 ${A.x + 20 * Math.sin(degToRad(30))} ${A.y + 20 * Math.cos(degToRad(30))}`}
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
                strokeDasharray="5 3"
              />
              <circle cx={face1Midpoint.x} cy={face1Midpoint.y} r="3.5" fill="#06b6d4" />
              <text
                x={n1Out.x - 10}
                y={n1Out.y - 8}
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
                    strokeDasharray="5 3"
                  />
                  <circle cx={hit2.x} cy={hit2.y} r="3.5" fill="#06b6d4" />
                  <text
                    x={n2Out.x + 10}
                    y={n2Out.y - 8}
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
                opacity="0.65"
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
                  opacity="0.55"
                />
              )}
            </g>
          )}

          {/* 5. Rays Tracing */}
          <g>
            {physicsResult.rays.map((ray, idx) => {
              const isWhiteLight = lightMode === 'white';
              const strokeColor = ray.color;
              const strokeWidth = isWhiteLight ? 2.4 : 3.4;

              const showIncident = activeStep === 0 || activeStep >= 1;
              const showRefracted = activeStep === 0 || activeStep >= 2;
              const showEmergent = activeStep === 0 || activeStep >= 3;

              return (
                <g key={`ray-${idx}`} className="transition-all duration-150">
                  {/* 5.1 Incident Ray */}
                  {showIncident && (
                    <g>
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

                  {/* 5.3 Emergent Ray */}
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
                transform={`translate(${refRay.start.x - 42}, ${refRay.start.y - 19})`}
                className="cursor-grab active:cursor-grabbing"
                data-drag-handle="true"
              >
                <rect
                  x="0"
                  y="0"
                  width="42"
                  height="38"
                  rx="6"
                  fill="url(#collimatorGrad)"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  data-drag-handle="true"
                />
                <rect x="38" y="10" width="5" height="18" rx="2" fill="#38bdf8" data-drag-handle="true" />
                <circle cx="12" cy="19" r="4" fill="#22c55e" data-drag-handle="true" className="animate-pulse" />
                <text x="24" y="23" fill="#cbd5e1" fontSize="9" fontWeight="bold" data-drag-handle="true">
                  SRC
                </text>
              </g>

              {/* Interactive Drag Handle Icon */}
              <g
                transform={`translate(${refRay.start.x - 21}, ${refRay.start.y - 34})`}
                className="cursor-pointer"
                data-drag-handle="true"
              >
                <title>{t('accessibility.dragHandle')}</title>
                <circle cx="0" cy="0" r="12" fill="#38bdf8" data-drag-handle="true" />
                <path
                  d="M -5 0 L 5 0 M -2 -3 L 2 3 M -2 3 L 2 -3"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  data-drag-handle="true"
                />
              </g>

              <text
                x={refRay.start.x - 21}
                y={refRay.start.y + 36}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
              >
                {t('label.lightSource')}
              </text>
            </g>
          )}

          {/* 7. Angle Arcs & Labels */}
          {showAngles && refRay && refRay.isValid && (
            <g>
              {/* 7.1 Angle of Incidence i */}
              {(() => {
                const normalAngle = Math.atan2(face1Normal.y, face1Normal.x);
                const incidentDirAngle = Math.atan2(
                  refRay.start.y - refRay.hit1.y,
                  refRay.start.x - refRay.hit1.x
                );
                return renderAngleArc(
                  refRay.hit1,
                  40,
                  normalAngle,
                  incidentDirAngle,
                  '#38bdf8',
                  `i = ${refRay.iDeg.toFixed(1)}°`,
                  56
                );
              })()}

              {/* 7.2 Refraction angle r1 */}
              {(() => {
                const inwardNormalAngle = Math.atan2(-face1Normal.y, -face1Normal.x);
                const rayDirAngle = Math.atan2(
                  refRay.hit2.y - refRay.hit1.y,
                  refRay.hit2.x - refRay.hit1.x
                );
                return renderAngleArc(
                  refRay.hit1,
                  36,
                  inwardNormalAngle,
                  rayDirAngle,
                  '#34d399',
                  `r₁ = ${refRay.r1Deg.toFixed(1)}°`,
                  52
                );
              })()}

              {/* 7.3 Internal incidence angle r2 */}
              {(() => {
                const inwardNormal2Angle = Math.atan2(-face2Normal.y, -face2Normal.x);
                const rayFromHit1Angle = Math.atan2(
                  refRay.hit1.y - refRay.hit2.y,
                  refRay.hit1.x - refRay.hit2.x
                );
                return renderAngleArc(
                  refRay.hit2,
                  34,
                  inwardNormal2Angle,
                  rayFromHit1Angle,
                  '#f59e0b',
                  `r₂ = ${refRay.r2Deg.toFixed(1)}°`,
                  50
                );
              })()}

              {/* 7.4 Emergence angle e */}
              {!refRay.hasTIR &&
                (() => {
                  const outwardNormal2Angle = Math.atan2(face2Normal.y, face2Normal.x);
                  const emergentRayAngle = Math.atan2(
                    refRay.end.y - refRay.hit2.y,
                    refRay.end.x - refRay.hit2.x
                  );
                  return renderAngleArc(
                    refRay.hit2,
                    38,
                    outwardNormal2Angle,
                    emergentRayAngle,
                    '#ec4899',
                    `e = ${refRay.eDeg.toFixed(1)}°`,
                    54
                  );
                })()}

              {/* 7.5 Deviation angle D */}
              {showRayExtension &&
                !refRay.hasTIR &&
                incidentExtensionEnd &&
                (() => {
                  const centerD = { x: refRay.hit2.x + 40, y: refRay.hit2.y + 6 };
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
                    48,
                    incAngle,
                    emAngle,
                    '#f43f5e',
                    `D = ${refRay.deviationDeg.toFixed(1)}°`,
                    66
                  );
                })()}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

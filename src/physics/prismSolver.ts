/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, PrismPhysicsResult, RayPathSegment, SpectralColor } from '../types';

export const SPECTRAL_COLORS: SpectralColor[] = [
  { id: 'red', nameVi: 'Đỏ', nameEn: 'Red', colorHex: '#ef4444', wavelengthNm: 700, refractiveIndex: 1.514 },
  { id: 'orange', nameVi: 'Da cam', nameEn: 'Orange', colorHex: '#f97316', wavelengthNm: 620, refractiveIndex: 1.517 },
  { id: 'yellow', nameVi: 'Vàng', nameEn: 'Yellow', colorHex: '#eab308', wavelengthNm: 580, refractiveIndex: 1.520 },
  { id: 'green', nameVi: 'Lục', nameEn: 'Green', colorHex: '#22c55e', wavelengthNm: 530, refractiveIndex: 1.524 },
  { id: 'blue', nameVi: 'Lam', nameEn: 'Blue', colorHex: '#0ea5e9', wavelengthNm: 480, refractiveIndex: 1.528 },
  { id: 'indigo', nameVi: 'Chàm', nameEn: 'Indigo', colorHex: '#6366f1', wavelengthNm: 440, refractiveIndex: 1.533 },
  { id: 'violet', nameVi: 'Tím', nameEn: 'Violet', colorHex: '#a855f7', wavelengthNm: 400, refractiveIndex: 1.538 },
];

export interface PrismConfig {
  apexPoint: Point2D;
  sideLength: number;
  apexAngleDeg: number;
  hitRatioOnFace1: number; // 0.0 - 1.0 along face 1 from apex A to vertex B
  screenWidth: number;
  screenX: number;
}

export const DEFAULT_PRISM_CONFIG: PrismConfig = {
  apexPoint: { x: 440, y: 140 },
  sideLength: 270,
  apexAngleDeg: 60,
  hitRatioOnFace1: 0.52, // Hit around middle-lower of face 1
  screenWidth: 18,
  screenX: 860,
};

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export interface PrismVertices {
  A: Point2D; // Apex
  B: Point2D; // Bottom Left
  C: Point2D; // Bottom Right
  face1Midpoint: Point2D;
  face1Normal: Point2D; // Outward unit normal
  face2Normal: Point2D; // Outward unit normal
}

export function getPrismVertices(config: PrismConfig = DEFAULT_PRISM_CONFIG): PrismVertices {
  const { apexPoint, sideLength, apexAngleDeg } = config;
  const halfA = degToRad(apexAngleDeg / 2);
  const height = sideLength * Math.cos(halfA);
  const halfBase = sideLength * Math.sin(halfA);

  const A: Point2D = { ...apexPoint };
  const B: Point2D = { x: apexPoint.x - halfBase, y: apexPoint.y + height };
  const C: Point2D = { x: apexPoint.x + halfBase, y: apexPoint.y + height };

  // Face 1 vector from A to B
  const dxAB = B.x - A.x;
  const dyAB = B.y - A.y;
  const lenAB = Math.hypot(dxAB, dyAB);
  const t1x = dxAB / lenAB;
  const t1y = dyAB / lenAB;
  // Outward normal points left-up: (-t1y, t1x)
  const face1Normal: Point2D = { x: -t1y, y: t1x };

  // Face 2 vector from A to C
  const dxAC = C.x - A.x;
  const dyAC = C.y - A.y;
  const lenAC = Math.hypot(dxAC, dyAC);
  const t2x = dxAC / lenAC;
  const t2y = dyAC / lenAC;
  // Outward normal points right-up: (t2y, -t2x)
  const face2Normal: Point2D = { x: t2y, y: -t2x };

  const face1Midpoint: Point2D = {
    x: A.x + (B.x - A.x) * config.hitRatioOnFace1,
    y: A.y + (B.y - A.y) * config.hitRatioOnFace1,
  };

  return { A, B, C, face1Midpoint, face1Normal, face2Normal };
}

// Line segment intersection helper
export function lineIntersectSegment(
  p: Point2D,
  dir: Point2D,
  q1: Point2D,
  q2: Point2D
): { hit: Point2D; t: number; u: number } | null {
  const v1 = dir;
  const v2 = { x: q2.x - q1.x, y: q2.y - q1.y };
  const cross = v1.x * v2.y - v1.y * v2.x;

  if (Math.abs(cross) < 1e-7) return null;

  const dx = q1.x - p.x;
  const dy = q1.y - p.y;
  const t = (dx * v2.y - dy * v2.x) / cross;
  const u = (dx * v1.y - dy * v1.x) / cross;

  if (t >= 0 && u >= 0 && u <= 1) {
    return {
      hit: { x: p.x + t * v1.x, y: p.y + t * v1.y },
      t,
      u,
    };
  }
  return null;
}

export function solvePrismRay(
  iDeg: number,
  n: number,
  color: string,
  colorName: string,
  config: PrismConfig = DEFAULT_PRISM_CONFIG
): RayPathSegment {
  const { A, B, C, face1Midpoint, face1Normal, face2Normal } = getPrismVertices(config);
  const apexAngleDeg = config.apexAngleDeg;

  // Face 1 unit tangent vector pointing from A to B:
  const dxAB = B.x - A.x;
  const dyAB = B.y - A.y;
  const lenAB = Math.hypot(dxAB, dyAB);
  const tangentFace1: Point2D = { x: dxAB / lenAB, y: dyAB / lenAB };

  // Angle of incidence i is measured from Face 1 outward normal (-face1Normal points into prism)
  // When i = 0, incident ray travels along inward normal: -face1Normal
  // As i increases, ray tilts so that it strikes from lower down towards the normal
  const iRad = degToRad(iDeg);
  const sinI = Math.sin(iRad);
  const sinR1 = sinI / n;

  // If sin(r1) > 1, invalid (should never happen when entering glass from air since n > 1)
  if (Math.abs(sinR1) > 1) {
    return createInvalidSegment(color, colorName, face1Midpoint);
  }

  const r1Rad = Math.asin(sinR1);
  const r1Deg = radToDeg(r1Rad);

  // Inward normal vector at face 1
  const inwardNormal1: Point2D = { x: -face1Normal.x, y: -face1Normal.y };

  // Incident ray unit direction:
  // It travels inwards, tilted by -iRad relative to inward normal
  // Let's compute incident direction vector:
  const incidentDir: Point2D = {
    x: inwardNormal1.x * Math.cos(iRad) - tangentFace1.x * Math.sin(iRad),
    y: inwardNormal1.y * Math.cos(iRad) - tangentFace1.y * Math.sin(iRad),
  };

  // Light source starting position (ray length backwards ~ 260px)
  const startRayLength = 260;
  const start: Point2D = {
    x: face1Midpoint.x - incidentDir.x * startRayLength,
    y: face1Midpoint.y - incidentDir.y * startRayLength,
  };

  const hit1 = face1Midpoint;

  // Refracted direction inside prism at face 1:
  // It bends towards inward normal: angle with inward normal is r1Rad
  const refractedDir: Point2D = {
    x: inwardNormal1.x * Math.cos(r1Rad) - tangentFace1.x * Math.sin(r1Rad),
    y: inwardNormal1.y * Math.cos(r1Rad) - tangentFace1.y * Math.sin(r1Rad),
  };

  // Ray inside travels from hit1 in direction refractedDir until it intersects Face 2 (A to C)
  const hit2Result = lineIntersectSegment(hit1, refractedDir, A, C);

  // If it doesn't hit Face 2 (e.g. hits base B-C or misses entirely)
  if (!hit2Result) {
    // Check if it hits base
    const hitBaseResult = lineIntersectSegment(hit1, refractedDir, B, C);
    const endPoint = hitBaseResult ? hitBaseResult.hit : {
      x: hit1.x + refractedDir.x * 200,
      y: hit1.y + refractedDir.y * 200,
    };
    return {
      color,
      colorName,
      start,
      hit1,
      hit2: endPoint,
      end: endPoint,
      iDeg,
      r1Deg,
      r2Deg: apexAngleDeg - r1Deg,
      eDeg: 0,
      deviationDeg: 0,
      hasTIR: false,
      isValid: false,
    };
  }

  const hit2 = hit2Result.hit;

  // Face 2 physics:
  // Prism relationship: r1 + r2 = A => r2 = A - r1
  const r2Deg = apexAngleDeg - r1Deg;
  const r2Rad = degToRad(r2Deg);

  // Check for Total Internal Reflection (TIR) at Face 2
  // Critical angle: sin(i_crit) = 1 / n
  const sinE = n * Math.sin(r2Rad);
  const hasTIR = sinE > 1.0;

  if (hasTIR) {
    // Total internal reflection: ray reflects internally inside prism
    // Reflection off Face 2 (normal is face2Normal)
    const dot = refractedDir.x * face2Normal.x + refractedDir.y * face2Normal.y;
    const reflectedDir: Point2D = {
      x: refractedDir.x - 2 * dot * face2Normal.x,
      y: refractedDir.y - 2 * dot * face2Normal.y,
    };
    const tirEnd: Point2D = {
      x: hit2.x + reflectedDir.x * 120,
      y: hit2.y + reflectedDir.y * 120,
    };
    return {
      color,
      colorName,
      start,
      hit1,
      hit2,
      end: tirEnd,
      iDeg,
      r1Deg,
      r2Deg,
      eDeg: 90,
      deviationDeg: 0,
      hasTIR: true,
      isValid: false,
    };
  }

  const eRad = Math.asin(sinE);
  const eDeg = radToDeg(eRad);
  // Total deviation angle D = i + e - A
  const deviationDeg = iDeg + eDeg - apexAngleDeg;

  // Tangent vector of Face 2 from A to C:
  const dxAC = C.x - A.x;
  const dyAC = C.y - A.y;
  const lenAC = Math.hypot(dxAC, dyAC);
  const tangentFace2: Point2D = { x: dxAC / lenAC, y: dyAC / lenAC };

  // Emergent ray emerges into air from hit2
  // Angle with outward normal face2Normal is eRad
  // In the downward deviation orientation:
  const emergentDir: Point2D = {
    x: face2Normal.x * Math.cos(eRad) + tangentFace2.x * Math.sin(eRad),
    y: face2Normal.y * Math.cos(eRad) + tangentFace2.y * Math.sin(eRad),
  };

  // Find intersection with screen line x = screenX
  const screenX = config.screenX;
  let end: Point2D;
  if (emergentDir.x > 0.05) {
    const t = (screenX - hit2.x) / emergentDir.x;
    end = {
      x: screenX,
      y: hit2.y + t * emergentDir.y,
    };
  } else {
    end = {
      x: hit2.x + emergentDir.x * 250,
      y: hit2.y + emergentDir.y * 250,
    };
  }

  return {
    color,
    colorName,
    start,
    hit1,
    hit2,
    end,
    iDeg,
    r1Deg,
    r2Deg,
    eDeg,
    deviationDeg,
    hasTIR: false,
    isValid: true,
  };
}

function createInvalidSegment(color: string, colorName: string, p: Point2D): RayPathSegment {
  return {
    color,
    colorName,
    start: { x: p.x - 150, y: p.y },
    hit1: p,
    hit2: p,
    end: p,
    iDeg: 0,
    r1Deg: 0,
    r2Deg: 0,
    eDeg: 0,
    deviationDeg: 0,
    hasTIR: false,
    isValid: false,
  };
}

export function computePrismSimulation(
  iDeg: number,
  mode: 'white' | 'monochromatic',
  monochromaticId: string = 'green',
  apexAngleOrConfig: number | PrismConfig = DEFAULT_PRISM_CONFIG,
  prismPos?: Point2D
): PrismPhysicsResult {
  let config: PrismConfig;
  if (typeof apexAngleOrConfig === 'number') {
    config = {
      ...DEFAULT_PRISM_CONFIG,
      apexAngleDeg: apexAngleOrConfig,
      apexPoint: prismPos ? { ...prismPos } : DEFAULT_PRISM_CONFIG.apexPoint,
    };
  } else {
    config = {
      ...apexAngleOrConfig,
      apexPoint: prismPos ? { ...prismPos } : apexAngleOrConfig.apexPoint,
    };
  }
  const apexDeg = config.apexAngleDeg;

  if (mode === 'monochromatic') {
    const colorObj = SPECTRAL_COLORS.find((c) => c.id === monochromaticId) || SPECTRAL_COLORS[3];
    const ray = solvePrismRay(iDeg, colorObj.refractiveIndex, colorObj.colorHex, colorObj.nameVi, config);
    return {
      apexDeg,
      rays: [ray],
      hasValidRay: ray.isValid,
      isTIR: ray.hasTIR,
      statusMessageKey: !ray.isValid ? (ray.hasTIR ? 'status.tirOccurred' : 'status.invalidGeometry') : 'status.valid',
    };
  }

  // White light mode: simulate all 7 spectral colors
  const rays = SPECTRAL_COLORS.map((c) =>
    solvePrismRay(iDeg, c.refractiveIndex, c.colorHex, c.nameVi, config)
  );

  const hasValidRay = rays.some((r) => r.isValid);
  const isTIR = rays.some((r) => r.hasTIR);

  return {
    apexDeg,
    rays,
    hasValidRay,
    isTIR,
    statusMessageKey: !hasValidRay ? (isTIR ? 'status.tirOccurred' : 'status.invalidGeometry') : 'status.valid',
  };
}

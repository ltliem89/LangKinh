/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'vi' | 'en';

export type LightMode = 'white' | 'monochromatic';

export interface SpectralColor {
  id: string;
  nameVi: string;
  nameEn: string;
  colorHex: string;
  wavelengthNm: number;
  // Illustrative refractive index for standard crown glass model (n ~ 1.514 - 1.538)
  refractiveIndex: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RayPathSegment {
  color: string;
  colorName: string;
  start: Point2D;
  hit1: Point2D;
  hit2: Point2D;
  end: Point2D;
  iDeg: number;       // Angle of incidence at face 1 (deg)
  r1Deg: number;     // Refraction angle at face 1 (deg)
  r2Deg: number;     // Incidence angle at face 2 (deg)
  eDeg: number;      // Emergence angle at face 2 (deg)
  deviationDeg: number; // Deviation angle D = i + e - A (deg)
  hasTIR: boolean;   // Total Internal Reflection at face 2?
  isValid: boolean;  // Did it hit faces properly?
}

export interface PrismPhysicsResult {
  apexDeg: number;
  rays: RayPathSegment[];
  hasValidRay: boolean;
  isTIR: boolean;
  statusMessageKey: string;
}

export interface PredictionOption {
  id: string;
  textVi: string;
  textEn: string;
  isCorrect: boolean;
  explanationVi: string;
  explanationEn: string;
}

export interface PredictionPrompt {
  id: string;
  titleVi: string;
  titleEn: string;
  questionVi: string;
  questionEn: string;
  options: PredictionOption[];
}

export interface QuizQuestion {
  id: number;
  questionVi: string;
  questionEn: string;
  optionsVi: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationVi: string;
  explanationEn: string;
}

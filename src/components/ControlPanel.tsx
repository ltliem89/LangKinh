/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SPECTRAL_COLORS } from '../physics/prismSolver';
import { Language, LightMode } from '../types';

interface ControlPanelProps {
  incidenceAngle: number;
  onAngleChange: (val: number) => void;
  lightMode: LightMode;
  onLightModeChange: (mode: LightMode) => void;
  selectedColorId: string;
  onColorChange: (colorId: string) => void;
  showNormals: boolean;
  onToggleNormals: () => void;
  showAngles: boolean;
  onToggleAngles: () => void;
  showRayExtension: boolean;
  onToggleRayExtension: () => void;
  showScreen: boolean;
  onToggleScreen: () => void;
  activeStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPrediction: () => void;
  onReset: () => void;
  lang: Language;
  t: (key: string) => string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  incidenceAngle,
  onAngleChange,
  lightMode,
  onLightModeChange,
  selectedColorId,
  onColorChange,
  showNormals,
  onToggleNormals,
  showAngles,
  onToggleAngles,
  showRayExtension,
  onToggleRayExtension,
  showScreen,
  onToggleScreen,
  activeStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onOpenPrediction,
  onReset,
  lang,
  t,
}) => {
  const anglePresets = [35, 45, 50, 60];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5 text-slate-200">
      {/* 1. Primary Variable: Angle of Incidence Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="angle-slider" className="text-sm font-semibold flex items-center gap-2 text-sky-300">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('control.incidenceAngle')} (i):
          </label>
          <div className="flex items-baseline gap-1 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60 font-mono">
            <span className="text-lg font-bold text-sky-400">{incidenceAngle.toFixed(1)}</span>
            <span className="text-xs text-slate-400">°</span>
          </div>
        </div>

        <input
          id="angle-slider"
          type="range"
          min="30"
          max="70"
          step="0.5"
          value={incidenceAngle}
          onChange={(e) => onAngleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          aria-label={t('control.incidenceAngle')}
        />

        {/* Quick Angle Presets */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-xs text-slate-400">{t('control.presets')}:</span>
          <div className="flex gap-1.5 flex-wrap">
            {anglePresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onAngleChange(val)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  Math.abs(incidenceAngle - val) < 0.2
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-750'
                }`}
              >
                {val}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Light Mode Selector (White Light vs Monochromatic) */}
      <div className="pt-2 border-t border-slate-800">
        <label className="text-sm font-semibold text-slate-300 block mb-2">
          {t('control.lightMode')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onLightModeChange('white')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
              lightMode === 'white'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm shadow-white" />
            {t('light.white')}
          </button>

          <button
            type="button"
            onClick={() => onLightModeChange('monochromatic')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
              lightMode === 'monochromatic'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            {t('light.monochromatic')}
          </button>
        </div>

        {/* Monochromatic Color Selector */}
        {lightMode === 'monochromatic' && (
          <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-2 font-medium">
              {t('control.color')}:
            </span>
            <div className="grid grid-cols-7 gap-1.5">
              {SPECTRAL_COLORS.map((col) => {
                const isSelected = selectedColorId === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => onColorChange(col.id)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-white bg-slate-800 shadow-md scale-105'
                        : 'border-transparent bg-slate-900/60 hover:bg-slate-800/60 opacity-80 hover:opacity-100'
                    }`}
                    title={`${lang === 'vi' ? col.nameVi : col.nameEn} (${col.wavelengthNm}nm)`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: col.colorHex }}
                    />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {lang === 'vi' ? col.nameVi : col.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Prediction Call-to-Action */}
      <div className="pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onOpenPrediction}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {t('action.predict')} &amp; {t('action.testPrediction')}
        </button>
      </div>

      {/* 4. Playback and Step-through Controls */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">
            {t('control.viewMode')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className={`px-3 py-1 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                  {t('action.pause')}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t('action.play')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-5 gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => onStepChange(0)}
            className={`py-1.5 rounded-lg border font-medium ${
              activeStep === 0
                ? 'bg-sky-500 text-slate-950 font-bold border-transparent'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {lang === 'vi' ? 'Toàn bộ' : 'All'}
          </button>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStepChange(s)}
              className={`py-1.5 rounded-lg border font-medium font-mono ${
                activeStep === s
                  ? 'bg-sky-500 text-slate-950 font-bold border-transparent'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={
                s === 1
                  ? t('control.stepIncident')
                  : s === 2
                  ? t('control.stepRefract1')
                  : s === 3
                  ? t('control.stepRefract2')
                  : t('control.stepScreen')
              }
            >
              B.{s}
            </button>
          ))}
        </div>

        {activeStep > 0 && (
          <p className="mt-2 text-[11px] text-sky-300/90 bg-sky-950/40 p-2 rounded-lg border border-sky-900/40">
            {activeStep === 1 && t('control.stepIncident')}
            {activeStep === 2 && t('control.stepRefract1')}
            {activeStep === 3 && t('control.stepRefract2')}
            {activeStep === 4 && t('control.stepScreen')}
          </p>
        )}
      </div>

      {/* 5. Display Toggles (Normals, Angles, Extensions, Screen) */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-slate-400 block mb-1">
          {lang === 'vi' ? 'Hiển thị yếu tố quang học' : 'Optical Elements'}
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 hover:bg-slate-800/40">
            <input
              type="checkbox"
              checked={showNormals}
              onChange={onToggleNormals}
              className="rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-300">{t('control.showNormals')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 hover:bg-slate-800/40">
            <input
              type="checkbox"
              checked={showAngles}
              onChange={onToggleAngles}
              className="rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-300">{t('control.showAngles')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 hover:bg-slate-800/40">
            <input
              type="checkbox"
              checked={showRayExtension}
              onChange={onToggleRayExtension}
              className="rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-300">{t('control.showRayExtension')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 hover:bg-slate-800/40">
            <input
              type="checkbox"
              checked={showScreen}
              onChange={onToggleScreen}
              className="rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-300">{t('control.showScreen')}</span>
          </label>
        </div>
      </div>

      {/* 6. Reset Control */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('action.reset')}
        </button>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language, LightMode, PrismPhysicsResult } from '../types';

interface ObservationPanelProps {
  physicsResult: PrismPhysicsResult;
  lightMode: LightMode;
  lang: Language;
  t: (key: string) => string;
}

export const ObservationPanel: React.FC<ObservationPanelProps> = ({
  physicsResult,
  lightMode,
  lang,
  t,
}) => {
  const { rays, hasValidRay, isTIR } = physicsResult;
  const refRay = rays && rays.length > 0 ? (rays.length === 1 ? rays[0] : rays[3]) : null;

  // Comparison between Red (idx 0) and Violet (idx 6) in white light
  const redRay = rays && rays.length === 7 ? rays[0] : null;
  const violetRay = rays && rays.length === 7 ? rays[6] : null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('observation.title')}
        </h3>

        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
          A = 60°
        </span>
      </div>

      {/* 1. Primary Numerical Readout Cards */}
      {refRay && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* i */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">{t('measure.incidence')}</span>
            <span className="text-lg font-bold text-sky-400 font-mono mt-1">
              {refRay.iDeg.toFixed(1)}°
            </span>
          </div>

          {/* r1 */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">{t('measure.refraction')}</span>
            <span className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {refRay.r1Deg.toFixed(1)}°
            </span>
          </div>

          {/* r2 */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">{t('measure.internalIncidence')}</span>
            <span className="text-lg font-bold text-amber-400 font-mono mt-1">
              {refRay.r2Deg.toFixed(1)}°
            </span>
          </div>

          {/* e */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">{t('measure.emergence')}</span>
            <span className="text-lg font-bold text-pink-400 font-mono mt-1">
              {refRay.hasTIR ? 'TIR' : `${refRay.eDeg.toFixed(1)}°`}
            </span>
          </div>

          {/* D */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-rose-900/40 col-span-2 sm:col-span-1 flex flex-col items-center bg-rose-950/10">
            <span className="text-[11px] text-rose-300 font-semibold">{t('measure.deviation')}</span>
            <span className="text-lg font-bold text-rose-400 font-mono mt-1">
              {refRay.hasTIR ? '--' : `${refRay.deviationDeg.toFixed(1)}°`}
            </span>
          </div>
        </div>
      )}

      {/* Geometry formula summary note */}
      <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
        <span>Công thức lăng kính:</span>
        <span className="text-sky-300">sin(i) = n·sin(r₁)</span>
        <span className="text-amber-300">r₁ + r₂ = A</span>
        <span className="text-pink-300">sin(e) = n·sin(r₂)</span>
        <span className="text-rose-300">D = i + e - A</span>
      </div>

      {/* 2. Spectral Data Table (for White Light) or Monochromatic Card */}
      {lightMode === 'white' && rays.length === 7 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              {t('observation.spectrum')} (7 màu)
            </h4>
            <span className="text-[11px] text-slate-400">
              {lang === 'vi' ? 'Sắp xếp từ Đỏ đến Tím' : 'Arranged from Red to Violet'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">{t('measure.colorCol')}</th>
                  <th className="py-2 px-3">{t('measure.wavelengthCol')}</th>
                  <th className="py-2 px-3">{t('measure.indexCol')}</th>
                  <th className="py-2 px-3">{t('measure.refraction')}</th>
                  <th className="py-2 px-3">{t('measure.emergence')}</th>
                  <th className="py-2 px-3">{t('measure.deviationCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {rays.map((ray, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-1.5 px-3 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: ray.color }}
                      />
                      <span className="font-sans font-medium text-slate-200">
                        {lang === 'vi' ? ray.colorName : ray.color}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-400">
                      {[700, 620, 580, 530, 480, 440, 400][idx]} nm
                    </td>
                    <td className="py-1.5 px-3 text-sky-400 font-semibold">
                      {[1.514, 1.517, 1.520, 1.524, 1.528, 1.533, 1.538][idx].toFixed(3)}
                    </td>
                    <td className="py-1.5 px-3 text-slate-300">{ray.r1Deg.toFixed(2)}°</td>
                    <td className="py-1.5 px-3 text-slate-300">
                      {ray.hasTIR ? 'TIR' : `${ray.eDeg.toFixed(2)}°`}
                    </td>
                    <td className="py-1.5 px-3 text-rose-400 font-bold">
                      {ray.hasTIR ? '--' : `${ray.deviationDeg.toFixed(2)}°`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deviation comparison callout */}
          {redRay && violetRay && !redRay.hasTIR && !violetRay.hasTIR && (
            <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-bold text-indigo-100">
                  {lang === 'vi' ? 'Quy luật góc lệch:' : 'Deviation law:'}
                </span>{' '}
                {lang === 'vi' ? (
                  <>
                    Tia tím lệch <strong className="text-purple-400">{violetRay.deviationDeg.toFixed(2)}°</strong>,
                    tia đỏ lệch <strong className="text-red-400">{redRay.deviationDeg.toFixed(2)}°</strong>.
                    Độ lệch góc quang phổ: <strong className="text-sky-300">ΔD = {(violetRay.deviationDeg - redRay.deviationDeg).toFixed(2)}°</strong>.
                    Tia tím luôn bị lệch nhiều nhất về phía đáy lăng kính vì n_tím {'>'} n_đỏ.
                  </>
                ) : (
                  <>
                    Violet deviates <strong className="text-purple-400">{violetRay.deviationDeg.toFixed(2)}°</strong>,
                    red deviates <strong className="text-red-400">{redRay.deviationDeg.toFixed(2)}°</strong>.
                    Spectral dispersion spread: <strong className="text-sky-300">ΔD = {(violetRay.deviationDeg - redRay.deviationDeg).toFixed(2)}°</strong>.
                    Violet consistently deviates the most toward the prism base because n_violet {'>'} n_red.
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Monochromatic Light Observation */
        <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-800/40 text-xs text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-md"
              style={{ backgroundColor: refRay?.color }}
            />
            <span>{t('observation.noSpectrum')}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {t('observation.monoSummary')}
          </p>
          <p className="text-slate-400 text-[11px]">
            {lang === 'vi'
              ? 'Ánh sáng đơn sắc có màu xác định và không bị tán sắc khi đi qua lăng kính, chỉ bị khúc xạ bẻ gãy phương truyền về phía đáy lăng kính.'
              : 'Monochromatic light has a definite single wavelength and does not disperse when passing through a prism; it only refracts toward the base.'}
          </p>
        </div>
      )}

      {/* 3. Qualitative Summary & Educational Alignment */}
      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {lang === 'vi' ? 'Kết luận bài học (Em đã học):' : 'Key Lesson Takeaways:'}
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
          <li>{t('observation.deviationRule')}</li>
          <li>
            {lightMode === 'white'
              ? t('observation.spectrumSummary')
              : t('observation.monoSummary')}
          </li>
          <li className="text-[11px] text-slate-500 italic">
            {t('observation.modelNote')}
          </li>
        </ul>
      </div>
    </div>
  );
};

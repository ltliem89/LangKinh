/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { THEORY_HINTS } from '../i18n/translations';
import { Language } from '../types';

interface TheoryAndHintsProps {
  lang: Language;
  t: (key: string) => string;
}

export const TheoryAndHints: React.FC<TheoryAndHintsProps> = ({ lang, t }) => {
  const [hintIndex, setHintIndex] = useState(0);
  const currentHint = THEORY_HINTS[hintIndex];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 text-slate-200">
      {/* 1. Progressive Hint Box */}
      <div className="bg-gradient-to-r from-amber-950/30 to-orange-950/30 p-4 rounded-xl border border-amber-800/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lang === 'vi' ? currentHint.titleVi : currentHint.titleEn}
          </span>
          <span className="text-[11px] font-mono text-amber-400/80">
            {hintIndex + 1} / {THEORY_HINTS.length}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'vi' ? currentHint.contentVi : currentHint.contentEn}
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            disabled={hintIndex === 0}
            onClick={() => setHintIndex((prev) => prev - 1)}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-30 border border-slate-700 transition-colors"
          >
            {t('action.prevHint')}
          </button>
          <button
            type="button"
            disabled={hintIndex === THEORY_HINTS.length - 1}
            onClick={() => setHintIndex((prev) => prev + 1)}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-30 transition-colors"
          >
            {t('action.nextHint')}
          </button>
        </div>
      </div>

      {/* 2. Textbook Key Concepts Accordion / Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          {lang === 'vi' ? 'Trọng tâm bài học (SGK KHTN 9 Bài 7)' : 'Curriculum Focus (Lesson 7)'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Khúc xạ qua lăng kính */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <h5 className="font-bold text-sky-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {lang === 'vi' ? '1. Đường truyền tia sáng' : '1. Light ray path'}
            </h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {lang === 'vi'
                ? 'Khi qua lăng kính, tia sáng bị khúc xạ hai lần tại hai mặt bên. Tia ló ra khỏi lăng kính luôn bị lệch về phía đáy lăng kính so với tia tới.'
                : 'Light refracts twice at both lateral faces. The emergent ray consistently deviates toward the prism base relative to the incident ray.'}
            </p>
          </div>

          {/* Card 2: Hiện tượng tán sắc */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <h5 className="font-bold text-purple-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              {lang === 'vi' ? '2. Tán sắc ánh sáng trắng' : '2. White light dispersion'}
            </h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {lang === 'vi'
                ? 'Ánh sáng trắng bị tách thành dải màu liên tục: Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím. Tia tím lệch nhiều nhất, tia đỏ lệch ít nhất.'
                : 'White light is split into a continuous spectrum: Red, Orange, Yellow, Green, Blue, Indigo, Violet. Violet deviates the most; red deviates the least.'}
            </p>
          </div>

          {/* Card 3: Ánh sáng đơn sắc */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {lang === 'vi' ? '3. Ánh sáng đơn sắc' : '3. Monochromatic light'}
            </h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {lang === 'vi'
                ? 'Ánh sáng đơn sắc là ánh sáng có một màu nhất định và không bị tán sắc khi truyền qua lăng kính, chỉ bị khúc xạ (đổi hướng).'
                : 'Monochromatic light has a single fixed color and does not disperse through a prism; it only refracts (changes direction).'}
            </p>
          </div>

          {/* Card 4: Ứng dụng thực tế */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <h5 className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              {lang === 'vi' ? '4. Ứng dụng thực tiễn' : '4. Practical applications'}
            </h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {lang === 'vi'
                ? 'Giải thích cầu vồng tự nhiên, chế tạo máy quang phổ lăng kính để phân tích thành phần ánh sáng, lăng kính phản xạ toàn phần trong ống nhòm.'
                : 'Explaining natural rainbows, constructing prism spectrometers to analyze light composition, and total internal reflection prisms in binoculars.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

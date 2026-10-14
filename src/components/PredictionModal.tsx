/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PREDICTION_PROMPTS } from '../i18n/translations';
import { Language } from '../types';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: (key: string) => string;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  isOpen,
  onClose,
  lang,
  t,
}) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isTested, setIsTested] = useState(false);

  if (!isOpen) return null;

  const currentPrompt = PREDICTION_PROMPTS[selectedPromptIndex];
  const selectedOption = currentPrompt.options.find((opt) => opt.id === selectedOptionId);

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    setIsTested(false);
  };

  const handleTest = () => {
    if (!selectedOptionId) return;
    setIsTested(true);
  };

  const handleNextPrompt = () => {
    setSelectedPromptIndex((prev) => (prev + 1) % PREDICTION_PROMPTS.length);
    setSelectedOptionId(null);
    setIsTested(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {t('action.predict')} &amp; {t('action.testPrediction')}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'vi' ? currentPrompt.titleVi : currentPrompt.titleEn}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Prompt Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-4 pt-2 gap-2 overflow-x-auto">
          {PREDICTION_PROMPTS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPromptIndex(idx);
                setSelectedOptionId(null);
                setIsTested(false);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                selectedPromptIndex === idx
                  ? 'bg-slate-800 text-sky-400 border-t-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? `Chủ đề ${idx + 1}` : `Topic ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-sm font-semibold text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {lang === 'vi' ? currentPrompt.questionVi : currentPrompt.questionEn}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentPrompt.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let itemBorder = 'border-slate-800 bg-slate-950/40 hover:bg-slate-850';
              if (isSelected) {
                itemBorder = 'border-sky-500 bg-sky-950/30 text-sky-200';
              }
              if (isTested) {
                if (opt.isCorrect) {
                  itemBorder = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  itemBorder = 'border-rose-500 bg-rose-950/40 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${itemBorder}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 border ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500 text-slate-950'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {lang === 'vi' ? opt.textVi : opt.textEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation after testing */}
          {isTested && selectedOption && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                selectedOption.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1.5">
                {selectedOption.isCorrect ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {t('feedback.correctPrediction')}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t('feedback.incorrectPrediction')}
                  </>
                )}
              </div>
              <p className="text-slate-300">
                {lang === 'vi'
                  ? selectedOption.explanationVi
                  : selectedOption.explanationEn}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleNextPrompt}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
          >
            {lang === 'vi' ? 'Đổi câu hỏi khác' : 'Try another prompt'}
          </button>

          <div className="flex gap-2">
            {!isTested ? (
              <button
                type="button"
                disabled={!selectedOptionId}
                onClick={handleTest}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('action.testPrediction')}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {lang === 'vi' ? 'Đóng & Quan sát mô phỏng' : 'Close & View simulation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

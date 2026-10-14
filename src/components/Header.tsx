/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLanguage: () => void;
  onReset: () => void;
  activeTab: 'experiment' | 'assessment' | 'theory';
  onTabChange: (tab: 'experiment' | 'assessment' | 'theory') => void;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLanguage,
  onReset,
  activeTab,
  onTabChange,
  t,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Titles */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-sky-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              {/* Prism refraction icon */}
              <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3L2 21h20L12 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#f43f5e" d="M3 13l9 2 9-5" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                {t('app.title')}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-semibold text-sky-300">
                {t('app.curriculumTag')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Main Tabs */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onTabChange('experiment')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'experiment'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Thí nghiệm' : 'Experiment'}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('assessment')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'assessment'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Thử thách (5)' : 'Quiz (5)'}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('theory')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'theory'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Lí thuyết' : 'Theory'}
            </button>
          </nav>

          {/* Bilingual Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 shadow-sm transition-all"
            title={t('accessibility.languageSwitch')}
            aria-label={t('accessibility.languageSwitch')}
          >
            <span className="text-sm">🌐</span>
            <span className="font-mono">{lang === 'vi' ? 'VI' : 'EN'}</span>
            <span className="text-[10px] text-slate-400">| {lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

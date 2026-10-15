/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ControlPanel } from './components/ControlPanel';
import { Header } from './components/Header';
import { ObservationPanel } from './components/ObservationPanel';
import { PredictionModal } from './components/PredictionModal';
import { PrismCanvas } from './components/PrismCanvas';
import { TheoryAndHints } from './components/TheoryAndHints';
import { TRANSLATIONS } from './i18n/translations';
import { computePrismSimulation } from './physics/prismSolver';
import { Language, LightMode, Point2D } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [activeTab, setActiveTab] = useState<'experiment' | 'assessment' | 'theory'>('experiment');
  const [incidenceAngle, setIncidenceAngle] = useState<number>(50.0);
  const [apexAngle, setApexAngle] = useState<number>(60);
  const [prismPos, setPrismPos] = useState<Point2D>({ x: 440, y: 140 });
  const [lightMode, setLightMode] = useState<LightMode>('white');
  const [selectedColorId, setSelectedColorId] = useState<string>('green');

  // Display toggles
  const [showNormals, setShowNormals] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showRayExtension, setShowRayExtension] = useState<boolean>(true);
  const [showScreen, setShowScreen] = useState<boolean>(true);

  // Playback & Step-through
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = all
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Prediction modal
  const [isPredictionOpen, setIsPredictionOpen] = useState<boolean>(false);

  // Translation helper
  const t = useCallback(
    (key: string): string => {
      const dict = TRANSLATIONS[lang] as Record<string, string>;
      return dict[key] || key;
    },
    [lang]
  );

  // Toggle Language without resetting experiment or state
  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  // Compute physics result in real time
  const physicsResult = useMemo(() => {
    return computePrismSimulation(incidenceAngle, lightMode, selectedColorId, apexAngle, prismPos);
  }, [incidenceAngle, lightMode, selectedColorId, apexAngle, prismPos]);

  // Animation cycle for step-through
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === 0 || prev >= 4) return 1;
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Reset to default settings
  const handleReset = () => {
    setIncidenceAngle(50.0);
    setApexAngle(60);
    setPrismPos({ x: 440, y: 140 });
    setLightMode('white');
    setSelectedColorId('green');
    setShowNormals(true);
    setShowAngles(true);
    setShowRayExtension(true);
    setShowScreen(true);
    setActiveStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* 1. Header with Language Switch & Tabs */}
      <Header
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        onReset={handleReset}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        t={t}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: EXPERIMENT VIEW */}
        {activeTab === 'experiment' && (
          <div className="space-y-6">
            {/* Top Interactive Banner / Quick Guide */}
            <div className="bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 font-bold shrink-0">
                  💡
                </span>
                <span>
                  {lang === 'vi'
                    ? 'Kéo nguồn sáng hoặc dùng thanh trượt để thay đổi góc tới i. Dự đoán trước hiện tượng và quan sát tia ló trên màn!'
                    : 'Drag the light source or use the slider to change incidence angle i. Make a prediction and observe the emergent ray on the screen!'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPredictionOpen(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-md hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-1.5"
                >
                  <span>🎯</span>
                  <span>{t('action.predict')}</span>
                </button>
              </div>
            </div>

            {/* Experiment Grid: Canvas on Left, Controls & Observations on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Canvas (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <PrismCanvas
                  physicsResult={physicsResult}
                  incidenceAngle={incidenceAngle}
                  onAngleChange={setIncidenceAngle}
                  apexAngle={apexAngle}
                  prismPos={prismPos}
                  onPrismPosChange={setPrismPos}
                  lightMode={lightMode}
                  showNormals={showNormals}
                  showAngles={showAngles}
                  showRayExtension={showRayExtension}
                  showScreen={showScreen}
                  activeStep={activeStep}
                  isPlaying={isPlaying}
                  lang={lang}
                  t={t}
                />

                {/* Quick Hint Card under Canvas */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">ℹ️</span>
                    <span>
                      {lang === 'vi'
                        ? 'Chiết suất n_tím > n_đỏ nên tia tím lệch nhiều nhất, tia đỏ lệch ít nhất.'
                        : 'Since n_violet > n_red, violet deviates most and red deviates least.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('theory')}
                    className="text-sky-400 hover:underline font-semibold shrink-0 ml-2"
                  >
                    {lang === 'vi' ? 'Xem lí thuyết →' : 'Read theory →'}
                  </button>
                </div>
              </div>

              {/* Right Column: Controls & Real-time Observations (5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-6">
                <ControlPanel
                  incidenceAngle={incidenceAngle}
                  onAngleChange={setIncidenceAngle}
                  apexAngle={apexAngle}
                  onApexAngleChange={setApexAngle}
                  prismPos={prismPos}
                  onPrismPosChange={setPrismPos}
                  lightMode={lightMode}
                  onLightModeChange={setLightMode}
                  selectedColorId={selectedColorId}
                  onColorChange={setSelectedColorId}
                  showNormals={showNormals}
                  onToggleNormals={() => setShowNormals((v) => !v)}
                  showAngles={showAngles}
                  onToggleAngles={() => setShowAngles((v) => !v)}
                  showRayExtension={showRayExtension}
                  onToggleRayExtension={() => setShowRayExtension((v) => !v)}
                  showScreen={showScreen}
                  onToggleScreen={() => setShowScreen((v) => !v)}
                  activeStep={activeStep}
                  onStepChange={setActiveStep}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying((v) => !v)}
                  onOpenPrediction={() => setIsPredictionOpen(true)}
                  onReset={handleReset}
                  lang={lang}
                  t={t}
                />

                <ObservationPanel
                  physicsResult={physicsResult}
                  lightMode={lightMode}
                  lang={lang}
                  t={t}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINAL ASSESSMENT (5 Questions) */}
        {activeTab === 'assessment' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <AssessmentQuiz lang={lang} t={t} />
          </div>
        )}

        {/* TAB 3: THEORY & HINTS */}
        {activeTab === 'theory' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <TheoryAndHints lang={lang} t={t} />
          </div>
        )}
      </main>

      {/* 3. Prediction Modal */}
      <PredictionModal
        isOpen={isPredictionOpen}
        onClose={() => setIsPredictionOpen(false)}
        lang={lang}
        t={t}
      />

      {/* 4. Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {lang === 'vi'
              ? 'Mô phỏng Thí nghiệm Lăng kính • KHTN 9 Kết nối tri thức với cuộc sống (Trang 34-39)'
              : 'Prism Optics Virtual Experiment • Grade 9 Natural Science (pp. 34-39)'}
          </span>
          <span className="text-[11px] text-slate-600">
            {t('app.disclaimer')}
          </span>
        </div>
      </footer>
    </div>
  );
}

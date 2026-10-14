/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../i18n/translations';
import { Language } from '../types';

interface AssessmentQuizProps {
  lang: Language;
  t: (key: string) => string;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ lang, t }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = QUIZ_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQ.id];
  const isCurrentSubmitted = !!submittedQuestions[currentQ.id];

  const handleSelectAnswer = (optionIdx: number) => {
    if (isCurrentSubmitted) return; // Prevent changing after submitting this question
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleSubmitCurrent = () => {
    if (selectedAnswer === undefined) return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRetryAll = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  const handleRetryCurrent = () => {
    setSubmittedQuestions((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  // Calculate score
  const score = Object.keys(submittedQuestions).reduce((acc, qIdStr) => {
    const qId = parseInt(qIdStr, 10);
    const q = questions.find((item) => item.id === qId);
    if (q && userAnswers[qId] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            {t('assessment.title')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t('assessment.subtitle')}</p>
        </div>

        {/* Progress & Live Score Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">{t('assessment.score')}:</span>
            <span className="font-bold text-sky-400">
              {score} / {questions.length}
            </span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-4">
          {/* Question Nav Pills */}
          <div className="flex gap-2">
            {questions.map((q, idx) => {
              const isAnswered = submittedQuestions[q.id];
              const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
              const isCurrent = currentQuestionIndex === idx;

              let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
              if (isCurrent) {
                btnClass = 'ring-2 ring-sky-400 bg-slate-800 text-sky-300 font-bold border-sky-500';
              } else if (isAnswered) {
                btnClass = isCorrect
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-600 font-bold'
                  : 'bg-rose-950 text-rose-400 border-rose-600 font-bold';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg border text-xs flex items-center justify-center font-mono transition-all ${btnClass}`}
                  title={`${t('assessment.question')} ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 text-xs font-mono font-semibold">
                {t('assessment.question')} {currentQuestionIndex + 1}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {lang === 'vi' ? currentQ.questionVi : currentQ.questionEn}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {(lang === 'vi' ? currentQ.optionsVi : currentQ.optionsEn).map(
                (optText, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  let optStyle = 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300';

                  if (isCurrentSubmitted) {
                    if (optIdx === currentQ.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (isSelected && optIdx !== currentQ.correctIndex) {
                      optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    } else {
                      optStyle = 'border-slate-850 bg-slate-950/30 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-sky-500 bg-sky-950/40 text-sky-200 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isCurrentSubmitted}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{optText}</span>
                    </button>
                  );
                }
              )}
            </div>

            {/* Explanation card after submit */}
            {isCurrentSubmitted && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed mt-3 space-y-2 ${
                  selectedAnswer === currentQ.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {lang === 'vi' ? 'Đúng (+1 điểm)' : 'Correct (+1 pt)'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {lang === 'vi' ? 'Chưa chính xác' : 'Incorrect'}
                      </>
                    )}
                  </span>

                  {/* Retry button for this item */}
                  <button
                    type="button"
                    onClick={handleRetryCurrent}
                    className="text-[11px] underline font-semibold text-slate-300 hover:text-white"
                  >
                    {t('feedback.tryAgain')}
                  </button>
                </div>

                <p className="text-slate-300">
                  <strong className="text-slate-200">{t('feedback.explanation')}:</strong>{' '}
                  {lang === 'vi' ? currentQ.explanationVi : currentQ.explanationEn}
                </p>
              </div>
            )}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrev}
              className="px-3.5 py-2 text-xs bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-slate-300 font-medium"
            >
              {lang === 'vi' ? '← Câu trước' : '← Previous'}
            </button>

            {!isCurrentSubmitted ? (
              <button
                type="button"
                disabled={selectedAnswer === undefined}
                onClick={handleSubmitCurrent}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {t('action.submitAnswer')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {currentQuestionIndex < questions.length - 1
                  ? t('action.nextQuestion')
                  : lang === 'vi'
                  ? 'Xem tổng kết điểm'
                  : 'View final result'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Summary & Final Score View */
        <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <span className="text-2xl font-black font-mono">{score}/5</span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-100">
              {score === 5
                ? lang === 'vi'
                  ? 'Tuyệt vời! Đạt điểm tối đa'
                  : 'Outstanding! Perfect Score'
                : score >= 4
                ? lang === 'vi'
                  ? 'Làm rất tốt!'
                  : 'Great Job!'
                : lang === 'vi'
                ? 'Hãy cố gắng thêm!'
                : 'Keep practicing!'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {score === 5
                ? t('assessment.congratsPerfect')
                : score >= 4
                ? t('assessment.goodEffort')
                : t('assessment.reviewNeeded')}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRetryAll}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('action.retryQuiz')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCompleted(false);
                setCurrentQuestionIndex(0);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs rounded-xl font-medium"
            >
              {lang === 'vi' ? 'Xem lại các câu hỏi' : 'Review questions'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const EVAL_STEPS = [
  'Initializing analysis...',
  'Parsing document data...',
  'Matching EB-1A & EB-2 NIW criteria...',
  'Evaluating publications & citations...',
  'Generating evaluation report...',
  'Complete — Report generated successfully!',
]

const STEP_THRESHOLDS = [0, 15, 35, 55, 75, 95]

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function EvaluationModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [sessionId] = useState(() => crypto.randomUUID())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current!)
          return 100
        }
        return p + 1
      })
    }, 55)
    return () => clearInterval(intervalRef.current!)
  }, [])

  const currentStep = STEP_THRESHOLDS.reduce(
    (acc, threshold, i) => (progress >= threshold ? i : acc),
    0,
  )
  const completedSteps = STEP_THRESHOLDS.filter((t) => progress > t).length
  const strokeOffset = CIRCUMFERENCE * (1 - progress / 100)
  const isDone = progress === 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl"
        style={{ background: 'linear-gradient(150deg, #4338ca 0%, #3730a3 40%, #1d4ed8 100%)' }}
      >
        {isDone && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}

        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
            <circle
              cx="72" cy="72" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <span className="text-3xl font-bold text-white tabular-nums">{progress}%</span>
        </div>

        <h2 className="text-xl font-bold text-white text-center">
          {isDone ? 'Evaluation Complete' : 'Evaluating Criteria'}
        </h2>

        <div className="w-full flex flex-col gap-2 font-mono text-sm">
          {EVAL_STEPS.map((step, i) => {
            const done = i < completedSteps
            const active = i === currentStep && !isDone
            return (
              <div
                key={step}
                className="flex items-start gap-2.5 transition-opacity duration-300"
                style={{ opacity: i <= currentStep || isDone ? 1 : 0.3 }}
              >
                {done || (isDone && i === EVAL_STEPS.length - 1) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-white/70 mx-auto mt-1 ${active ? 'animate-pulse' : ''}`} />
                  </div>
                )}
                <span className={done ? 'text-emerald-400' : active ? 'text-white' : 'text-white/40'}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {isDone && (
          <button
            type="button"
            onClick={() => router.push('/results')}
            className="w-full py-3 rounded-xl text-sm font-bold text-white/90 border border-white/30 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
            </svg>
            View Full Report
          </button>
        )}

        <p className="text-[11px] text-white/30 font-mono tracking-wide text-center w-full border-t border-white/10 pt-4">
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  )
}

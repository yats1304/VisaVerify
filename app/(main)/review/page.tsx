'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkEntry = {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  roleLevel: string
}

type EducationEntry = {
  id: string
  institution: string
  fieldOfStudy: string
  graduationDate: string
  degree: string
  location: string
}

type PublicationEntry = {
  id: string
  title: string
  year: string
  venue: string
  citations: string
  peerReviewed: boolean
}

type PersonalInfo = {
  fullName: string
  email: string
  phone: string
  fieldOfExpertise: string
}

// ─── Mock Pre-filled Data (simulated AI extraction) ───────────────────────────

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: 'Dr. Arjun Mehta',
  email: 'arjun.mehta@stanford.edu',
  phone: '+1 (650) 555-0142',
  fieldOfExpertise: 'Machine Learning & Computational Biology',
}

const INITIAL_WORK: WorkEntry[] = [
  {
    id: crypto.randomUUID(),
    position: 'Senior Research Scientist',
    company: 'Stanford University',
    location: 'Stanford, CA',
    startDate: '2020-09',
    endDate: '',
    current: true,
    roleLevel: 'Senior',
  },
  {
    id: crypto.randomUUID(),
    position: 'Research Engineer',
    company: 'Google DeepMind',
    location: 'Mountain View, CA',
    startDate: '2017-06',
    endDate: '2020-08',
    current: false,
    roleLevel: 'Regular',
  },
]

const INITIAL_EDUCATION: EducationEntry[] = [
  {
    id: crypto.randomUUID(),
    institution: 'Massachusetts Institute of Technology',
    fieldOfStudy: 'Computer Science & Artificial Intelligence',
    graduationDate: '2017-05',
    degree: "PhD / Doctorate",
    location: 'Cambridge, MA',
  },
  {
    id: crypto.randomUUID(),
    institution: 'Indian Institute of Technology Bombay',
    fieldOfStudy: 'Computer Science & Engineering',
    graduationDate: '2012-05',
    degree: "Bachelor's",
    location: 'Mumbai, India',
  },
]

const INITIAL_PUBLICATIONS: PublicationEntry[] = [
  {
    id: crypto.randomUUID(),
    title: 'Scalable Transformer Architectures for Genomic Sequence Prediction',
    year: '2023',
    venue: 'Nature Machine Intelligence',
    citations: '142',
    peerReviewed: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'Attention Mechanisms in Multi-Omics Data Integration',
    year: '2022',
    venue: 'NeurIPS 2022',
    citations: '89',
    peerReviewed: true,
  },
]

const ROLE_LEVELS = ['Intern', 'Junior', 'Regular', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level']
const DEGREE_OPTIONS = ["Bachelor's", "Master's", "PhD / Doctorate", 'Associate', 'Professional Degree', 'Other']

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  subtitle,
  onAdd,
  addLabel,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onAdd?: () => void
  addLabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-slate-50 text-[15px] leading-tight">{title}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#7c3aed] bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              {addLabel}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] dark:focus:border-purple-500 transition-colors'

const selectCls =
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] dark:focus:border-purple-500 transition-colors'

// ─── Evaluation Modal ─────────────────────────────────────────────────────────

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

function EvaluationModal({ onClose }: { onClose: () => void }) {
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl"
        style={{ background: 'linear-gradient(150deg, #4338ca 0%, #3730a3 40%, #1d4ed8 100%)' }}
      >
        {/* Close — only show when done */}
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

        {/* Circular progress */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
            {/* Track */}
            <circle
              cx="72" cy="72" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="10"
            />
            {/* Progress arc */}
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

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center">
          {isDone ? 'Evaluation Complete' : 'Evaluating Criteria'}
        </h2>

        {/* Steps log */}
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
                <span
                  className={
                    done
                      ? 'text-emerald-400'
                      : active
                      ? 'text-white'
                      : 'text-white/40'
                  }
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* View Report CTA — shown when done */}
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

        {/* Session ID */}
        <p className="text-[11px] text-white/30 font-mono tracking-wide text-center w-full border-t border-white/10 pt-4">
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const router = useRouter()

  const [personal, setPersonal] = useState<PersonalInfo>(INITIAL_PERSONAL)
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(INITIAL_WORK)
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(INITIAL_EDUCATION)
  const [publications, setPublications] = useState<PublicationEntry[]>(INITIAL_PUBLICATIONS)
  const [showEval, setShowEval] = useState(false)

  // ── Work handlers ──
  function addWork() {
    setWorkEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        roleLevel: 'Regular',
      },
    ])
  }
  function updateWork<K extends keyof WorkEntry>(id: string, key: K, value: WorkEntry[K]) {
    setWorkEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)))
  }
  function removeWork(id: string) {
    setWorkEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // ── Education handlers ──
  function addEducation() {
    setEducationEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        institution: '',
        fieldOfStudy: '',
        graduationDate: '',
        degree: "Bachelor's",
        location: '',
      },
    ])
  }
  function updateEducation<K extends keyof EducationEntry>(id: string, key: K, value: EducationEntry[K]) {
    setEducationEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)))
  }
  function removeEducation(id: string) {
    setEducationEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // ── Publication handlers ──
  function addPublication() {
    setPublications((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        year: '',
        venue: '',
        citations: '',
        peerReviewed: false,
      },
    ])
  }
  function updatePublication<K extends keyof PublicationEntry>(id: string, key: K, value: PublicationEntry[K]) {
    setPublications((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)))
  }
  function removePublication(id: string) {
    setPublications((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <>
    {showEval && <EvaluationModal onClose={() => setShowEval(false)} />}
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div
        className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-8 sm:mb-10 relative overflow-hidden px-6 sm:px-10 py-9 sm:py-12"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 45%, #2563eb 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="absolute -bottom-8 left-1/4 w-36 h-36 rounded-full opacity-[0.07]" style={{ background: 'white' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 max-w-5xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-purple-100 uppercase">Step 2 of 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 leading-tight">
              Review Extracted Resume
            </h1>
            <p className="text-purple-100 text-sm sm:text-[15px] leading-relaxed">
              Our AI has pre-filled your information. Review and correct any details before evaluation.
            </p>
          </div>

          {/* AI extraction badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 self-start">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-white text-xs font-semibold leading-snug">AI extraction<br />complete</span>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">

        {/* Personal Information */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
          }
          title="Personal Information"
          subtitle="Basic contact and professional details extracted from your document"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                className={inputCls}
                value={personal.fullName}
                onChange={(e) => setPersonal((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="e.g. Dr. Jane Smith"
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                className={inputCls}
                value={personal.email}
                onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone Number">
              <input
                className={inputCls}
                value={personal.phone}
                onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </Field>
            <Field label="Field of Expertise">
              <input
                className={inputCls}
                value={personal.fieldOfExpertise}
                onChange={(e) => setPersonal((p) => ({ ...p, fieldOfExpertise: e.target.value }))}
                placeholder="e.g. Machine Learning, Immigration Law"
              />
            </Field>
          </div>
        </SectionCard>

        {/* Work Experience */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
              <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
            </svg>
          }
          title="Work Experience"
          subtitle="Professional positions and employment history"
          onAdd={addWork}
          addLabel="Add Position"
        >
          {workEntries.map((entry, idx) => (
            <div key={entry.id} className="flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Position {idx + 1}
                </span>
                {workEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWork(entry.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Position / Title">
                  <input
                    className={inputCls}
                    value={entry.position}
                    onChange={(e) => updateWork(entry.id, 'position', e.target.value)}
                    placeholder="e.g. Research Scientist"
                  />
                </Field>
                <Field label="Company / Organization">
                  <input
                    className={inputCls}
                    value={entry.company}
                    onChange={(e) => updateWork(entry.id, 'company', e.target.value)}
                    placeholder="e.g. Stanford University"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={entry.location}
                    onChange={(e) => updateWork(entry.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <Field label="Start Date">
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.startDate}
                    onChange={(e) => updateWork(entry.id, 'startDate', e.target.value)}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.endDate}
                    onChange={(e) => updateWork(entry.id, 'endDate', e.target.value)}
                    disabled={entry.current}
                  />
                </Field>
                <Field label="Role Level">
                  <select
                    className={selectCls}
                    value={entry.roleLevel}
                    onChange={(e) => updateWork(entry.id, 'roleLevel', e.target.value)}
                  >
                    {ROLE_LEVELS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={entry.current}
                  onChange={(e) => updateWork(entry.id, 'current', e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">Currently working here</span>
              </label>
            </div>
          ))}
        </SectionCard>

        {/* Education */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 1-8.105 2.571.75.75 0 0 1-.832-.802 47.676 47.676 0 0 1 1.476-3.282ZM5.76 12.541a.75.75 0 0 1 .832.802 47.676 47.676 0 0 1-1.476 3.282 48.43 48.43 0 0 1-7.666 3.282.75.75 0 0 1-.46-.711 47.598 47.598 0 0 1 .255-4.284 48.45 48.45 0 0 1 7.515 3.431Z" />
            </svg>
          }
          title="Education"
          subtitle="Academic degrees and qualifications"
          onAdd={addEducation}
          addLabel="Add Entry"
        >
          {educationEntries.map((entry, idx) => (
            <div key={entry.id} className="flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Entry {idx + 1}
                </span>
                {educationEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(entry.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Institution">
                  <input
                    className={inputCls}
                    value={entry.institution}
                    onChange={(e) => updateEducation(entry.id, 'institution', e.target.value)}
                    placeholder="e.g. MIT"
                  />
                </Field>
                <Field label="Field of Study">
                  <input
                    className={inputCls}
                    value={entry.fieldOfStudy}
                    onChange={(e) => updateEducation(entry.id, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </Field>
                <Field label="Degree">
                  <select
                    className={selectCls}
                    value={entry.degree}
                    onChange={(e) => updateEducation(entry.id, 'degree', e.target.value)}
                  >
                    {DEGREE_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Graduation Date">
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.graduationDate}
                    onChange={(e) => updateEducation(entry.id, 'graduationDate', e.target.value)}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={entry.location}
                    onChange={(e) => updateEducation(entry.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                </Field>
              </div>
            </div>
          ))}
        </SectionCard>

        {/* Publications */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          }
          title="Publications & Research"
          subtitle="Academic papers, journals, and conference proceedings"
          onAdd={addPublication}
          addLabel="Add Publication"
        >
          {publications.map((entry, idx) => (
            <div key={entry.id} className="flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Publication {idx + 1}
                </span>
                {publications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePublication(entry.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              <Field label="Publication Title">
                <input
                  className={inputCls}
                  value={entry.title}
                  onChange={(e) => updatePublication(entry.id, 'title', e.target.value)}
                  placeholder="e.g. Attention Mechanisms in Multi-Omics Data"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Year">
                  <input
                    className={inputCls}
                    value={entry.year}
                    onChange={(e) => updatePublication(entry.id, 'year', e.target.value)}
                    placeholder="2024"
                    maxLength={4}
                  />
                </Field>
                <Field label="Venue / Journal">
                  <input
                    className={inputCls}
                    value={entry.venue}
                    onChange={(e) => updatePublication(entry.id, 'venue', e.target.value)}
                    placeholder="e.g. Nature, NeurIPS"
                  />
                </Field>
                <Field label="Citations">
                  <input
                    className={inputCls}
                    value={entry.citations}
                    onChange={(e) => updatePublication(entry.id, 'citations', e.target.value)}
                    placeholder="0"
                    type="number"
                    min={0}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={entry.peerReviewed}
                  onChange={(e) => updatePublication(entry.id, 'peerReviewed', e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">Peer reviewed</span>
              </label>
            </div>
          ))}
        </SectionCard>

      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="max-w-4xl mx-auto w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center sm:text-left">
          <span className="font-semibold text-gray-500 dark:text-slate-400">AI-extracted data.</span>{' '}
          Please verify all fields for accuracy before evaluation.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => router.push('/upload')}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Skip Review
          </button>
          <button
            type="button"
            onClick={() => setShowEval(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            Save &amp; Evaluate
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

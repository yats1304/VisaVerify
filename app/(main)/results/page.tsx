'use client'

import { useRouter } from 'next/navigation'

// ─── Mock Report Data ─────────────────────────────────────────────────────────

type CriterionStatus = 'MET' | 'PARTIALLY MET' | 'NOT MET'

type Criterion = {
  id: number
  name: string
  status: CriterionStatus
  analysis: string
  evidence: string[]
}

const REPORT = {
  applicantName: 'Dr. Arjun Mehta',
  visaType: 'EB-2 NIW',
  generatedDate: 'May 23, 2026',
  viability: 'Strong' as const,
  confidence: 80,

  overallAssessment:
    'Dr. Mehta presents a compelling profile for the EB-2 National Interest Waiver. His PhD from MIT and senior research position at Stanford University establish a strong academic and professional foundation. With 2 peer-reviewed publications accumulating 231 combined citations, his research in Machine Learning & Computational Biology has demonstrated measurable impact in the field. His work directly supports U.S. leadership in AI-driven healthcare innovation. To further strengthen the petition, we recommend developing a detailed proposed endeavor statement and obtaining 4–6 independent letters of recommendation that quantify the national significance of his contributions.',

  strengthAreas: [
    'Advanced Degree (PhD from MIT) with 9+ years of specialized research experience.',
    'Senior Research Scientist position at a top-ranked U.S. university (Stanford).',
    'Peer-reviewed publications in high-impact venues with 231 combined citations.',
    'Research area (ML & Computational Biology) directly addresses U.S. national health priorities.',
    'Prior industry experience at Google DeepMind demonstrates cross-sector impact.',
  ],

  nextSteps: [
    "Work with an immigration attorney to define a compelling 'Proposed Endeavor' statement highlighting national importance.",
    'Compile and document citation counts for all publications using Google Scholar and Scopus.',
    'Identify and solicit 4–6 letters of recommendation from independent experts in the field.',
    'Gather formal evidence of any peer-review, judging, or advisory board activities.',
    'Draft a personal statement connecting past achievements to future U.S.-based plans.',
  ],

  industryContext:
    'Machine Learning applied to Computational Biology is a critical, high-growth sector in U.S. biotechnology and healthcare industries, vital for developing treatments for cancer, genetic disorders, and other serious diseases. Retaining a PhD-level scientist with Dr. Mehta\'s track record directly supports U.S. leadership in medical innovation and addresses national health priorities. His expertise is in high demand and contributes to a field with significant economic and societal benefits.',

  criteria: [
    {
      id: 1,
      name: 'Educational Eligibility (EB-2 Qualification)',
      status: 'MET' as CriterionStatus,
      analysis:
        'Applicant holds a PhD from MIT, which exceeds the EB-2(A) advanced degree requirement. This automatically qualifies for EB-2 educational eligibility.',
      evidence: [
        'EB-2(A) — Advanced Degree (PhD, MIT, 2017)',
        'Ongoing senior research appointment at Stanford University',
      ],
    },
    {
      id: 2,
      name: 'Well Positioned to Advance the Proposed Endeavor',
      status: 'MET' as CriterionStatus,
      analysis:
        "Dr. Mehta's 9 years of continuous research in ML & Computational Biology, combined with his senior role at Stanford, demonstrates strong positioning to advance his proposed endeavor in AI-driven genomic research.",
      evidence: [
        'Senior Research Scientist, Stanford (2020–present)',
        'Research Engineer, Google DeepMind (2017–2020)',
        'PhD specialization in Computer Science & AI',
      ],
    },
    {
      id: 3,
      name: 'Proposed Endeavor Has Substantial Merit',
      status: 'PARTIALLY MET' as CriterionStatus,
      analysis:
        "The applicant's research area has clear national importance, but a formal 'Proposed Endeavor' statement with specific objectives and measurable U.S. benefit has not yet been documented. This is a critical gap to address before filing.",
      evidence: [
        '2 peer-reviewed publications in Nature Machine Intelligence and NeurIPS',
        '231 combined citations across publications',
        'Recommendation: Draft a detailed proposed endeavor statement',
      ],
    },
    {
      id: 4,
      name: 'National Interest — Benefit to the U.S.',
      status: 'MET' as CriterionStatus,
      analysis:
        "AI applications in genomic medicine directly address U.S. national health priorities. The applicant's research contributes to fields explicitly named in the NIH and NSF strategic priorities for the next decade.",
      evidence: [
        'Field: ML & Computational Biology',
        'Published in Nature Machine Intelligence (top-tier venue)',
        'Aligns with NIH Strategic Plan for Data Science',
      ],
    },
    {
      id: 5,
      name: 'Waiver of Job Offer is in National Interest',
      status: 'PARTIALLY MET' as CriterionStatus,
      analysis:
        "The applicant's research cannot reasonably be expected to stop for a traditional labor certification process without significant disruption to ongoing U.S.-based research programs. However, stronger evidence of unique qualifications is needed.",
      evidence: [
        'Active research projects at Stanford',
        'Recommendation: Secure 4–6 independent expert letters',
        'Recommendation: Document any funded grants or patent applications',
      ],
    },
  ] as Criterion[],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CriterionStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  MET: {
    label: 'MET',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    dot: 'bg-emerald-500',
  },
  'PARTIALLY MET': {
    label: 'PARTIAL',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/40',
    dot: 'bg-amber-500',
  },
  'NOT MET': {
    label: 'NOT MET',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/40',
    dot: 'bg-rose-500',
  },
}

const VIABILITY_CONFIG = {
  Strong: { color: 'text-emerald-500', bar: 'linear-gradient(90deg, #10b981, #059669)' },
  Viable: { color: 'text-amber-500', bar: 'linear-gradient(90deg, #f59e0b, #d97706)' },
  Weak: { color: 'text-rose-500', bar: 'linear-gradient(90deg, #f43f5e, #e11d48)' },
}

// ─── Components ───────────────────────────────────────────────────────────────

function ReportCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-slate-500 shrink-0 mt-2" />
          <span className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            {i + 1}
          </span>
          <span className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter()
  const viabilityCfg = VIABILITY_CONFIG[REPORT.viability]

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div
        className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-8 sm:mb-10 relative overflow-hidden px-6 sm:px-10 py-9 sm:py-12"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 45%, #2563eb 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="absolute -bottom-8 left-1/4 w-36 h-36 rounded-full opacity-[0.07]" style={{ background: 'white' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 max-w-5xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-purple-100 uppercase">Step 3 of 3 — Evaluation Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Evaluation Report</h1>
            <p className="text-purple-100 text-sm sm:text-[15px]">
              AI-generated visa eligibility analysis for {REPORT.applicantName}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/upload')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors cursor-pointer self-start shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" transform="rotate(90 10 10)" />
            </svg>
            New Evaluation
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">

        {/* ── Report Header Card ── */}
        <ReportCard>
          <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span
                className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider mb-2"
                style={{ background: '#ede9fe', color: '#7c3aed' }}
              >
                {REPORT.visaType}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{REPORT.applicantName}</h2>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Generated on {REPORT.generatedDate}</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] cursor-pointer shrink-0 self-start sm:self-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Download PDF Report
            </button>
          </div>
        </ReportCard>

        {/* ── Viability + Overall Assessment ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

          {/* Viability Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="h-[3px]" style={{ background: viabilityCfg.bar }} />
            <div className="p-6 flex flex-col items-center text-center gap-2">
              <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 dark:text-slate-500 uppercase">Viability Estimate</p>
              <p className={`text-4xl font-bold leading-none mt-1 ${viabilityCfg.color}`}>
                {REPORT.viability}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                with <span className="font-bold text-gray-800 dark:text-slate-200">{REPORT.confidence}%</span> confidence
              </p>

              {/* Confidence bar */}
              <div className="w-full mt-3 h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${REPORT.confidence}%`, background: viabilityCfg.bar }}
                />
              </div>

              {/* Criteria summary */}
              <div className="flex items-center gap-3 mt-4 w-full justify-center">
                {(['MET', 'PARTIALLY MET', 'NOT MET'] as CriterionStatus[]).map((s) => {
                  const count = REPORT.criteria.filter((c) => c.status === s).length
                  const cfg = STATUS_CONFIG[s]
                  return (
                    <div key={s} className="flex flex-col items-center gap-0.5">
                      <span className={`text-lg font-bold ${cfg.text}`}>{count}</span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight text-center">{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <ReportCard>
            <div className="p-6 sm:p-7">
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-50 mb-3">Overall Assessment</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{REPORT.overallAssessment}</p>
            </div>
          </ReportCard>
        </div>

        {/* ── Strength Areas ── */}
        <ReportCard>
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-50">Strength Areas</h3>
            </div>
            <BulletList items={REPORT.strengthAreas} />
          </div>
        </ReportCard>

        {/* ── Recommended Next Steps ── */}
        <ReportCard>
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-50">Recommended Next Steps</h3>
            </div>
            <NumberedList items={REPORT.nextSteps} />
          </div>
        </ReportCard>

        {/* ── Industry & Market Context ── */}
        <ReportCard>
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#7c3aed]">
                  <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-50">Industry &amp; Market Context</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{REPORT.industryContext}</p>
          </div>
        </ReportCard>

        {/* ── Detailed Breakdown ── */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-4">Detailed Breakdown</h3>
          <div className="flex flex-col gap-4">
            {REPORT.criteria.map((criterion) => {
              const cfg = STATUS_CONFIG[criterion.status]
              return (
                <div
                  key={criterion.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
                  <div className="p-5 sm:p-6">

                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                        >
                          {criterion.id}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-slate-50 text-sm leading-snug">{criterion.name}</h4>
                      </div>
                      <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 pl-10">
                      {/* Analysis */}
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Analysis:</p>
                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{criterion.analysis}</p>
                      </div>

                      {/* Evidence */}
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Evidence:</p>
                        <ul className="flex flex-col gap-1.5">
                          {criterion.evidence.map((e, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0 mt-1.5" />
                              <span className="text-sm text-gray-500 dark:text-slate-400">{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Footer disclaimer ── */}
        <div className="rounded-2xl border border-amber-100 dark:border-amber-900/20 bg-amber-50/60 dark:bg-amber-950/10 p-4 flex items-start gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-bold">Disclaimer:</span> This report is AI-generated for informational purposes only and does not constitute legal advice. Immigration decisions involve complex legal considerations. Always consult a qualified immigration attorney before filing.
          </p>
        </div>

      </div>
    </div>
  )
}

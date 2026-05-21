const features = [
  {
    title: 'Instant Verification',
    description:
      'Upload your visa documents and get AI-powered results in seconds — no waiting, no back-and-forth.',
    color: '#7c3aed',
    bg: '#ede9fe',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Multi-Format Support',
    description:
      'Accepts passports, visas, and permit documents in PDF, JPG, and PNG — all in one unified platform.',
    color: '#2563eb',
    bg: '#dbeafe',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-6.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
          clipRule="evenodd"
        />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
    ),
  },
  {
    title: 'Secure & Compliant',
    description:
      'Enterprise-grade encryption and GDPR-compliant data handling keep your sensitive documents protected.',
    color: '#059669',
    bg: '#d1fae5',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'Perfect for individuals exploring visa verification.',
    cta: 'Get Started',
    ctaStyle: 'border',
    highlighted: false,
    features: [
      '5 document verifications / month',
      'PDF, JPG, PNG support',
      'Basic verification report',
      'Email support',
      'Results in under 2 minutes',
    ],
    missing: ['Priority processing', 'API access', 'Team collaboration', 'Dedicated account manager'],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    description: 'For professionals who need fast, reliable verification.',
    cta: 'Start Free Trial',
    ctaStyle: 'filled',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      '100 document verifications / month',
      'PDF, JPG, PNG support',
      'Detailed verification report',
      'Priority email & chat support',
      'Results in under 30 seconds',
      'API access (1,000 calls/month)',
      'Export to PDF & CSV',
    ],
    missing: ['Team collaboration', 'Dedicated account manager'],
  },
  {
    name: 'Pro Plus',
    price: '$49',
    period: '/ month',
    description: 'Built for teams and enterprises with high-volume needs.',
    cta: 'Contact Sales',
    ctaStyle: 'border',
    highlighted: false,
    features: [
      'Unlimited verifications',
      'PDF, JPG, PNG support',
      'Advanced verification report',
      '24/7 priority support',
      'Results in under 10 seconds',
      'API access (unlimited)',
      'Export to PDF, CSV & JSON',
      'Team collaboration (up to 20)',
      'Dedicated account manager',
    ],
    missing: [],
  },
]

function CheckIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color }}>
      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-gray-300">
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14 max-w-6xl mx-auto w-full pb-10">

      {/* ── Hero / Product overview ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7 sm:w-8 sm:h-8">
            <path fillRule="evenodd" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VisaVerify
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#7c3aed]">
              v2.0
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
            VisaVerify is an AI-powered document verification platform that validates visa and immigration
            documents instantly. Built for individuals, consultants, and enterprises — get accurate results
            without the manual overhead.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {['AI-Powered', 'GDPR Compliant', 'API Ready', '99.9% Uptime'].map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key features ── */}
      <div>
        <div className="mb-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Why VisaVerify?</h3>
          <p className="mt-1 text-sm text-gray-500">Everything you need to verify documents with confidence.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing ── */}
      <div>
        <div className="mb-6 sm:mb-8 text-center">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Simple, Transparent Pricing</h3>
          <p className="mt-1.5 text-sm text-gray-500">
            No hidden fees. Cancel any time. Start free — upgrade when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                'relative flex flex-col rounded-2xl border p-6 sm:p-7 transition-shadow',
                plan.highlighted
                  ? 'border-[#7c3aed] shadow-lg shadow-purple-100 bg-white'
                  : 'border-gray-100 shadow-sm bg-white',
              ].join(' ')}
            >
              {/* Popular badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  {plan.badge}
                </span>
              )}

              {/* Plan name & description */}
              <div className="mb-4">
                <p className={`text-sm font-bold ${plan.highlighted ? 'text-[#7c3aed]' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mt-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400 mb-1">{plan.period}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">{plan.description}</p>
              </div>

              {/* CTA */}
              <button
                className={[
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer mb-5',
                  plan.ctaStyle === 'filled'
                    ? 'text-white hover:opacity-90 active:scale-[0.98]'
                    : 'border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white',
                ].join(' ')}
                style={
                  plan.ctaStyle === 'filled'
                    ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }
                    : {}
                }
              >
                {plan.cta}
              </button>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5" />

              {/* Included features */}
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckIcon color={plan.highlighted ? '#7c3aed' : '#2563eb'} />
                    <span className="text-xs sm:text-sm text-gray-600 leading-snug">{feat}</span>
                  </li>
                ))}
                {plan.missing.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 opacity-40">
                    <CrossIcon />
                    <span className="text-xs sm:text-sm text-gray-400 leading-snug line-through">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-gray-400">
          All plans include a{' '}
          <span className="font-semibold text-[#7c3aed]">14-day free trial</span>. No credit card required.
        </p>
      </div>
    </div>
  )
}

import GoogleSignInButton from './components/GoogleSignInButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)' }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 px-10 py-12 flex flex-col items-center gap-8">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VisaVerify
            </h1>
            <p className="mt-1.5 text-gray-500 text-sm">
              Streamline your visa verification process
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* Sign-in section */}
        <div className="w-full flex flex-col items-center gap-5">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-0.5">Sign in to continue to your account</p>
          </div>

          <GoogleSignInButton />
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          By signing in, you agree to our{' '}
          <span className="text-[#7c3aed] font-medium cursor-pointer hover:underline">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-[#2563eb] font-medium cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
      </div>
    </main>
  )
}

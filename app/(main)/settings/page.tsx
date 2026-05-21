'use client'

import { useState } from 'react'

type ToggleProps = { label: string; description: string; enabled: boolean; onChange: (v: boolean) => void }

function Toggle({ label, description, enabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-gray-800 dark:text-slate-100">{label}</span>
        <span className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">{description}</span>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${enabled ? 'bg-[#7c3aed]' : 'bg-gray-200 dark:bg-slate-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
      <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({
    emailVerification: true,
    emailMarketing: false,
    pushAlerts: true,
    smsAlerts: false,
    weeklyReport: true,
  })

  const [twoFA, setTwoFA] = useState(false)
  const [sessionAlert, setSessionAlert] = useState(true)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwSaved, setPwSaved] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')

  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC-5')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTyped, setDeleteTyped] = useState('')

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handlePasswordSave() {
    setPwError('')
    if (!pwForm.current) { setPwError('Current password is required.'); return }
    if (pwForm.next.length < 8) { setPwError('New password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    setPwSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setPwSaving(false)
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 3000)
  }

  const inputCls = 'px-3.5 py-2.5 text-sm text-gray-800 dark:text-slate-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#7c3aed] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#7c3aed]/10 transition placeholder:text-gray-400 dark:placeholder:text-slate-500'

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto w-full pb-10">

      {/* Notifications */}
      <Section title="Notification Preferences" description="Choose what you want to be notified about.">
        <div className="flex flex-col gap-5 divide-y divide-gray-50 dark:divide-slate-800">
          <Toggle label="Email — Verification updates" description="Get notified when a document is verified or rejected." enabled={notifs.emailVerification} onChange={() => toggleNotif('emailVerification')} />
          <div className="pt-4"><Toggle label="Email — Product updates" description="News, tips and announcements from VisaVerify." enabled={notifs.emailMarketing} onChange={() => toggleNotif('emailMarketing')} /></div>
          <div className="pt-4"><Toggle label="Push notifications" description="Real-time alerts in your browser." enabled={notifs.pushAlerts} onChange={() => toggleNotif('pushAlerts')} /></div>
          <div className="pt-4"><Toggle label="SMS alerts" description="Text messages for critical status changes." enabled={notifs.smsAlerts} onChange={() => toggleNotif('smsAlerts')} /></div>
          <div className="pt-4"><Toggle label="Weekly summary report" description="A digest of your activity sent every Monday." enabled={notifs.weeklyReport} onChange={() => toggleNotif('weeklyReport')} /></div>
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" description="Manage your password and account protection.">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 pb-5 border-b border-gray-100 dark:border-slate-800">
            <Toggle label="Two-factor authentication (2FA)" description="Add an extra layer of security with a one-time code." enabled={twoFA} onChange={setTwoFA} />
            <Toggle label="New login alerts" description="Get notified when your account is accessed from a new device." enabled={sessionAlert} onChange={setSessionAlert} />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-gray-600 dark:text-slate-400">Change Password</p>
            {(['current', 'next', 'confirm'] as const).map((k) => (
              <div key={k} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-slate-400">
                  {k === 'current' ? 'Current password' : k === 'next' ? 'New password' : 'Confirm new password'}
                </label>
                <input
                  type="password"
                  value={pwForm[k]}
                  onChange={(e) => { setPwError(''); setPwForm((p) => ({ ...p, [k]: e.target.value })) }}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
            ))}

            {pwError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                {pwError}
              </p>
            )}

            <div className="flex items-center gap-3">
              {pwSaved && (
                <span className="text-xs font-medium text-[#059669] flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.521-1.521a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.647-5.353Z" clipRule="evenodd" />
                  </svg>
                  Password updated
                </span>
              )}
              <button
                onClick={handlePasswordSave}
                disabled={pwSaving}
                className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-70 cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              >
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance & Locale" description="Adjust how VisaVerify looks and formats information.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Language',
              value: language,
              onChange: setLanguage,
              options: [
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
              ],
            },
            {
              label: 'Timezone',
              value: timezone,
              onChange: setTimezone,
              options: [
                { value: 'UTC-8', label: 'UTC-8 (PST)' },
                { value: 'UTC-5', label: 'UTC-5 (EST)' },
                { value: 'UTC+0', label: 'UTC+0 (GMT)' },
                { value: 'UTC+5:30', label: 'UTC+5:30 (IST)' },
                { value: 'UTC+8', label: 'UTC+8 (SGT)' },
              ],
            },
            {
              label: 'Date Format',
              value: dateFormat,
              onChange: setDateFormat,
              options: [
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ],
            },
          ].map((sel) => (
            <div key={sel.label} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">{sel.label}</label>
              <select
                value={sel.value}
                onChange={(e) => sel.onChange(e.target.value)}
                className="px-3.5 py-2.5 text-sm text-gray-800 dark:text-slate-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#7c3aed] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#7c3aed]/10 transition cursor-pointer appearance-none"
              >
                {sel.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
        <div className="border-b border-red-100 dark:border-red-900/30 pb-4">
          <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">These actions are permanent and cannot be undone.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">Delete Account</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Permanently remove your account and all associated data.</p>
          </div>
          <button
            onClick={() => { setDeleteDialogOpen((o) => !o); setDeleteTyped('') }}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>

        {deleteDialogOpen && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
            <p className="text-sm text-gray-700 dark:text-slate-200">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </p>
            <input
              value={deleteTyped}
              onChange={(e) => setDeleteTyped(e.target.value)}
              placeholder="DELETE"
              className="px-3.5 py-2.5 text-sm text-gray-800 dark:text-slate-100 border border-red-200 dark:border-red-700 rounded-xl outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 bg-white dark:bg-slate-800 transition placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
            <button
              disabled={deleteTyped !== 'DELETE'}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Permanently Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

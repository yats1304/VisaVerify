'use client'

import { useState } from 'react'

type Field = { label: string; key: string; type?: string; placeholder: string }

const PERSONAL_FIELDS: Field[] = [
  { label: 'First Name', key: 'firstName', placeholder: 'John' },
  { label: 'Last Name', key: 'lastName', placeholder: 'Doe' },
  { label: 'Display Name', key: 'displayName', placeholder: 'johndoe' },
  { label: 'Role', key: 'role', placeholder: 'e.g. Visa Consultant' },
]

const CONTACT_FIELDS: Field[] = [
  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' },
  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { label: 'Location', key: 'location', placeholder: 'City, Country' },
  { label: 'Website', key: 'website', type: 'url', placeholder: 'https://yourwebsite.com' },
]

type FormData = Record<string, string>

const INITIAL: FormData = {
  firstName: 'Visa',
  lastName: 'Verify',
  displayName: 'visaverify',
  role: 'Visa Consultant',
  email: 'user@visaverify.com',
  phone: '+1 (555) 000-0000',
  location: 'New York, USA',
  website: 'https://visaverify.com',
  bio: 'Helping individuals and organisations navigate the visa verification process with confidence.',
}

export default function ProfilePage() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleChange(key: string, value: string) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto w-full pb-10">

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              {form.firstName.charAt(0)}{form.lastName.charAt(0)}
            </div>
            <button
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Change avatar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#7c3aed]">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>
            </button>
          </div>

          {/* Name + meta */}
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900">{form.firstName} {form.lastName}</h2>
            <p className="text-sm text-gray-500">{form.role}</p>
            <p className="text-xs text-gray-400">{form.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ede9fe] text-[#7c3aed]">Pro Plan</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#d1fae5] text-[#059669]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <Section title="Personal Information" description="Update your name, role and display preferences.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PERSONAL_FIELDS.map((f) => (
            <InputField key={f.key} field={f} value={form[f.key]} onChange={(v) => handleChange(f.key, v)} />
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Write a short bio about yourself…"
            className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/10 transition resize-none"
          />
        </div>
      </Section>

      {/* Contact info */}
      <Section title="Contact Information" description="How others can reach you.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACT_FIELDS.map((f) => (
            <InputField key={f.key} field={f} value={form[f.key]} onChange={(v) => handleChange(f.key, v)} />
          ))}
        </div>
      </Section>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-[#059669] flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.521-1.521a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.647-5.353Z" clipRule="evenodd" />
            </svg>
            Changes saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-70 cursor-pointer active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

function InputField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{field.label}</label>
      <input
        type={field.type ?? 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/10 transition"
      />
    </div>
  )
}

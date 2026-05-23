'use client'

import { useEffect, useRef, useState } from 'react'

type UploadedFile = {
  id: string
  file: File
  previewUrl: string
}

type VisaTypeId = 'eb1a' | 'eb2niw'

const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_BYTES = 10 * 1024 * 1024

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileTypeBadge(file: File) {
  if (file.type === 'application/pdf') return { label: 'PDF', color: '#7c3aed', bg: '#ede9fe' }
  if (file.type === 'image/jpeg') return { label: 'JPG', color: '#2563eb', bg: '#dbeafe' }
  return { label: 'PNG', color: '#059669', bg: '#d1fae5' }
}

const acceptedTypes = [
  { label: 'PDF', color: '#7c3aed', bg: '#ede9fe' },
  { label: 'JPG', color: '#2563eb', bg: '#dbeafe' },
  { label: 'PNG', color: '#059669', bg: '#d1fae5' },
]

const WHAT_WE_ANALYZE = [
  'Education & Work Experience',
  'Publications & Research',
  'Awards & Recognitions',
  'Professional Memberships',
  'Media Mentions & Citations',
  'EB-1A & EB-2 NIW Criteria',
]

const VISA_TYPES: { id: VisaTypeId; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'eb1a',
    label: 'EB-1A',
    description: 'Extraordinary Ability',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Zm9 7.5a.75.75 0 0 1 .721.544l.369 1.29a1.875 1.875 0 0 0 1.296 1.296l1.29.369a.75.75 0 0 1 0 1.442l-1.29.369a1.875 1.875 0 0 0-1.296 1.296l-.369 1.29a.75.75 0 0 1-1.442 0l-.369-1.29a1.875 1.875 0 0 0-1.296-1.296l-1.29-.369a.75.75 0 0 1 0-1.442l1.29-.369a1.875 1.875 0 0 0 1.296-1.296l.369-1.29A.75.75 0 0 1 18 12Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'eb2niw',
    label: 'EB-2 NIW',
    description: 'National Interest Waiver',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.845.354-2.805.354-.96 0-1.908-.124-2.805-.354A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
      </svg>
    ),
  },
]

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [visaType, setVisaType] = useState<VisaTypeId>('eb1a')
  const [replacingFileId, setReplacingFileId] = useState<string | null>(null)

  const filesRef = useRef<UploadedFile[]>([])
  useEffect(() => { filesRef.current = files }, [files])
  useEffect(() => {
    return () => { filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl)) }
  }, [])

  function addFiles(incoming: FileList | File[], replaceId: string | null = replacingFileId) {
    const list = Array.from(incoming)
    const newErrors: string[] = []
    const valid: UploadedFile[] = []
    for (const file of list) {
      if (!ACCEPTED_MIME.includes(file.type)) { newErrors.push(`"${file.name}" is not a supported format.`); continue }
      if (file.size > MAX_BYTES) { newErrors.push(`"${file.name}" exceeds 10 MB.`); continue }
      if (!replaceId && filesRef.current.some((f) => f.file.name === file.name && f.file.size === file.size)) continue
      valid.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) })
    }
    setErrors(newErrors)
    
    if (valid.length > 0) {
      if (replaceId) {
        setFiles((prev) => {
          const target = prev.find((f) => f.id === replaceId)
          if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
          return prev.map((f) => (f.id === replaceId ? valid[0] : f))
        })
        setReplacingFileId(null)
      } else {
        setFiles((prev) => [...prev, ...valid])
      }
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files, replacingFileId)
    e.target.value = ''
    setReplacingFileId(null)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((f) => f.id !== id)
    })
  }

  function removeAll() {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
    setFiles([])
  }

  return (
    <div className="flex flex-col">

      {/* Hero banner — breaks out of main padding */}
      <div
        className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-8 sm:mb-10 px-6 sm:px-12 py-10 sm:py-14"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}
      >
        <p className="text-xs font-bold tracking-widest text-blue-200 uppercase mb-3">STEP 1 OF 1</p>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight">
          Upload Your Visa Documents
        </h1>
        <p className="text-blue-200 text-sm sm:text-base max-w-xl leading-relaxed">
          Upload your documents and let our AI verify them — results in under 5 minutes.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 sm:gap-8 max-w-6xl mx-auto w-full">

        {/* ── Left: info panel ── */}
        <div className="flex flex-col gap-4">

          {/* What We Analyze */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 dark:text-slate-50 text-base mb-4">What We Analyze</h3>
            <ul className="flex flex-col gap-3">
              {WHAT_WE_ANALYZE.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: '#1e3a8a' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Processing Time */}
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/10 p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
              <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm">Processing Time</h4>
            </div>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/70 leading-relaxed">
              Verification typically takes 2–3 minutes. You&apos;ll see real-time progress updates and can safely navigate away — we&apos;ll save your results.
            </p>
          </div>

          {/* AI Standards */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/10 p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.522-1.521a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.648-5.353Z" clipRule="evenodd" />
              </svg>
              <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm">AI-Verified Standards</h4>
            </div>
            <p className="text-sm text-blue-700/80 dark:text-blue-300/70 leading-relaxed">
              Our system applies the same verification frameworks and thresholds used by immigration authorities worldwide.
            </p>
          </div>
        </div>

        {/* ── Right: upload + configure ── */}
        <div className="flex flex-col gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50">Upload &amp; Configure</h2>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">PDF, JPG or PNG · Up to 10 MB per file</p>
            </div>

            {/* Drop zone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Document Upload</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={[
                  'rounded-2xl border-2 border-dashed transition-all duration-200 relative overflow-hidden',
                  dragOver
                    ? 'border-[#7c3aed] bg-[#faf5ff] dark:bg-purple-900/20 scale-[1.01]'
                    : files.length > 0
                      ? 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5'
                      : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-[#7c3aed] hover:bg-gray-100/50 dark:hover:bg-slate-800 p-8 cursor-pointer select-none',
                ].join(' ')}
                onClick={files.length === 0 ? () => inputRef.current?.click() : undefined}
                role={files.length === 0 ? 'button' : undefined}
                tabIndex={files.length === 0 ? 0 : undefined}
                onKeyDown={files.length === 0 ? (e) => e.key === 'Enter' && inputRef.current?.click() : undefined}
              >
                {/* Drag over overlay */}
                {dragOver && (
                  <div className="absolute inset-0 bg-[#7c3aed]/10 dark:bg-[#7c3aed]/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg border border-purple-100 dark:border-slate-700 animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#7c3aed]">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#7c3aed] bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md border border-purple-50 dark:border-slate-700">
                      Drop to add more files
                    </span>
                  </div>
                )}

                {/* Previews / Empty State */}
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-center w-full pointer-events-none">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{
                        background: dragOver
                          ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                          : 'linear-gradient(135deg, #ede9fe, #dbeafe)',
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: dragOver ? 'white' : '#7c3aed' }}>
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                        <span className="text-[#7c3aed] font-bold">Choose a file</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">No file chosen</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {acceptedTypes.map((t) => (
                        <span key={t.label} className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: t.bg, color: t.color }}>
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : files.length === 1 ? (
                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-stretch text-left w-full">
                    {/* Left: Interactive Preview */}
                    <div className="relative aspect-[4/3] w-full sm:w-[180px] shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 shadow-sm group/preview">
                      {files[0].file.type === 'application/pdf' ? (
                        <iframe
                          src={files[0].previewUrl}
                          title={files[0].file.name}
                          className="absolute top-0 left-0 border-0 pointer-events-none"
                          style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left', overflow: 'hidden' }}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={files[0].previewUrl} alt={files[0].file.name} className="w-full h-full object-cover" />
                      )}
                      
                      {/* Zoom/View overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <a
                          href={files[0].previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-[10px] font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                            <path fillRule="evenodd" d="M.664 9.571a1.008 1.008 0 0 0 0 1.03 14.887 14.887 0 0 0 18.672 0 1.008 1.008 0 0 0 0-1.03A14.887 14.887 0 0 0 .664 9.571ZM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" clipRule="evenodd" />
                          </svg>
                          Open Document
                        </a>
                      </div>
                      
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm" style={{ background: fileTypeBadge(files[0].file).bg, color: fileTypeBadge(files[0].file).color }}>
                        {fileTypeBadge(files[0].file).label}
                      </span>
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="flex flex-col justify-between flex-1 py-1 min-w-0 w-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Ready to Verify
                          </span>
                          <span className="text-xs text-gray-400 dark:text-slate-500">•</span>
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">{formatSize(files[0].file.size)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-slate-50 text-sm truncate mb-1" title={files[0].file.name}>
                          {files[0].file.name}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed max-w-sm">
                          AI will inspect layout structure, text contents, stamps, signatures, and compliance criteria.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5 mt-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingFileId(files[0].id)
                            inputRef.current?.click()
                          }}
                          className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-gray-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0-.75.75v4.468a.75.75 0 0 0 1.5 0v-2.278l.329.33a7 7 0 0 0 11.738-3.118.75.75 0 0 0-1.255-.527ZM16.25 3.75a.75.75 0 0 0-1.5 0v2.278l-.329-.33A7 7 0 0 0 2.683 8.816a.75.75 0 0 0 1.255.528 5.5 5.5 0 0 1 9.2-2.467l.312.311h-2.433a.75.75 0 0 0 0 1.5h4.468a.75.75 0 0 0 .75-.75V3.75Z" clipRule="evenodd" />
                          </svg>
                          Change File
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(files[0].id)}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold border border-rose-100 dark:border-rose-900/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.006.37l-1.6 4a.75.75 0 1 0 1.393.558l1.6-4a.75.75 0 0 0-.387-.928ZM11.42 7.72a.75.75 0 0 1 .387.928l-1.6 4a.75.75 0 1 1-1.393-.558l1.6-4a.75.75 0 0 1 1.006-.37Z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-left w-full">
                    {/* Header bar inside container */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/30 text-[#7c3aed] border border-purple-100 dark:border-purple-900/30">
                          {files.length} Documents Selected
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAll}
                        className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                      >
                        Remove All
                      </button>
                    </div>

                    {/* Previews Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      {files.map(({ id, file, previewUrl }) => {
                        const badge = fileTypeBadge(file)
                        return (
                          <div key={id} className="group/item flex flex-col gap-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 hover:border-purple-100 dark:hover:border-purple-950/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200/60 dark:border-slate-700 bg-white dark:bg-slate-900">
                              {file.type === 'application/pdf' ? (
                                <iframe
                                  src={previewUrl}
                                  title={file.name}
                                  className="absolute top-0 left-0 border-0 pointer-events-none"
                                  style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left', overflow: 'hidden' }}
                                />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                              )}

                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-all duration-200 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile(id) }}
                                  aria-label={`Remove ${file.name}`}
                                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-rose-50 hover:scale-105 transition-all duration-150 cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-rose-500">
                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.006.37l-1.6 4a.75.75 0 1 0 1.393.558l1.6-4a.75.75 0 0 0-.387-.928ZM11.42 7.72a.75.75 0 0 1 .387.928l-1.6 4a.75.75 0 1 1-1.393-.558l1.6-4a.75.75 0 0 1 1.006-.37Z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>

                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-sm" style={{ background: badge.bg, color: badge.color }}>
                                {badge.label}
                              </span>
                            </div>

                            <div className="flex flex-col gap-0.5 px-1 min-w-0">
                              <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 truncate" title={file.name}>
                                {file.name}
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                                {formatSize(file.size)}
                              </span>
                            </div>
                          </div>
                        )
                      })}

                      {/* Add more documents slot */}
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 p-2 aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/20 hover:border-purple-400 hover:bg-purple-50/20 dark:hover:bg-purple-950/10 transition-all duration-200 group/add cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover/add:scale-105 transition-transform duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          Add Files
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl p-4 flex flex-col gap-1.5">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                    </svg>
                    {err}
                  </div>
                ))}
              </div>
            )}

            {/* Visa Type */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 block mb-2.5">Visa Category</label>
              <div className="grid grid-cols-2 gap-3">
                {VISA_TYPES.map((vt) => {
                  const active = visaType === vt.id
                  return (
                    <button
                      key={vt.id}
                      onClick={() => setVisaType(vt.id)}
                      className={[
                        'flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer',
                        active
                          ? 'border-[#7c3aed] bg-[#faf5ff] dark:bg-purple-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-[#7c3aed]/50 hover:bg-white dark:hover:bg-slate-700/50',
                      ].join(' ')}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: active ? '#ede9fe' : '#f1f5f9' }}
                      >
                        <span className={active ? 'text-[#7c3aed]' : 'text-slate-400'}>
                          {vt.icon}
                        </span>
                      </span>
                      <span className={`text-sm font-bold leading-tight ${active ? 'text-[#7c3aed]' : 'text-gray-800 dark:text-slate-100'}`}>
                        {vt.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">{vt.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Start Verification CTA */}
            <div className="flex items-center gap-3 pt-1">
              <button
                disabled={files.length === 0}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              >
                Start Verification
              </button>
              {files.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-slate-500">Upload at least one file to continue</p>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

type UploadedFile = {
  id: string
  file: File
  previewUrl: string // always a blob URL — images and PDFs alike
}

const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

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

const guidelines = [
  { text: 'Files must be clear and fully legible — blurry images will be rejected.', color: '#7c3aed', bg: '#ede9fe' },
  { text: 'All four edges of the document must be visible in the image.', color: '#2563eb', bg: '#dbeafe' },
  { text: 'Do not upload documents with expired dates.', color: '#dc2626', bg: '#fee2e2' },
  { text: 'Accepted formats: PDF, JPG, PNG. Max 10 MB per file.', color: '#059669', bg: '#d1fae5' },
]

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Keep a ref in sync so the unmount cleanup always sees the latest list
  const filesRef = useRef<UploadedFile[]>([])
  useEffect(() => { filesRef.current = files }, [files])

  // Revoke all blob URLs when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
      })
    }
  }, [])

  function addFiles(incoming: FileList | File[]) {
    const list = Array.from(incoming)
    const newErrors: string[] = []
    const valid: UploadedFile[] = []

    for (const file of list) {
      if (!ACCEPTED_MIME.includes(file.type)) {
        newErrors.push(`"${file.name}" is not a supported format.`)
        continue
      }
      if (file.size > MAX_BYTES) {
        newErrors.push(`"${file.name}" exceeds 10 MB.`)
        continue
      }
      const isDuplicate = filesRef.current.some(
        (f) => f.file.name === file.name && f.file.size === file.size
      )
      if (isDuplicate) continue

      valid.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })
    }

    setErrors(newErrors)
    setFiles((prev) => [...prev, ...valid])
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = '' // reset so same file can be re-added after removal
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
    files.forEach((f) => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })
    setFiles([])
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto w-full">
      {/* Page header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">File Upload</h2>
        <p className="mt-1 text-gray-500 text-sm">Upload your visa documents for verification.</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          'bg-white rounded-2xl border-2 border-dashed transition-all duration-200',
          'p-8 sm:p-12 flex flex-col items-center justify-center gap-4 text-center cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-2',
          dragOver
            ? 'border-[#7c3aed] bg-[#faf5ff] scale-[1.01] shadow-lg shadow-purple-100'
            : 'border-gray-200 hover:border-[#7c3aed] hover:bg-gray-50/50',
        ].join(' ')}
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200"
          style={{
            background: dragOver
              ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
              : 'linear-gradient(135deg, #ede9fe, #dbeafe)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 sm:w-8 sm:h-8"
            style={{ color: dragOver ? 'white' : '#7c3aed' }}
          >
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex flex-col gap-1.5 pointer-events-none">
          <p className="text-sm sm:text-base font-semibold text-gray-700">
            {dragOver ? 'Drop to upload' : (
              <>Drop your files here, or <span className="text-[#7c3aed] underline">browse</span></>
            )}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">Maximum file size: 10 MB per file</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center pointer-events-none">
          {acceptedTypes.map((t) => (
            <span key={t.label} className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: t.bg, color: t.color }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-1.5">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload Guidelines</h3>
        <ul className="flex flex-col gap-3">
          {guidelines.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" style={{ color: item.color }}>
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preview grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Uploaded Files
            {files.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#ede9fe] text-[#7c3aed]">
                {files.length}
              </span>
            )}
          </h3>
          {files.length > 0 && (
            <button
              onClick={removeAll}
              className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remove all
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center gap-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-200">
              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
            <p className="text-sm text-gray-400">No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {files.map(({ id, file, previewUrl }) => {
              const badge = fileTypeBadge(file)
              return (
                <div key={id} className="group flex flex-col gap-2">
                  {/* Preview card */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                    {file.type === 'application/pdf' ? (
                      /* PDF — render first page via iframe, scaled to fit the card */
                      <iframe
                        src={previewUrl}
                        title={file.name}
                        className="absolute top-0 left-0 border-0 pointer-events-none overflow-hidden"
                        style={{
                          width: '200%',
                          height: '200%',
                          transform: 'scale(0.5)',
                          transformOrigin: 'top left',
                          overflow: 'hidden',
                        }}
                      />
                    ) : (
                      /* Image preview */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Hover overlay with remove button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => removeFile(id)}
                        aria-label={`Remove ${file.name}`}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 cursor-pointer scale-90 group-hover:scale-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Type badge — top left */}
                    <span
                      className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-xs font-bold"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* File info below card */}
                  <div className="flex flex-col gap-0.5 px-0.5">
                    <span className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

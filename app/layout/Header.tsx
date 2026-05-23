'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

const PAGE_TITLES: Record<string, string> = {
  '/home': 'Home',
  '/upload': 'File Upload',
  '/profile': 'My Profile',
  '/settings': 'Settings',
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Verification Complete',
    desc: 'Your visa document was successfully verified.',
    time: '2 min ago',
    read: false,
    color: '#059669',
    bg: '#d1fae5',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Document Pending',
    desc: 'Your uploaded file is awaiting review by our team.',
    time: '1 hr ago',
    read: false,
    color: '#2563eb',
    bg: '#dbeafe',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Welcome to VisaVerify!',
    desc: 'Get started by uploading your first visa document.',
    time: '2 days ago',
    read: true,
    color: '#7c3aed',
    bg: '#ede9fe',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
    ),
  },
]

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const title = PAGE_TITLES[pathname] ?? 'VisaVerify'

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const bellRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="h-14 sm:h-16 shrink-0 relative z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col">
      {/* Gradient accent line at top */}
      <div className="h-[2px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 45%, #2563eb 100%)' }} />

      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 border-b border-gray-100/60 dark:border-slate-800/60">

      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-[#7c3aed] transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Page title with subtle left accent */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block w-[3px] h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7c3aed, #2563eb)' }} />
          <h1 className="text-base sm:text-[15px] font-bold text-gray-800 dark:text-slate-100 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">

        {/* Notification bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false) }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
              notifOpen
                ? 'text-[#7c3aed] bg-purple-50 dark:bg-purple-950/40'
                : 'text-gray-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-[#7c3aed]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
            </svg>
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="
              fixed inset-x-3 top-[3.75rem]
              sm:absolute sm:inset-x-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-80
              bg-white dark:bg-slate-900
              rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800
              overflow-hidden z-50
            ">
              {/* Gradient top accent */}
              <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />

              {/* Sticky header */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white leading-none"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-[#7c3aed] hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Scrollable list — max-height prevents overflow on short screens */}
              <ul className="overflow-y-auto max-h-[min(calc(100vh-10rem),360px)]">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-slate-800/70 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${!n.read ? 'bg-purple-50/50 dark:bg-purple-950/20' : ''}`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                      style={{ background: n.bg, color: n.color }}
                    >
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900 dark:text-slate-50' : 'font-medium text-gray-600 dark:text-slate-400'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      <p className="text-[11px] text-gray-300 dark:text-slate-600 mt-1 font-medium">{n.time}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#7c3aed' }} />
                    )}
                  </li>
                ))}
              </ul>

              {/* Sticky footer */}
              <div className="sticky bottom-0 bg-white dark:bg-slate-900 px-4 py-3 border-t border-gray-100 dark:border-slate-800 text-center">
                <button className="text-xs font-semibold text-[#7c3aed] hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 mx-0.5 sm:mx-1 rounded-full" style={{ background: 'linear-gradient(180deg, transparent, #a78bfa55, transparent)' }} />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false) }}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2 px-2 py-1 rounded-xl transition-all duration-150 cursor-pointer ${
              profileOpen
                ? 'bg-purple-50 dark:bg-purple-950/40'
                : 'hover:bg-purple-50 dark:hover:bg-purple-950/30'
            }`}
          >
            {/* Avatar with gradient ring */}
            <div className="p-[2px] rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  V
                </span>
              </div>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-800 dark:text-slate-100">VisaVerify</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`hidden sm:block w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
            </svg>
          </button>

          {profileOpen && (
            <div className="
              fixed right-3 top-[3.75rem]
              sm:absolute sm:right-0 sm:top-full sm:mt-2
              w-[calc(100vw-1.5rem)] sm:w-56
              max-w-xs
              bg-white dark:bg-slate-900
              rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800
              overflow-hidden z-50
            ">
              <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
              <div className="px-4 py-3.5 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  >
                    V
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">VisaVerify User</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 truncate">user@visaverify.com</span>
                  </div>
                </div>
              </div>

              <ul className="py-1">
                {[
                  {
                    label: 'My Profile',
                    href: '/profile',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Settings',
                    href: '/settings',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => { router.push(item.href); setProfileOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="text-gray-400 dark:text-slate-500">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 dark:border-slate-800 py-1">
                <button
                  onClick={() => { setProfileOpen(false); router.push('/') }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      </div>
    </header>
  )
}

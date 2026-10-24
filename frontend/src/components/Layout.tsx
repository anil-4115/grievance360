import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/complaints', label: 'Complaints', icon: '📋' },
  { to: '/institutions', label: 'Institutions', icon: '🏛️' },
  { to: '/recommendations', label: 'Recommendations', icon: '💡' },
  { to: '/alerts', label: 'Bottleneck Alerts', icon: '⚠️' },
]

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800">
          <div className="flex h-16 items-center border-b border-slate-800 px-6">
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Grievance360</h1>
              <p className="text-xs text-slate-400">Unified Grievance Monitoring</p>
            </div>
          </div>
          <nav className="mt-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="flex-1 pl-64">
          <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/95 backdrop-blur px-6 shadow-sm">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Government Grievance Monitoring Dashboard</h2>
                <p className="text-xs text-slate-500">SIH 2026 Prototype • Real-time oversight</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                API Connected
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

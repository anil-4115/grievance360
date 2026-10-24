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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Grievance360</h1>
              <p className="text-xs text-gray-500">Institution Monitor</p>
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
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="flex-1 pl-64">
          <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-6">
            <div className="flex flex-1 items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Grievance Monitoring Dashboard</h2>
              <div className="text-sm text-gray-500">SIH 2026 Prototype</div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Complaint } from '../types'
import { complaintService } from '../services/complaintService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

interface KPICardProps {
  title: string
  value: number
  subtitle: string
  trend: string
  icon: string
}

function KPICard({ title, value, subtitle, trend, icon }: KPICardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900/5 text-lg">
            {icon}
          </div>
        </div>
        <div className="mt-4 text-xs font-medium text-emerald-700">{trend}</div>
      </CardContent>
    </Card>
  )
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#2563eb',
  OVERDUE: '#dc2626',
  RESOLVED: '#16a34a',
  CLOSED: '#64748b',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintService
      .getComplaints()
      .then((data) => {
        setComplaints(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load dashboard data')
        setLoading(false)
      })
  }, [])

  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'PENDING').length
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length
  const overdue = complaints.filter((c) => c.status === 'OVERDUE').length
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length

  const statusData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Overdue', value: overdue },
    { name: 'Resolved', value: resolved },
  ].filter((d) => d.value > 0)

  const categoryCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Institution-wide grievance monitoring and performance overview</p>
        </div>
        <button
          onClick={() => navigate('/complaints')}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          View All Complaints
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Complaints" value={loading ? 0 : total} subtitle="Across all institutions" trend="+ Live from API" icon="📊" />
        <KPICard title="Pending" value={loading ? 0 : pending} subtitle="Awaiting action" trend="Action required" icon="⏳" />
        <KPICard title="Overdue" value={loading ? 0 : overdue} subtitle="Past SLA window" trend="High priority" icon="⚠️" />
        <KPICard title="Resolved" value={loading ? 0 : resolved} subtitle="Successfully closed" trend="On track" icon="✅" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Complaint Status Distribution</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Breakdown by current workflow state</p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="h-64 w-full lg:w-1/2">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading chart...</div>
              ) : statusData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toUpperCase().replace(' ', '_')] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-1/2">
              {[
                { label: 'Pending', value: pending, color: 'bg-amber-500' },
                { label: 'In Progress', value: inProgress, color: 'bg-blue-600' },
                { label: 'Overdue', value: overdue, color: 'bg-red-600' },
                { label: 'Resolved', value: resolved, color: 'bg-emerald-600' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`}></span>
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <p className="mt-1 text-sm text-slate-500">By complaint volume</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : categoryData.length === 0 ? (
              <div className="text-sm text-slate-400">No categories</div>
            ) : (
              categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{cat.name}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{cat.value}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Complaints</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Latest entries across all bureaus</p>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Bureau</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-400">Loading complaints...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-400">No complaints found</td>
                </tr>
              ) : (
                complaints.slice(0, 6).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{complaint.referenceId}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{complaint.institutionName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.bureau}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          complaint.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : complaint.status === 'OVERDUE'
                            ? 'bg-red-50 text-red-700'
                            : complaint.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.ageDays} days</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

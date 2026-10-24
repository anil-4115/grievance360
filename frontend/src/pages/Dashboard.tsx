import { useEffect, useState } from 'react'
import type { Complaint } from '../types'
import { complaintService } from '../services/complaintService'

interface KPICardProps {
  title: string
  value: number
  icon: string
  color: string
}

function KPICard({ title, value, icon, color }: KPICardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintService.getComplaints().then((data) => {
      setComplaints(data)
      setLoading(false)
    })
  }, [])

  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'PENDING').length
  const overdue = complaints.filter((c) => c.status === 'OVERDUE').length
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Overview of grievance monitoring across institutions</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Complaints" value={loading ? 0 : total} icon="📊" color="bg-blue-100" />
        <KPICard title="Pending" value={loading ? 0 : pending} icon="⏳" color="bg-yellow-100" />
        <KPICard title="Overdue" value={loading ? 0 : overdue} icon="⚠️" color="bg-red-100" />
        <KPICard title="Resolved" value={loading ? 0 : resolved} icon="✅" color="bg-green-100" />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Complaints</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bureau</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Age (days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No complaints found</td>
                </tr>
              ) : (
                complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{complaint.referenceId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{complaint.institutionName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{complaint.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{complaint.bureau}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          complaint.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-800'
                            : complaint.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-800'
                            : complaint.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{complaint.ageDays}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

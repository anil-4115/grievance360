import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Complaint } from '../types'
import { complaintService, type ComplaintFilters } from '../services/complaintService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function Complaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ComplaintFilters>({
    search: '',
    status: 'ALL',
    bureau: 'ALL',
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintService
      .getComplaints(filters)
      .then((data) => {
        setComplaints(Array.isArray(data) ? data : (data as any)?.content || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load complaints')
        setLoading(false)
      })
  }, [filters])

  const handleFilterChange = (key: keyof ComplaintFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-50 text-emerald-700'
    if (status === 'OVERDUE') return 'bg-red-50 text-red-700'
    if (status === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700'
    return 'bg-amber-50 text-amber-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Complaints</h1>
          <p className="mt-1 text-sm text-slate-600">Search, filter and track all institution-related complaints</p>
        </div>
        <div className="text-sm text-slate-500">{complaints.length} record(s)</div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Refine results by search, status or bureau</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Search</label>
              <input
                type="text"
                placeholder="Search by ID, institution, or subject..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="OVERDUE">Overdue</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bureau</label>
              <select
                value={filters.bureau}
                onChange={(e) => handleFilterChange('bureau', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All Bureaus</option>
                <option value="RB">RB</option>
                <option value="PGRC">PGRC</option>
                <option value="ACADEMIC">Academic</option>
                <option value="FINANCE">Finance</option>
                <option value="STUDENT_AFFAIRS">Student Affairs</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Registry</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Click a row action to view full details and timeline</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Last Update</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-sm text-slate-400">Loading complaints...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-sm text-slate-400">No complaints match the current filters</td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{complaint.referenceId}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div>{complaint.institutionName}</div>
                      <div className="text-xs text-slate-500">{complaint.institutionCode}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.bureau}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{complaint.ageDays} days</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(complaint.lastUpdatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                        className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
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

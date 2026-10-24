import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintService } from '../services/complaintService'
import type { Complaint } from '../types'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'

interface InstitutionSummary {
  id?: string
  institution: string
  code: string
  complaints: Complaint[]
  count: number
}

export default function Institutions() {
  const navigate = useNavigate()
  const [summaries, setSummaries] = useState<InstitutionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintService
      .getInstitutionSummary()
      .then((data) => {
        setSummaries(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load institutions')
        setLoading(false)
      })
  }, [])

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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Institutions</h1>
          <p className="mt-1 text-sm text-slate-600">Unified case view grouped by institution from live API data</p>
        </div>
        <div className="text-sm text-slate-500">{summaries.length} institution(s)</div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading institutions...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">Error: {error}</div>
      ) : summaries.length === 0 ? (
        <div className="text-center py-10 text-slate-400">No institutions found</div>
      ) : (
        <div className="space-y-6">
          {summaries.map((summary) => (
            <Card key={summary.code}>
              <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{summary.institution}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{summary.code} • {summary.count} complaint(s)</p>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Ref ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Bureau</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {summary.complaints.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-5 text-center text-sm text-slate-400">No complaints for this institution</td>
                      </tr>
                    ) : (
                      summary.complaints.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-slate-50/60">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{complaint.referenceId}</td>
                          <td className="px-6 py-4 text-sm text-slate-700">{complaint.subject}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{complaint.category}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{complaint.bureau}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{complaint.ageDays} days</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/complaints/${complaint.id}`)}
                              className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { complaintService } from '../services/complaintService'
import type { Complaint } from '../types'

interface InstitutionSummary {
  institution: string
  code: string
  complaints: Complaint[]
  count: number
}

export default function Institutions() {
  const [summaries, setSummaries] = useState<InstitutionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintService.getInstitutionSummary().then((data) => {
      setSummaries(data)
      setLoading(false)
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Institutions</h1>
        <p className="mt-1 text-sm text-gray-600">Unified view of complaints by institution</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : summaries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No institutions found</div>
      ) : (
        <div className="space-y-6">
          {summaries.map((summary) => (
            <div key={summary.code} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{summary.institution}</h2>
                    <p className="text-sm text-gray-500">{summary.code} • {summary.count} complaint(s)</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ref ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bureau</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {summary.complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">{complaint.referenceId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{complaint.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{complaint.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{complaint.bureau}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{complaint.ageDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Complaint } from '../types'
import { complaintService, type ComplaintFilters } from '../services/complaintService'

export default function Complaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ComplaintFilters>({
    search: '',
    status: 'ALL',
    bureau: 'ALL',
  })

  useEffect(() => {
    setLoading(true)
    complaintService.getComplaints(filters).then((data) => {
      setComplaints(data)
      setLoading(false)
    })
  }, [filters])

  const handleFilterChange = (key: keyof ComplaintFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Complaints</h1>
        <p className="mt-1 text-sm text-gray-600">Manage and track all complaints</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search by ID, institution, or subject..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700">Bureau</label>
            <select
              value={filters.bureau}
              onChange={(e) => handleFilterChange('bureau', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bureau</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Update</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">No complaints found</td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{complaint.referenceId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{complaint.institutionName}</div>
                      <div className="text-xs text-gray-500">{complaint.institutionCode}</div>
                    </td>
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
                    <td className="px-6 py-4 text-sm text-gray-500">{complaint.ageDays} days</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(complaint.lastUpdatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
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
      </div>
    </div>
  )
}

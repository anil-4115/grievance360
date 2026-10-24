import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Complaint, ComplaintEvent } from '../types'
import { complaintService } from '../services/complaintService'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState<Complaint | undefined>()
  const [events, setEvents] = useState<ComplaintEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      Promise.all([complaintService.getComplaintById(id), complaintService.getEventsByComplaintId(id)]).then(
        ([complaintData, eventsData]) => {
          setComplaint(complaintData)
          setEvents(eventsData)
          setLoading(false)
        }
      )
    }
  }, [id])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>
  }

  if (!complaint) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Complaint not found</p>
        <button
          onClick={() => navigate('/complaints')}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          Back to Complaints
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/complaints')}
            className="text-sm font-medium text-blue-600 hover:text-blue-900"
          >
            ← Back to Complaints
          </button>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{complaint.referenceId}</h1>
          <p className="mt-1 text-sm text-gray-600">{complaint.subject}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Complaint Details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Institution</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.institutionName} ({complaint.institutionCode})</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Bureau</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.bureau}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.assignedTo || 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(complaint.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(complaint.lastUpdatedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.ageDays} days</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Transfer Count</dt>
                <dd className="mt-1 text-sm text-gray-900">{complaint.transferCount}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{complaint.description}</dd>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Event Timeline</h2>
            <div className="mt-4 flow-root">
              <ul className="-mb-8">
                {events.length === 0 ? (
                  <li className="text-sm text-gray-500">No events recorded</li>
                ) : (
                  events.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== events.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                              <span className="text-sm">📝</span>
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{event.action}</span> by {event.actor}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">{event.details}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Case Indicators</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unassigned</span>
                <span className={`text-sm font-medium ${complaint.unassigned ? 'text-red-600' : 'text-green-600'}`}>
                  {complaint.unassigned ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stale Case</span>
                <span className={`text-sm font-medium ${complaint.stale ? 'text-red-600' : 'text-green-600'}`}>
                  {complaint.stale ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Repeated Transfers</span>
                <span className={`text-sm font-medium ${complaint.transferCount >= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                  {complaint.transferCount >= 2 ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

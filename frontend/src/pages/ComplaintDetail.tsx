import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Complaint, ComplaintEvent } from '../types'
import { complaintService } from '../services/complaintService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState<Complaint | undefined>()
  const [events, setEvents] = useState<ComplaintEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      setLoading(true)
      setError(null)
      Promise.all([complaintService.getComplaintById(id), complaintService.getEventsByComplaintId(id)])
        .then(([complaintData, eventsData]) => {
          setComplaint(complaintData)
          setEvents(Array.isArray(eventsData) ? eventsData : [])
          setLoading(false)
        })
        .catch((err) => {
          setError(err?.message || 'Failed to load complaint details')
          setLoading(false)
        })
    }
  }, [id])

  const getStatusBadge = (status?: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-50 text-emerald-700'
    if (status === 'OVERDUE') return 'bg-red-50 text-red-700'
    if (status === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700'
    return 'bg-amber-50 text-amber-700'
  }

  if (loading) {
    return <div className="text-center py-10 text-slate-400">Loading complaint details...</div>
  }

  if (error || !complaint) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/complaints')} className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
          ← Back to Complaints
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error || 'Complaint not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button onClick={() => navigate('/complaints')} className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
            ← Back to Complaints
          </button>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{complaint.referenceId}</h1>
          <p className="mt-1 text-sm text-slate-600">{complaint.subject}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Information</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Core details and routing information</p>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Institution</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.institutionName} ({complaint.institutionCode})</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Category</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Bureau</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.bureau || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Assigned To</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.assignedTo || 'Unassigned'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Created At</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(complaint.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(complaint.lastUpdatedAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Age</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.ageDays} days</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Transfer Count</dt>
                  <dd className="mt-1 text-sm text-slate-900">{complaint.transferCount}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</dt>
                <dd className="mt-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">{complaint.description}</dd>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chronological Event Timeline</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Append-only workflow history</p>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-sm text-slate-400">No events recorded</div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {events.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== events.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white ring-8 ring-white">
                                <span className="text-sm">📝</span>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                              <div>
                                <p className="text-sm text-slate-900">
                                  <span className="font-medium">{event.action}</span> • {event.actor}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">{event.details}</p>
                              </div>
                              <div className="whitespace-nowrap text-sm text-slate-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Indicators</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Bottleneck risk signals</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Unassigned</span>
                <span className={`text-sm font-medium ${complaint.unassigned ? 'text-red-700' : 'text-emerald-700'}`}>
                  {complaint.unassigned ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Stale Case</span>
                <span className={`text-sm font-medium ${complaint.stale ? 'text-red-700' : 'text-emerald-700'}`}>
                  {complaint.stale ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Repeated Transfers</span>
                <span className={`text-sm font-medium ${complaint.transferCount >= 2 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {complaint.transferCount >= 2 ? 'Yes' : 'No'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

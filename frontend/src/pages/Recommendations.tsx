import { useEffect, useState } from 'react'
import type { Recommendation } from '../types'
import { complaintService } from '../services/complaintService'
import { mockComplaints } from '../data/mockComplaints'
import { Card, CardContent } from '../components/ui/Card'

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintService
      .getRecommendations()
      .then((data) => {
        setRecommendations(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load recommendations')
        setLoading(false)
      })
  }, [])

  const handleAccept = async (id: string) => {
    try {
      await complaintService.acceptRecommendation(id)
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'ACCEPTED' } : r))
      )
    } catch (err) {
      setError((err as Error)?.message || 'Failed to update recommendation')
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      await complaintService.dismissRecommendation(id)
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'DISMISSED' } : r))
      )
    } catch (err) {
      setError((err as Error)?.message || 'Failed to update recommendation')
    }
  }

  const getComplaintRef = (complaintId: string) => {
    return mockComplaints.find((c) => c.id === complaintId)?.referenceId || complaintId
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Recommendations</h1>
          <p className="mt-1 text-sm text-slate-600">Explainable next-action recommendations with supporting evidence</p>
        </div>
        <div className="text-sm text-slate-500">{recommendations.filter((r) => r.status === 'PENDING').length} pending</div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading recommendations...</div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-10 text-slate-400">No recommendations available</div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{rec.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{getComplaintRef(rec.complaintId)}</span>
                      {rec.status !== 'PENDING' && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            rec.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {rec.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-900">Reason</h4>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{rec.reason}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-900">Supporting Evidence</h4>
                      <ul className="mt-2 space-y-1">
                        {rec.evidence.map((evidence, idx) => (
                          <li key={idx} className="text-sm text-slate-600">
                            • {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">Created: {new Date(rec.createdAt).toLocaleString()}</p>
                  </div>
                  {rec.status === 'PENDING' && (
                    <div className="flex flex-row gap-2 lg:flex-col">
                      <button
                        onClick={() => handleAccept(rec.id)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDismiss(rec.id)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

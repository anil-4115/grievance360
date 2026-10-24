import { useEffect, useState } from 'react'
import type { Recommendation } from '../types'
import { complaintService } from '../services/complaintService'
import { mockComplaints } from '../data/mockComplaints'

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintService.getRecommendations().then((data) => {
      setRecommendations(data)
      setLoading(false)
    })
  }, [])

  const handleAccept = async (id: string) => {
    await complaintService.acceptRecommendation(id)
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ACCEPTED' } : r))
    )
  }

  const handleDismiss = async (id: string) => {
    await complaintService.dismissRecommendation(id)
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'DISMISSED' } : r))
    )
  }

  const getComplaintRef = (complaintId: string) => {
    return mockComplaints.find((c) => c.id === complaintId)?.referenceId || complaintId
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Recommendations</h1>
        <p className="mt-1 text-sm text-gray-600">Explainable next-action recommendations</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No recommendations</div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {getComplaintRef(rec.complaintId)}
                    </span>
                    {rec.status !== 'PENDING' && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          rec.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900">Reason</h4>
                    <p className="mt-1 text-sm text-gray-600">{rec.reason}</p>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900">Supporting Evidence</h4>
                    <ul className="mt-1 space-y-1">
                      {rec.evidence.map((evidence, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Created: {new Date(rec.createdAt).toLocaleString()}
                  </p>
                </div>
                {rec.status === 'PENDING' && (
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleAccept(rec.id)}
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

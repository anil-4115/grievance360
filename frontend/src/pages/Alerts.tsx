import { useEffect, useState } from 'react'
import { complaintService } from '../services/complaintService'
import { Card, CardContent } from '../components/ui/Card'

interface Alert {
  id: string
  type: string
  title: string
  message: string
  count: number
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintService
      .getBottleneckAlerts()
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load alerts')
        setLoading(false)
      })
  }, [])

  const getAlertStyle = (type: string) => {
    if (type === 'STALE') return 'border-red-200 bg-red-50/80'
    if (type === 'UNASSIGNED') return 'border-amber-200 bg-amber-50/80'
    if (type === 'REPEATED_TRANSFER') return 'border-orange-200 bg-orange-50/80'
    return 'border-slate-200 bg-slate-50'
  }

  const getIcon = (type: string) => {
    if (type === 'STALE') return '🕒'
    if (type === 'UNASSIGNED') return '👤'
    if (type === 'REPEATED_TRANSFER') return '🔄'
    return '⚠️'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Bottleneck Alerts</h1>
          <p className="mt-1 text-sm text-slate-600">Early detection of stale, unassigned and repeated-transfer cases</p>
        </div>
        <div className="text-sm text-slate-500">{alerts.length} alert(s)</div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-8 text-sm text-emerald-700">
            <span>✅</span>
            <span>No bottlenecks detected. All cases are on track.</span>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={getAlertStyle(alert.type)}>
              <CardContent className="flex items-start gap-4 p-6">
                <span className="text-2xl">{getIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                    <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                      {alert.count}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{alert.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

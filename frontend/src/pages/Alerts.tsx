import { useEffect, useState } from 'react'
import { complaintService } from '../services/complaintService'

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

  useEffect(() => {
    complaintService.getBottleneckAlerts().then((data) => {
      setAlerts(data)
      setLoading(false)
    })
  }, [])

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'STALE':
        return 'border-red-200 bg-red-50'
      case 'UNASSIGNED':
        return 'border-yellow-200 bg-yellow-50'
      case 'REPEATED_TRANSFER':
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'STALE':
        return '🕒'
      case 'UNASSIGNED':
        return '👤'
      case 'REPEATED_TRANSFER':
        return '🔄'
      default:
        return '⚠️'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bottleneck Alerts</h1>
        <p className="mt-1 text-sm text-gray-600">Detect stale cases, unassigned cases and repeated transfers</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-green-800">✅ No bottlenecks detected. All cases are on track.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border p-6 ${getAlertStyle(alert.type)}`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl">{getIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900">
                      {alert.count}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

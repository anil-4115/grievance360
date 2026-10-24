import type { Complaint, ComplaintEvent, Recommendation } from '../types'
import { mockComplaints, mockEvents, mockRecommendations } from '../data/mockComplaints'
import { api } from '../lib/api'

export interface ComplaintFilters {
  search: string
  status: string
  bureau: string
}

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

class ComplaintService {
  async getComplaints(filters?: ComplaintFilters): Promise<Complaint[]> {
    if (!useMock) {
      try {
        const params: Record<string, string> = {}
        if (filters?.search) params.search = filters.search
        if (filters?.status && filters.status !== 'ALL') params.status = filters.status
        if (filters?.bureau && filters.bureau !== 'ALL') params.bureau = filters.bureau
        const response = await api.get('/complaints', { params })
        const data = response.data
        if (Array.isArray(data)) {
          return data
        }
        if (data && Array.isArray(data.content)) {
          return data.content
        }
      } catch (error) {
        throw error
      }
    }

    let results = [...mockComplaints]
    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        results = results.filter(
          (c) =>
            c.referenceId.toLowerCase().includes(q) ||
            c.institutionName.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q)
        )
      }
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter((c) => c.status === filters.status)
      }
      if (filters.bureau && filters.bureau !== 'ALL') {
        results = results.filter((c) => c.bureau === filters.bureau)
      }
    }
    return results
  }

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    if (!useMock) {
      try {
        const response = await api.get(`/complaints/${id}`)
        return response.data
      } catch (error) {
        throw error
      }
    }
    return mockComplaints.find((c) => c.id === id)
  }

  async getEventsByComplaintId(complaintId: string): Promise<ComplaintEvent[]> {
    if (!useMock) {
      try {
        const response = await api.get(`/complaints/${complaintId}/events`)
        const data = response.data
        if (Array.isArray(data)) {
          return data.map((e: any) => ({
            id: e.id,
            complaintId: e.complaintId,
            timestamp: e.timestamp,
            actor: e.actor,
            action: e.action,
            details: e.details,
          }))
        }
        return []
      } catch (error) {
        throw error
      }
    }
    return mockEvents
      .filter((e) => e.complaintId === complaintId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return [...mockRecommendations]
  }

  async getRecommendationsByComplaintId(complaintId: string): Promise<Recommendation[]> {
    return mockRecommendations.filter((r) => r.complaintId === complaintId)
  }

  async acceptRecommendation(id: string): Promise<Recommendation | undefined> {
    const rec = mockRecommendations.find((r) => r.id === id)
    if (rec) {
      rec.status = 'ACCEPTED'
    }
    return rec
  }

  async dismissRecommendation(id: string): Promise<Recommendation | undefined> {
    const rec = mockRecommendations.find((r) => r.id === id)
    if (rec) {
      rec.status = 'DISMISSED'
    }
    return rec
  }

  async getBottleneckAlerts() {
    const alerts = []
    const stale = mockComplaints.filter((c) => c.stale)
    if (stale.length > 0) {
      alerts.push({
        id: 'alert-stale',
        type: 'STALE',
        title: 'Stale cases detected',
        message: `${stale.length} case(s) have not been updated recently.`,
        count: stale.length,
      })
    }
    const unassigned = mockComplaints.filter((c) => c.unassigned)
    if (unassigned.length > 0) {
      alerts.push({
        id: 'alert-unassigned',
        type: 'UNASSIGNED',
        title: 'Unassigned cases',
        message: `${unassigned.length} case(s) awaiting assignment.`,
        count: unassigned.length,
      })
    }
    const repeated = mockComplaints.filter((c) => c.transferCount >= 2)
    if (repeated.length > 0) {
      alerts.push({
        id: 'alert-repeats',
        type: 'REPEATED_TRANSFER',
        title: 'Repeated transfers',
        message: `${repeated.length} case(s) have 2+ transfers indicating potential bottlenecks.`,
        count: repeated.length,
      })
    }
    return alerts
  }

  async getInstitutions() {
    if (!useMock) {
      try {
        const response = await api.get('/institutions')
        return response.data
      } catch (error) {
        throw error
      }
    }
    return [
      { id: 'inst-001', code: 'GEC-01', name: 'Government Engineering College', location: 'City A' },
      { id: 'inst-002', code: 'IOT-02', name: 'Institute of Technology', location: 'City B' },
      { id: 'inst-003', code: 'POL-03', name: 'Polytechnic College', location: 'City C' },
    ]
  }

  async getInstitutionSummary() {
    if (!useMock) {
      try {
        const [institutionsRes, complaintsRes] = await Promise.all([
          api.get('/institutions'),
          api.get('/complaints', { params: { size: 100 } }),
        ])
        const institutions = institutionsRes.data || []
        const complaintsData = complaintsRes.data
        const complaints = Array.isArray(complaintsData) ? complaintsData : complaintsData?.content || []

        const summaryMap = new Map<string, { institution: string; code: string; complaints: Complaint[]; count: number; id: string }>()
        for (const inst of institutions) {
          summaryMap.set(inst.id, {
            id: inst.id,
            institution: inst.name,
            code: inst.code,
            complaints: [],
            count: 0,
          })
        }
        for (const c of complaints) {
          const instId = c.institutionId
          if (summaryMap.has(instId)) {
            summaryMap.get(instId)!.complaints.push(c)
            summaryMap.get(instId)!.count++
          } else {
            summaryMap.set(instId, {
              id: instId,
              institution: c.institutionName || instId,
              code: c.institutionCode || '',
              complaints: [c],
              count: 1,
            })
          }
        }
        return Array.from(summaryMap.values())
      } catch (error) {
        throw error
      }
    }

    const summary: Record<string, { institution: string; code: string; complaints: Complaint[]; count: number }> = {}
    for (const c of mockComplaints) {
      if (!summary[c.institutionId]) {
        summary[c.institutionId] = {
          institution: c.institutionName,
          code: c.institutionCode,
          complaints: [],
          count: 0,
        }
      }
      summary[c.institutionId].complaints.push(c)
      summary[c.institutionId].count++
    }
    return Object.values(summary)
  }
}

export const complaintService = new ComplaintService()

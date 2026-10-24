import type { Complaint, ComplaintEvent, Recommendation } from '../types'
import { mockComplaints, mockEvents, mockRecommendations } from '../data/mockComplaints'

export interface ComplaintFilters {
  search: string
  status: string
  bureau: string
}

class ComplaintService {
  async getComplaints(filters?: ComplaintFilters): Promise<Complaint[]> {
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
    return mockComplaints.find((c) => c.id === id)
  }

  async getEventsByComplaintId(complaintId: string): Promise<ComplaintEvent[]> {
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

  async getInstitutionSummary() {
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

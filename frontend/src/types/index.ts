export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'OVERDUE' | 'RESOLVED' | 'CLOSED'

export type Bureau = 'RB' | 'PGRC' | 'ACADEMIC' | 'FINANCE' | 'STUDENT_AFFAIRS'

export type ComplaintCategory =
  | 'ADMISSION'
  | 'EXAMINATION'
  | 'FEE'
  | 'HOSTEL'
  | 'FACULTY'
  | 'INFRASTRUCTURE'
  | 'SCHOLARSHIP'
  | 'OTHERS'

export interface Institution {
  id: string
  name: string
  code: string
  location: string
}

export interface ComplaintEvent {
  id: string
  complaintId: string
  timestamp: string
  actor: string
  action: string
  details: string
}

export interface Recommendation {
  id: string
  complaintId: string
  title: string
  reason: string
  evidence: string[]
  status: 'PENDING' | 'ACCEPTED' | 'DISMISSED'
  createdAt: string
}

export interface Complaint {
  id: string
  referenceId: string
  institutionId: string
  institutionName: string
  institutionCode: string
  category: ComplaintCategory
  bureau: Bureau
  status: ComplaintStatus
  subject: string
  description: string
  createdAt: string
  lastUpdatedAt: string
  ageDays: number
  assignedTo?: string
  transferCount: number
  unassigned: boolean
  stale: boolean
}

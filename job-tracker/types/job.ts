export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'pending'

export interface StatusHistory {
  id: string
  status: JobStatus
  notes?: string
  changedAt: string
}

export interface JobApplication {
  id: string
  company: string
  position: string
  status: JobStatus
  applicationDate: string
  interviewDate?: string
  notes?: string
  statusHistory: StatusHistory[]
  createdAt: string
  updatedAt: string
}

export interface Statistics {
  total: number
  byStatus: Record<JobStatus, number>
  byMonth: Record<string, number>
}

export const statusLabels: Record<JobStatus, string> = {
  applied: '已投递',
  interviewing: '面试中',
  offer: '已录用',
  rejected: '已拒绝',
  pending: '待定'
}

export const statusColors: Record<JobStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  interviewing: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800'
}

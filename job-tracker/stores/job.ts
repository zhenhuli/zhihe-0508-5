import { defineStore } from 'pinia'
import type { JobApplication, JobStatus, Statistics, StatusHistory } from '~/types/job'

const STORAGE_KEY = 'job-tracker-applications'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function createStatusHistory(status: JobStatus, notes?: string): StatusHistory {
  return {
    id: generateId(),
    status,
    notes,
    changedAt: getTodayString()
  }
}

function migrateData(applications: any[]): JobApplication[] {
  return applications.map(app => {
    if (!app.statusHistory) {
      return {
        ...app,
        statusHistory: [createStatusHistory(app.status, app.notes)]
      }
    }
    return app
  })
}

function loadFromStorage(): JobApplication[] {
  if (process.server) return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return migrateData(parsed)
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e)
  }
  return getInitialData()
}

function saveToStorage(applications: JobApplication[]): void {
  if (process.server) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

function getInitialData(): JobApplication[] {
  const today = getTodayString()
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  
  return [
    {
      id: generateId(),
      company: '阿里巴巴',
      position: '前端开发工程师',
      status: 'interviewing',
      applicationDate: lastWeek,
      interviewDate: today,
      notes: '已完成一面，准备二面',
      statusHistory: [
        createStatusHistory('applied', '在招聘网站投递了简历'),
        createStatusHistory('interviewing', '已完成一面，准备二面')
      ],
      createdAt: lastWeek,
      updatedAt: yesterday
    },
    {
      id: generateId(),
      company: '腾讯科技',
      position: '全栈工程师',
      status: 'applied',
      applicationDate: yesterday,
      notes: '在官网投递的简历',
      statusHistory: [
        createStatusHistory('applied', '在官网投递的简历')
      ],
      createdAt: yesterday,
      updatedAt: yesterday
    },
    {
      id: generateId(),
      company: '字节跳动',
      position: 'Vue 前端开发',
      status: 'offer',
      applicationDate: lastWeek,
      interviewDate: yesterday,
      notes: '收到口头 offer，等待正式邮件',
      statusHistory: [
        createStatusHistory('applied', '通过内推渠道投递'),
        createStatusHistory('interviewing', '完成了三轮技术面试'),
        createStatusHistory('offer', '收到口头 offer，等待正式邮件')
      ],
      createdAt: lastWeek,
      updatedAt: today
    },
    {
      id: generateId(),
      company: '百度',
      position: 'Web 开发工程师',
      status: 'rejected',
      applicationDate: lastWeek,
      notes: '简历筛选未通过',
      statusHistory: [
        createStatusHistory('applied', '投递了百度的社招岗位'),
        createStatusHistory('rejected', '简历筛选未通过，可能是经验要求不符')
      ],
      createdAt: lastWeek,
      updatedAt: yesterday
    },
    {
      id: generateId(),
      company: '美团',
      position: '前端架构师',
      status: 'pending',
      applicationDate: today,
      notes: '内推中，等待 HR 联系',
      statusHistory: [
        createStatusHistory('pending', '内推中，等待 HR 联系')
      ],
      createdAt: today,
      updatedAt: today
    }
  ]
}

export const useJobStore = defineStore('job', {
  state: () => ({
    applications: [] as JobApplication[],
    loaded: false
  }),
  
  getters: {
    sortedApplications: (state): JobApplication[] => {
      return [...state.applications].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    },
    
    getApplicationById: (state) => (id: string): JobApplication | undefined => {
      return state.applications.find(app => app.id === id)
    },
    
    getLatestNote: () => (application: JobApplication): string | undefined => {
      if (application.statusHistory.length === 0) return undefined
      const latest = application.statusHistory[application.statusHistory.length - 1]
      return latest.notes
    },
    
    statistics: (state): Statistics => {
      const byStatus: Record<JobStatus, number> = {
        applied: 0,
        interviewing: 0,
        offer: 0,
        rejected: 0,
        pending: 0
      }
      
      const byMonth: Record<string, number> = {}
      
      for (const app of state.applications) {
        byStatus[app.status]++
        const month = app.applicationDate.substring(0, 7)
        byMonth[month] = (byMonth[month] || 0) + 1
      }
      
      return {
        total: state.applications.length,
        byStatus,
        byMonth
      }
    }
  },
  
  actions: {
    loadApplications() {
      if (this.loaded) return
      this.applications = loadFromStorage()
      this.loaded = true
    },
    
    addApplication(data: {
      company: string
      position: string
      status: JobStatus
      applicationDate: string
      interviewDate?: string
      notes?: string
    }) {
      const now = getTodayString()
      const newApplication: JobApplication = {
        id: generateId(),
        company: data.company,
        position: data.position,
        status: data.status,
        applicationDate: data.applicationDate,
        interviewDate: data.interviewDate,
        notes: data.notes,
        statusHistory: [createStatusHistory(data.status, data.notes)],
        createdAt: now,
        updatedAt: now
      }
      this.applications.push(newApplication)
      saveToStorage(this.applications)
    },
    
    updateApplication(id: string, data: Partial<JobApplication>) {
      const index = this.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        this.applications[index] = {
          ...this.applications[index],
          ...data,
          updatedAt: getTodayString()
        }
        saveToStorage(this.applications)
      }
    },
    
    updateStatus(id: string, status: JobStatus, notes?: string) {
      const index = this.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        const historyEntry = createStatusHistory(status, notes)
        const updatedApp = {
          ...this.applications[index],
          status,
          notes,
          updatedAt: getTodayString(),
          statusHistory: [...this.applications[index].statusHistory, historyEntry]
        }
        this.applications.splice(index, 1, updatedApp)
        saveToStorage(this.applications)
      }
    },
    
    addStatusHistory(id: string, status: JobStatus, notes?: string) {
      this.updateStatus(id, status, notes)
    },
    
    deleteApplication(id: string) {
      this.applications = this.applications.filter(app => app.id !== id)
      saveToStorage(this.applications)
    }
  }
})

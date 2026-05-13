import { defineStore } from 'pinia'
import type { Birthday, BirthdayWithInfo } from '~/types/birthday'
import { enrichBirthday, sortByDaysUntil, generateId } from '~/utils/birthdayUtils'

export const useBirthdayStore = defineStore('birthday', {
  state: () => ({
    birthdays: [] as Birthday[],
  }),

  getters: {
    enrichedBirthdays: (state): BirthdayWithInfo[] => {
      return sortByDaysUntil(state.birthdays.map(enrichBirthday))
    },

    todayBirthdays: (state): BirthdayWithInfo[] => {
      return state.birthdays
        .map(enrichBirthday)
        .filter(b => b.isToday)
    },

    upcomingBirthdays: (state): BirthdayWithInfo[] => {
      return sortByDaysUntil(
        state.birthdays
          .map(enrichBirthday)
          .filter(b => !b.isToday && b.daysUntil <= 30)
      )
    },
  },

  actions: {
    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('birthdays')
        if (stored) {
          this.birthdays = JSON.parse(stored)
        }
      }
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('birthdays', JSON.stringify(this.birthdays))
      }
    },

    addBirthday(birthday: Omit<Birthday, 'id'>) {
      const newBirthday: Birthday = {
        ...birthday,
        id: generateId(),
      }
      this.birthdays.push(newBirthday)
      this.saveToStorage()
    },

    updateBirthday(id: string, data: Partial<Birthday>) {
      const index = this.birthdays.findIndex(b => b.id === id)
      if (index !== -1) {
        this.birthdays[index] = { ...this.birthdays[index], ...data }
        this.saveToStorage()
      }
    },

    deleteBirthday(id: string) {
      this.birthdays = this.birthdays.filter(b => b.id !== id)
      this.saveToStorage()
    },
  },
})

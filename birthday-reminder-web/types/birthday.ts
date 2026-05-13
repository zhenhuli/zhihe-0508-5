export interface Birthday {
  id: string
  name: string
  date: string
  note?: string
}

export interface BirthdayWithInfo extends Birthday {
  zodiac: string
  zodiacEmoji: string
  daysUntil: number
  age: number
  isToday: boolean
}

import type { Birthday, BirthdayWithInfo } from '~/types/birthday'

const zodiacSigns = [
  { name: '摩羯座', emoji: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: '水瓶座', emoji: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '双鱼座', emoji: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: '白羊座', emoji: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '金牛座', emoji: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '双子座', emoji: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
  { name: '巨蟹座', emoji: '♋', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
  { name: '狮子座', emoji: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '处女座', emoji: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '天秤座', emoji: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
  { name: '天蝎座', emoji: '♏', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
  { name: '射手座', emoji: '♐', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 },
]

export function getZodiac(dateStr: string): { name: string; emoji: string } {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()

  for (const sign of zodiacSigns) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return { name: sign.name, emoji: sign.emoji }
    }
  }
  return { name: '摩羯座', emoji: '♑' }
}

export function calculateDaysUntilBirthday(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const birthDate = new Date(dateStr)
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }
  
  const diffTime = nextBirthday.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export function calculateAge(dateStr: string): number {
  const today = new Date()
  const birthDate = new Date(dateStr)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export function enrichBirthday(birthday: Birthday): BirthdayWithInfo {
  const zodiac = getZodiac(birthday.date)
  const daysUntil = calculateDaysUntilBirthday(birthday.date)
  const age = calculateAge(birthday.date)
  
  return {
    ...birthday,
    zodiac: zodiac.name,
    zodiacEmoji: zodiac.emoji,
    daysUntil,
    age,
    isToday: daysUntil === 0,
  }
}

export function sortByDaysUntil(birthdays: BirthdayWithInfo[]): BirthdayWithInfo[] {
  return [...birthdays].sort((a, b) => a.daysUntil - b.daysUntil)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function exportToCSV(birthdays: BirthdayWithInfo[]): string {
  const headers = ['姓名', '生日', '星座', '距离天数', '年龄', '备注']
  const rows = birthdays.map(b => [
    b.name,
    b.date,
    `${b.zodiacEmoji}${b.zodiac}`,
    b.daysUntil === 0 ? '今天' : `${b.daysUntil}天`,
    b.age.toString(),
    b.note || ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csvContent
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

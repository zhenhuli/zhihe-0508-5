export interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string[]
  annotations: Annotation[]
  rhythm: number[][]
  appreciation: string
  background: string
}

export interface Annotation {
  word: string
  explanation: string
}

export interface Dynasty {
  id: string
  name: string
  description: string
  period: string
  feature: string
  representative: string
  atmosphere: string
}

import type { ErrorType } from '../chat/types'

export interface ActivityDay {
  date: string
  messages: number
  reviews: number
}

export interface ErrorTypeStat {
  errorType: ErrorType
  mistakes: number
  cards: number
  due: number
  mature: number
  topics: { id: string; title: string }[]
}

export interface Stats {
  timeZone: string
  streak: number
  totalMessages: number
  errorFree: { last7: number | null; previous7: number | null }
  activity: ActivityDay[]
  errorTypes: ErrorTypeStat[]
  cards: { total: number; due: number; new: number; learning: number; mature: number }
  grammar: {
    topics: { id: string; level: string; order: number; title: string; bestScore: number | null }[]
    attempted: number
    passed: number
  }
}

// Chart colors, validated with the dataviz skill's palette checker
// (categorical pair and the sequential blue steps, light surface).
export const CHART = {
  accent: '#2a78d6', // series 1 / emphasis
  second: '#eb6834', // series 2
  muted: '#c3c2b7', // de-emphasised marks
  track: '#e8f0fb', // meter track, a light step of the same blue
  stageNew: '#86b6ef',
  stageLearning: '#3987e5',
  stageMature: '#184f95',
  gridline: '#e1e0d9',
}

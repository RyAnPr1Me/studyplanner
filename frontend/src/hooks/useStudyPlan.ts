import { useCallback, useState } from 'react'
import type { DailyPlan, WeeklyPlan } from '../types/plan'
import { fetchDailyPlan, generateWeeklyPlan } from '../store/api/planApi'

export function useStudyPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [loading, setLoading] = useState(false)

  const generatePlan = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true)
    try {
      const plan = await generateWeeklyPlan(payload)
      setWeeklyPlan(plan)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadDailyPlan = useCallback(async (date: string, userId: string) => {
    setLoading(true)
    try {
      const plan = await fetchDailyPlan(date, userId)
      setDailyPlan(plan)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weeklyPlan,
    dailyPlan,
    loading,
    generatePlan,
    loadDailyPlan,
  }
}

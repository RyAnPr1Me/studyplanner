import { useCallback, useState } from 'react'
import type { DailyPlan, WeeklyPlan } from '../types/plan'
import { fetchDailyPlan, generateWeeklyPlan } from '../store/api/planApi'

export function useStudyPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePlan = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const plan = await generateWeeklyPlan(payload)
      setWeeklyPlan(plan)
      return plan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loadDailyPlan = useCallback(async (date: string, userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const plan = await fetchDailyPlan(date, userId)
      setDailyPlan(plan)
      return plan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load daily plan')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weeklyPlan,
    dailyPlan,
    loading,
    error,
    generatePlan,
    loadDailyPlan,
  }
}

import { useCallback, useState } from 'react'
import type { DailyPlanResponse, PlanGenerateRequest, PlanResponse } from '../types/plan'
import { fetchDailyPlan, generateWeeklyPlan, regenerateDailyPlan, updateTask } from '../store/api/planApi'

export function useStudyPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<PlanResponse | null>(null)
  const [dailyPlan, setDailyPlan] = useState<DailyPlanResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePlan = useCallback(async (payload: PlanGenerateRequest) => {
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

  const regeneratePlan = useCallback(async (date: string, payload: { user_id: string; adjustments: string; keep_completed: boolean }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await regenerateDailyPlan(date, payload)
      setDailyPlan(response.daily_plan)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate daily plan')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTaskStatus = useCallback(async (taskId: string, payload: { status: string; actual_duration?: number; notes?: string }) => {
    setLoading(true)
    setError(null)
    try {
      return await updateTask(taskId, payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
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
    regeneratePlan,
    updateTaskStatus,
  }
}

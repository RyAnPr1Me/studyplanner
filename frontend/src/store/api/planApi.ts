import api from '../../utils/api'
import type { DailyPlan, WeeklyPlan } from '../../types/plan'

export async function generateWeeklyPlan(payload: Record<string, unknown>): Promise<WeeklyPlan> {
  const response = await api.post<{ data: WeeklyPlan }>('/plans/generate', payload)
  return response.data.data
}

export async function fetchDailyPlan(date: string, userId: string): Promise<DailyPlan> {
  const response = await api.get<{ data: DailyPlan }>(`/plans/daily/${date}`, {
    params: { user_id: userId },
  })
  return response.data.data
}

import api from '../../utils/api'
import type { ApiEnvelope } from '../../types/api'
import type { DailyPlanResponse, PlanGenerateRequest, PlanResponse, TaskUpdateRequest } from '../../types/plan'

export async function generateWeeklyPlan(payload: PlanGenerateRequest) {
  const response = await api.post<ApiEnvelope<PlanResponse>>('/plans/generate', payload)
  return response.data.data
}

export async function fetchDailyPlan(date: string, userId: string) {
  const response = await api.get<ApiEnvelope<DailyPlanResponse>>(`/plans/daily/${date}`, {
    params: { user_id: userId },
  })
  return response.data.data
}

export async function regenerateDailyPlan(date: string, payload: { user_id: string; adjustments: string; keep_completed: boolean }) {
  const response = await api.post<ApiEnvelope<{ daily_plan: DailyPlanResponse; changes: string }>>(
    `/plans/daily/${date}/regenerate`,
    payload,
  )
  return response.data.data
}

export async function updateTask(taskId: string, payload: TaskUpdateRequest) {
  const response = await api.patch<ApiEnvelope<{ task_id: string; status: string; updated_at: string }>>(
    `/plans/tasks/${taskId}`,
    payload,
  )
  return response.data.data
}

export async function fetchOverdueTasks(userId: string) {
  const response = await api.get<ApiEnvelope<{ overdue_tasks: Array<Record<string, unknown>>; total_overdue: number }>>(
    '/tasks/overdue',
    { params: { user_id: userId } },
  )
  return response.data.data
}

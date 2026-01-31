import type { ApiEnvelope } from '../../types/api'
import type { UpcomingReminderResponse, ReminderListResponse } from '../../types/reminder'
import api from '../../utils/api'

export async function fetchUpcomingReminders(userId: string, hours = 24) {
  const response = await api.get<ApiEnvelope<UpcomingReminderResponse>>('/reminders/upcoming', {
    params: { user_id: userId, hours },
  })
  return response.data.data
}

export async function fetchReminders(userId: string) {
  const response = await api.get<ApiEnvelope<ReminderListResponse>>('/reminders', {
    params: { user_id: userId },
  })
  return response.data.data
}

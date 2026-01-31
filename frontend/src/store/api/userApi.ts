import type { ApiEnvelope } from '../../types/api'
import type { UserProfileResponse, UserProfileRequest, UserStats } from '../../types/user'
import api from '../../utils/api'

export async function upsertProfile(payload: UserProfileRequest) {
  const response = await api.post<ApiEnvelope<UserProfileResponse>>('/users/profile', payload)
  return response.data.data
}

export async function fetchStats(userId: string) {
  const response = await api.get<ApiEnvelope<UserStats>>(`/users/${userId}/stats`)
  return response.data.data
}

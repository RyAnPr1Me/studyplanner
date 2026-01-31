import api from '../../utils/api'
import type { ApiEnvelope } from '../../types/api'
import type { AIMessage, AISuggestionResponse } from '../../types/ai'

export async function sendChatMessage(payload: { user_id: string; message: string; context?: Record<string, unknown> }) {
  const response = await api.post<ApiEnvelope<AIMessage>>('/ai/chat', payload)
  return response.data.data
}

export async function fetchSuggestions(payload: { user_id: string; context: string; data?: Record<string, unknown> }) {
  const response = await api.post<ApiEnvelope<AISuggestionResponse>>('/ai/suggest', payload)
  return response.data.data
}

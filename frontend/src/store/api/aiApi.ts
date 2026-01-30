import api from '../../utils/api'
import type { AIMessage } from '../../types/ai'

export async function sendChatMessage(payload: Record<string, unknown>): Promise<AIMessage> {
  const response = await api.post<{ data: AIMessage }>('/ai/chat', payload)
  return response.data.data
}

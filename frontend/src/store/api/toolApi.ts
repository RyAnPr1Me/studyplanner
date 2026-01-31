import api from '../../utils/api'
import type { ApiEnvelope } from '../../types/api'
import type { Tool, ToolEditResponse, ToolGenerateRequest, ToolListResponse } from '../../types/tool'

export async function fetchTools(userId: string, toolType?: string) {
  const response = await api.get<ApiEnvelope<ToolListResponse>>('/tools', {
    params: { user_id: userId, type: toolType },
  })
  return response.data.data
}

export async function generateTool(payload: ToolGenerateRequest) {
  const response = await api.post<ApiEnvelope<Tool>>('/tools/generate', payload)
  return response.data.data
}

export async function fetchTool(toolId: string) {
  const response = await api.get<ApiEnvelope<Tool>>(`/tools/${toolId}`)
  return response.data.data
}

export async function editTool(toolId: string, payload: { edit_instruction: string; current_state?: Record<string, unknown> }) {
  const response = await api.post<ApiEnvelope<ToolEditResponse>>(`/tools/${toolId}/edit`, payload)
  return response.data.data
}

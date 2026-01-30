import api from '../../utils/api'
import type { Tool } from '../../types/tool'

export async function fetchTools(userId: string): Promise<Tool[]> {
  const response = await api.get<{ data: { tools: Tool[] } }>('/tools', {
    params: { user_id: userId },
  })
  return response.data.data.tools
}

export async function generateTool(payload: Record<string, unknown>): Promise<Tool> {
  const response = await api.post<{ data: Tool }>('/tools/generate', payload)
  return response.data.data
}

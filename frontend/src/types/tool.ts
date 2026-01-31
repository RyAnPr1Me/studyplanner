export interface ToolMetadata {
  version: string
  created_at: string
  ai_model: string
}

export interface Tool {
  tool_id: string
  tool_type: string
  name: string
  description: string
  component_code: string
  metadata: ToolMetadata
  preview_url: string
}

export interface ToolListItem {
  tool_id: string
  name: string
  tool_type: string
  usage_count: number
  last_used?: string | null
}

export interface ToolListResponse {
  tools: ToolListItem[]
  total: number
  limit: number
  offset: number
}

export interface ToolDetailResponse {
  tool_id: string
  user_id: string
  name: string
  tool_type: string
  description: string
  component_code: string
  metadata: ToolMetadata
}

export interface ToolEditResponse {
  tool_id: string
  updated_component_code: string
  changes_summary: string
  version: string
}

export interface ToolGenerateRequest {
  user_id: string
  tool_type: string
  context: string
  requirements: string
  ui_preferences?: {
    theme?: string
    size?: string
  }
}

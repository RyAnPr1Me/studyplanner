export interface Tool {
  tool_id: string
  tool_type: string
  name: string
  description?: string
  component_code?: string
  metadata?: Record<string, unknown>
  preview_url?: string
}

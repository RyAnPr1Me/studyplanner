export interface AIAction {
  action_type: string
  description: string
  action_data?: Record<string, unknown>
}

export interface AIMessage {
  response: string
  suggested_actions: AIAction[]
  conversation_id: string
}

export interface AISuggestionResponse {
  suggestions: string[]
  priority: string
}

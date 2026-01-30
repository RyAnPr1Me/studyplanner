export interface AIMessage {
  response?: string
  message?: string
  suggested_actions?: Array<{ type: string; description: string }>
  conversation_id?: string
}

export interface AISuggestion {
  text: string
}

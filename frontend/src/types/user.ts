export interface UserProfile {
  id: string
  name: string
  email?: string
}

export interface UserStats {
  total_study_hours: number
  completed_tasks: number
  current_streak: number
  tools_created: number
  ai_interactions: number
}

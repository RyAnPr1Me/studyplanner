export interface UserProfile {
  user_id: string
  name: string
  email?: string
  preferences?: Record<string, unknown>
}

export interface UserProfileRequest {
  name: string
  email?: string
  preferences?: Record<string, unknown>
}

export interface UserProfileResponse {
  user_id: string
  profile: UserProfile
  created_at: string
}

export interface WeeklyActivity {
  date: string
  hours: number
}

export interface UserStats {
  total_study_hours: number
  completed_tasks: number
  current_streak: number
  tools_created: number
  ai_interactions: number
  subjects_progress: Record<string, number>
  weekly_activity: WeeklyActivity[]
}

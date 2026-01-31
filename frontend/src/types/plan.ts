export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  subject: string
  topic: string
  duration_minutes: number
  start_time: string
  due_date: string
  priority: Priority
  resources: string[]
  ai_notes: string
}

export interface DailyPlan {
  date: string
  day?: string
  tasks: Task[]
  total_study_time?: number
  breaks?: string[]
}

export interface SuggestedTool {
  tool_id: string
  tool_type: string
  subject: string
}

export interface DailyPlanResponse {
  date: string
  tasks: Task[]
  completed_tasks: string[]
  suggested_tools: SuggestedTool[]
}

export interface WeeklyPlan {
  week_start: string
  week_end: string
  subjects: string[]
  daily_plans: DailyPlan[]
}

export interface PlanResponse {
  plan_id: string
  weekly_plan: WeeklyPlan
  ai_rationale: string
  generated_at: string
}

export interface PlanGenerateRequest {
  user_id: string
  subjects: string[]
  goals: string
  study_hours_per_day: number
  difficulty_level: string
  start_date: string
}

export interface TaskUpdateRequest {
  status: string
  actual_duration?: number
  notes?: string
}

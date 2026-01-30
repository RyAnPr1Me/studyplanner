export interface Task {
  id: string
  subject: string
  topic: string
  duration_minutes: number
  start_time?: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  resources?: string[]
  ai_notes?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
}

export interface DailyPlan {
  date: string
  tasks: Task[]
  completed_tasks: string[]
  suggested_tools: Array<{ tool_id: string; tool_type: string; subject: string }>
}

export interface WeeklyPlan {
  week_start: string
  week_end: string
  subjects: string[]
  daily_plans: DailyPlan[]
}

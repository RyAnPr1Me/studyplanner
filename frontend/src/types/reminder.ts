export interface ReminderListItem {
  reminder_id: string
  task_id: string
  task_subject: string
  task_topic: string
  reminder_time: string
  message: string
  status: string
  notification_type: string
}

export interface ReminderListResponse {
  reminders: ReminderListItem[]
  total: number
}

export interface UpcomingReminderItem {
  reminder_id: string
  task_id: string
  task_subject: string
  reminder_time: string
  message: string
  time_until: string
}

export interface UpcomingReminderResponse {
  upcoming_reminders: UpcomingReminderItem[]
}

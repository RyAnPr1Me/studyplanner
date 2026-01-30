import type { ReactNode } from 'react'
import { Badge } from '@mui/material'

export interface ReminderBadgeProps {
  upcomingCount: number
  overdueCount: number
  children: ReactNode
}

const ReminderBadge = ({ upcomingCount, overdueCount, children }: ReminderBadgeProps) => {
  const total = upcomingCount + overdueCount

  return (
    <Badge badgeContent={total} color={overdueCount > 0 ? 'error' : 'primary'}>
      {children}
    </Badge>
  )
}

export default ReminderBadge

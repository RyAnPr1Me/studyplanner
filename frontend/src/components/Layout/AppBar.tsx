import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ReminderBadge from '../Reminders/ReminderBadge'

interface AppBarProps {
  upcomingCount: number
  overdueCount: number
  onMenuClick?: () => void
}

const AppBar = ({ upcomingCount, overdueCount, onMenuClick }: AppBarProps) => (
  <MuiAppBar position="sticky" elevation={0} sx={{ backgroundColor: '#ffffff', color: '#202124', borderBottom: '1px solid #e8eaed' }}>
    <Toolbar sx={{ gap: 2 }}>
      <IconButton edge="start" color="inherit" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        AI Study Planner
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton color="inherit">
        <ReminderBadge upcomingCount={upcomingCount} overdueCount={overdueCount}>
          <NotificationsIcon />
        </ReminderBadge>
      </IconButton>
    </Toolbar>
  </MuiAppBar>
)

export default AppBar

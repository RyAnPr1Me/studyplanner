import { AppBar as MuiAppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ReminderBadge from '../Reminders/ReminderBadge'

interface AppBarProps {
  upcomingCount: number
  overdueCount: number
  mode: 'light' | 'dark'
  onToggleMode: () => void
  onMenuClick?: () => void
}

const AppBar = ({ upcomingCount, overdueCount, mode, onToggleMode, onMenuClick }: AppBarProps) => (
  <MuiAppBar
    position="sticky"
    elevation={0}
    sx={{
      backgroundColor: mode === 'dark' ? 'rgba(26,28,32,0.96)' : '#ffffff',
      color: mode === 'dark' ? '#e8eaed' : '#202124',
      borderBottom: mode === 'dark' ? '1px solid rgba(138,180,248,0.15)' : '1px solid #e8eaed',
      backdropFilter: 'blur(12px)',
    }}
  >
    <Toolbar sx={{ gap: 2 }}>
      <IconButton edge="start" color="inherit" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        AI Study Planner
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton color="inherit" onClick={onToggleMode}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton color="inherit">
          <ReminderBadge upcomingCount={upcomingCount} overdueCount={overdueCount}>
            <NotificationsIcon />
          </ReminderBadge>
        </IconButton>
      </Stack>
    </Toolbar>
  </MuiAppBar>
)

export default AppBar

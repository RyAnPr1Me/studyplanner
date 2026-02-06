import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventNoteIcon from '@mui/icons-material/EventNote'
import TodayIcon from '@mui/icons-material/Today'
import BuildIcon from '@mui/icons-material/Build'
import SettingsIcon from '@mui/icons-material/Settings'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Weekly Plan', to: '/weekly', icon: <EventNoteIcon /> },
  { label: 'Daily Plan', to: '/daily', icon: <TodayIcon /> },
  { label: 'Tools', to: '/tools', icon: <BuildIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
]

interface SidebarProps {
  mode: 'light' | 'dark'
}

const Sidebar = ({ mode }: SidebarProps) => {
  const location = useLocation()

  return (
    <>
      <Toolbar />
      <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(138,180,248,0.15)' : '#e8eaed' }} />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            sx={{
              borderRadius: 2,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: mode === 'dark' ? 'rgba(138,180,248,0.18)' : '#e8f0fe',
                color: mode === 'dark' ? '#e8eaed' : '#1a73e8',
              },
              '&.Mui-selected .MuiListItemIcon-root': {
                color: mode === 'dark' ? '#8ab4f8' : '#1a73e8',
              },
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(138,180,248,0.08)' : '#f1f3f4',
              },
            }}
          >
            <ListItemIcon sx={{ color: mode === 'dark' ? '#9aa0a6' : '#5f6368' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  )
}

export default Sidebar

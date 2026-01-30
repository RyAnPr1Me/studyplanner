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

const Sidebar = () => {
  const location = useLocation()

  return (
    <>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e8f0fe',
                color: '#1a73e8',
              },
              '&.Mui-selected .MuiListItemIcon-root': {
                color: '#1a73e8',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  )
}

export default Sidebar

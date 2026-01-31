import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import AppBar from './AppBar'
import Sidebar from './Sidebar'
import { fetchUpcomingReminders } from '../../store/api/reminderApi'
import { fetchOverdueTasks } from '../../store/api/planApi'
import { getUserId } from '../../utils/user'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [overdueCount, setOverdueCount] = useState(0)

  const handleMenuClick = () => {
    setMobileOpen((prev) => !prev)
  }

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const response = await fetchUpcomingReminders(getUserId())
        setUpcomingCount(response.upcoming_reminders.length)
      } catch {
        setUpcomingCount(0)
      }
    }

    const loadOverdue = async () => {
      try {
        const response = await fetchOverdueTasks(getUserId())
        setOverdueCount(response.total_overdue ?? 0)
      } catch {
        setOverdueCount(0)
      }
    }

    void loadReminders()
    void loadOverdue()
  }, [])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop || mobileOpen}
        onClose={handleMenuClick}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#ffffff' },
        }}
      >
        <Sidebar />
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar upcomingCount={upcomingCount} overdueCount={overdueCount} onMenuClick={handleMenuClick} />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout

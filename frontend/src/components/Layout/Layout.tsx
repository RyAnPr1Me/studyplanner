import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'
import AppBar from './AppBar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMenuClick = () => {
    setMobileOpen((prev) => !prev)
  }

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
        <AppBar upcomingCount={2} overdueCount={1} onMenuClick={handleMenuClick} />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout

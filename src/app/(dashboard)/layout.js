'use client'

import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Menu, MenuItem, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import PaletteIcon from '@mui/icons-material/Palette'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSoftUIController, setMiniSidenav } from '@/context'
import { colors, shadows } from '@/styles/colors'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pemasukan', icon: <PaymentsIcon />, path: '/pemasukan' },
  { text: 'Pengeluaran', icon: <ReceiptIcon />, path: '/pengeluaran' },
  { text: 'Kas Desa', icon: <AccountBalanceWalletIcon />, path: '/kas-desa' },
  { text: 'Laporan Keuangan', icon: <AssessmentIcon />, path: '/laporan' },
]

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController()
  const { miniSidenav } = controller
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode')
      return savedMode ? JSON.parse(savedMode) : false
    }
    return false
  })
  const [user, setUser] = useState(null)
  const router = useRouter()
  const open = Boolean(anchorEl)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleDrawerToggle = () => {
    setMiniSidenav(dispatch, !miniSidenav)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    handleClose()
  }

  const handleLogout = () => {
    Cookies.remove('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/authentication/sign-in')
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 3,
        py: 2,
        minHeight: '80px !important'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo.png"
            alt="Coconut Logo"
            width={48}
            height={48}
            style={{ marginRight: '12px' }}
          />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: darkMode ? '#fff' : colors.primary.main,
                fontSize: '1.25rem',
                lineHeight: '1.2'
              }}
            >

            </Typography>
            <Typography 
              variant="caption"
              sx={{
                color: darkMode ? '#fff' : colors.text.secondary,
                display: 'block'
              }}
            >
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#fff' : colors.text.secondary,
            fontWeight: 500,
            mb: 1
          }}
        >
          MENU BENDAHARA
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            href={item.path}
            selected={pathname === item.path}
            sx={{
              borderRadius: '12px',
              mb: 1,
              py: 1,
              color: darkMode ? '#fff' : 'inherit',
              '&.Mui-selected': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : colors.primary.light,
                color: darkMode ? '#fff' : colors.primary.main,
                '& .MuiListItemIcon-root': {
                  color: darkMode ? '#fff' : colors.primary.main,
                },
              },
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : `${colors.primary.light}80`,
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: darkMode ? '#fff' : (pathname === item.path ? colors.primary.main : colors.text.secondary)
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <List sx={{ px: 2, mt: 'auto' }}>
        <ListItem 
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            py: 1,
            color: darkMode ? '#fff' : colors.text.secondary,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : `${colors.primary.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: darkMode ? '#1a1a1a' : '#F8F9FA', 
      minHeight: '100vh',
      color: darkMode ? '#fff' : colors.text.primary,
    }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})`
          },
          ml: { 
            xs: 0,
            sm: miniSidenav ? '80px' : '280px'
          },
          bgcolor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          color: darkMode ? '#fff' : colors.text.primary,
          boxShadow: 'none',
          '& .MuiIconButton-root': {
            color: darkMode ? '#fff' : colors.text.secondary,
          },
          transition: theme => theme.transitions.create(['margin', 'width', 'background-color', 'color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '64px !important', sm: '80px !important' },
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#fff' : colors.text.primary
            }}
          >
            {menuItems.find(item => item.path === pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleClick}
              sx={{ color: 'inherit' }}
              aria-controls={open ? 'settings-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="settings-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'settings-button',
              }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  minWidth: '200px',
                  boxShadow: shadows.card,
                  bgcolor: darkMode ? '#1a1a1a' : 'white',
                  color: darkMode ? '#fff' : 'inherit',
                  '& .MuiListItemIcon-root': {
                    color: darkMode ? '#fff' : 'inherit',
                  },
                }
              }}
            >
              <MenuItem onClick={toggleDarkMode}>
                <ListItemIcon>
                  {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{darkMode ? 'Light Mode' : 'Dark Mode'}</ListItemText>
              </MenuItem>
            </Menu>
            <Box 
              sx={{ 
                width: 36,
                height: 36,
                bgcolor: colors.primary.main,
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={miniSidenav}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: '240px', sm: '280px' },
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: miniSidenav ? '80px' : '280px',
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['width', 'background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3 },
        mt: '80px',
        ml: { xs: 0, sm: miniSidenav ? '80px' : '280px' },
        width: { xs: '100%', sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        {children}
      </Box>
    </Box>
  )
} 
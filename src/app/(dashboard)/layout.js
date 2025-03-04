'use client'

import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, InputBase } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSoftUIController, setMiniSidenav } from '@/context'
import { colors, shadows } from '@/styles/colors'

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

  const handleDrawerToggle = () => {
    setMiniSidenav(dispatch, !miniSidenav)
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
                color: colors.primary.main,
                fontSize: '1.25rem',
                lineHeight: '1.2'
              }}
            >
              COCONUT
            </Typography>
            <Typography 
              variant="caption"
              sx={{
                color: colors.text.secondary,
                display: 'block'
              }}
            >
              computer club
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary,
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
              '&.Mui-selected': {
                bgcolor: colors.primary.light,
                color: colors.primary.main,
                '& .MuiListItemIcon-root': {
                  color: colors.primary.main,
                },
              },
              '&:hover': {
                bgcolor: `${colors.primary.light}80`,
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: pathname === item.path ? colors.primary.main : colors.text.secondary 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: pathname === item.path ? 600 : 400,
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <List sx={{ px: 2, mt: 'auto' }}>
        <ListItem 
          component={Link} 
          href="/authentication/sign-in"
          sx={{
            borderRadius: '12px',
            py: 1,
            color: colors.text.secondary,
            '&:hover': {
              bgcolor: `${colors.primary.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign In" />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
          ml: { sm: miniSidenav ? '80px' : '280px' },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          color: colors.text.primary,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }}>
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
              color: colors.text.primary
            }}
          >
            {menuItems.find(item => item.path === pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: colors.text.secondary }}>
              <SettingsIcon />
            </IconButton>
            <IconButton 
              sx={{ 
                color: colors.text.secondary,
                position: 'relative'
              }}
            >
              <NotificationsIcon />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  bgcolor: colors.success.main,
                  borderRadius: '50%'
                }} 
              />
            </IconButton>
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
              A
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
            width: '280px',
            bgcolor: 'white',
            borderRight: 'none',
            boxShadow: shadows.card
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
            width: '280px',
            bgcolor: 'white',
            borderRight: 'none',
            boxShadow: shadows.card
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box sx={{ 
        flexGrow: 1, 
        p: 3,
        mt: '80px',
        ml: { sm: '280px' },
        transition: 'margin-left 0.2s ease-in-out'
      }}>
        {children}
      </Box>
    </Box>
  )
} 
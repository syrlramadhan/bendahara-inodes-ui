'use client';

import { useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const drawerWidth = 280;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;
  
  & .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #1a237e 0%, #0d47a1 100%);
    color: white;
    border-right: none;
    animation: ${slideIn} 0.3s ease-out;
  }
`;

const DrawerHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
`;

const Logo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const StyledListItem = styled(ListItem)`
  margin: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  .MuiListItemIcon-root {
    color: white;
    min-width: 40px;
  }

  animation: ${fadeIn} 0.5s ease-out;
`;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Pemasukan', icon: <TrendingUpIcon />, path: '/pemasukan' },
  { title: 'Pengeluaran', icon: <TrendingDownIcon />, path: '/pengeluaran' },
  { title: 'Kas Desa', icon: <AccountBalanceIcon />, path: '/kas-desa' },
  { title: 'Laporan', icon: <AssessmentIcon />, path: '/laporan' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
    >
      <DrawerHeader>
        <Logo>
          <Image
            src="/image.png"
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, display: open ? 'block' : 'none' }}>
            Bendahara Desa
          </Typography>
        </Logo>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>

      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <StyledListItem
              key={item.title}
              button
              onClick={() => handleNavigation(item.path)}
              className={pathname === item.path ? 'active' : ''}
              sx={{
                animation: `${fadeIn} 0.5s ease-out ${index * 0.1}s`,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.title} 
                sx={{
                  opacity: open ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
        <StyledListItem
          button
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Admin Bendahara"
            secondary="admin@desa.id"
            secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
          />
        </StyledListItem>
      </Box>
    </StyledDrawer>
  );
} 
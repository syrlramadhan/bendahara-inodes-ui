'use client'

import { useState, useEffect } from 'react'
import { Box, Card, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { colors, shadows } from '@/styles/colors'

export default function SignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode')
      setDarkMode(savedMode ? JSON.parse(savedMode) : false)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual authentication
    router.push('/dashboard')
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: darkMode ? '#1a1a1a' : '#F8F9FA',
      p: 3,
      transition: 'background-color 0.3s ease'
    }}>
      <Card sx={{
        maxWidth: 400,
        width: '100%',
        p: 4,
        boxShadow: shadows.card,
        borderRadius: '16px',
        bgcolor: darkMode ? '#2d2d2d' : 'white',
        transition: 'background-color 0.3s ease'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4
        }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            style={{ marginBottom: '16px' }}
          />
          <Typography variant="h5" sx={{ 
            fontWeight: 'bold',
            color: darkMode ? '#fff' : colors.text.primary,
            mb: 1,
            transition: 'color 0.3s ease'
          }}>
            Selamat Datang
          </Typography>
          <Typography variant="body2" sx={{ 
            color: darkMode ? 'rgba(255,255,255,0.7)' : colors.text.secondary,
            transition: 'color 0.3s ease'
          }}>
            Silakan login untuk melanjutkan
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                color: darkMode ? '#fff' : 'inherit',
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                color: darkMode ? '#fff' : 'inherit',
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: colors.primary.main,
              color: 'white',
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: colors.primary.dark,
              }
            }}
          >
            Login
          </Button>
        </form>
      </Card>
    </Box>
  )
} 
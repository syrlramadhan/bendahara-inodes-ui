'use client'

import { useState, useEffect } from 'react'
import { Box, Card, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { colors, shadows } from '@/styles/colors'
import Cookies from 'js-cookie'

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
    
    // Set cookie for authentication (expires in 1 day)
    Cookies.set('isAuthenticated', 'true', { expires: 1 })
    
    // Save user data
    const userData = {
      name: 'Admin Bendahara',
      username: formData.username,
      role: 'bendahara'
    }
    localStorage.setItem('user', JSON.stringify(userData))
    
    router.push('/dashboard')
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent', // Set the background of the outer Box to transparent
      p: 3,
      transition: 'background-color 0.3s ease',
      position: 'relative',
    }}>
      <Card sx={{
        maxWidth: 450,
        width: '100%',
        p: 5,
        boxShadow: shadows.card,
        borderRadius: '16px',
        bgcolor: darkMode ? 'rgba(45, 45, 45, 0.85)' : 'rgba(255, 255, 255, 0.9)', // Use transparent or semi-transparent background for the card
        backdropFilter: 'blur(10px)', // Add a backdrop blur effect
        transition: 'background-color 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4
        }}>
          <Image
            src="/image.png"
            alt="Logo"
            width={64}
            height={64}
            style={{ marginBottom: '16px', borderRadius: '50%' }}
          />
          <Typography variant="h4" sx={{
            fontWeight: 'bold',
            color: darkMode ? '#fff' : '#4E73DF',
            mb: 1,
            textAlign: 'center',
            fontSize: '1.75rem', 
            transition: 'color 0.3s ease'
          }}>
            Selamat Datang 
          </Typography>
          <Typography variant="body2" sx={{
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            fontSize: '1rem',
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
              fontSize: '1.125rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: colors.primary.dark,
                transform: 'scale(1.05)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              },
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            Login
          </Button>
        </form>
      </Card>
    </Box>
  )
}

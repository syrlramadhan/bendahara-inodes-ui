'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material'

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Implementasi login API akan ditambahkan nanti
      // Untuk sementara, kita set token dummy
      document.cookie = 'authToken=dummy-token; path=/'
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            UI Bendahara
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
} 
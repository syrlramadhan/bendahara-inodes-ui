'use client'

import { useState } from 'react'
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default function Clone() {
  const [loading, setLoading] = useState({
    iuran: false,
    sumbangan: false,
    pengeluaran: false
  })
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)

  const handleClone = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }))
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
      const response = await fetch('/api/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          type
        })
      })

      const data = await response.json()
      setMessage(data.message)
      setShowMessage(true)
    } catch (error) {
      console.error('Error cloning data:', error)
      setMessage('Gagal mengkloning data')
      setShowMessage(true)
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Kloning Data
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Gunakan fitur ini untuk mengkloning data dari aplikasi lama. Setiap klik akan membuat 100 data baru.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Iuran
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kloning data iuran dengan nilai acak
              </Typography>
              <Button
                variant="contained"
                startIcon={loading.iuran ? <CircularProgress size={20} color="inherit" /> : <ContentCopyIcon />}
                onClick={() => handleClone('iuran')}
                disabled={loading.iuran}
                fullWidth
              >
                {loading.iuran ? 'Mengkloning...' : 'Kloning Iuran'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sumbangan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kloning data sumbangan dengan nilai acak
              </Typography>
              <Button
                variant="contained"
                startIcon={loading.sumbangan ? <CircularProgress size={20} color="inherit" /> : <ContentCopyIcon />}
                onClick={() => handleClone('sumbangan')}
                disabled={loading.sumbangan}
                fullWidth
              >
                {loading.sumbangan ? 'Mengkloning...' : 'Kloning Sumbangan'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pengeluaran
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kloning data pengeluaran dengan nilai acak
              </Typography>
              <Button
                variant="contained"
                startIcon={loading.pengeluaran ? <CircularProgress size={20} color="inherit" /> : <ContentCopyIcon />}
                onClick={() => handleClone('pengeluaran')}
                disabled={loading.pengeluaran}
                fullWidth
              >
                {loading.pengeluaran ? 'Mengkloning...' : 'Kloning Pengeluaran'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
      >
        <Alert 
          onClose={() => setShowMessage(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
} 
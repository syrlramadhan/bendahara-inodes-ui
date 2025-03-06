'use client'

import { Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SearchHistory from '@/components/dashboard/search-history'
import { colors } from '@/styles/colors'
import { useState } from 'react'

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif', 
  },
})

export default function Dashboard() {
  const [openBiodata, setOpenBiodata] = useState(false)

  const handleClickOpen = () => {
    setOpenBiodata(true)
  }

  const handleClose = () => {
    setOpenBiodata(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: { xs: '16px', sm: '24px', md: '32px' } }}>
        
        {/* Navbar dengan Profile - Hapus bagian ini */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: 'transparent' }}>
        </Box> */}

        {/* Purple Gradient Card */}
        <Card variant="purple-gradient">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            position: 'relative',
            background: 'linear-gradient(150deg, #0284c7 0%, #0ea5e9 100%)',
            borderRadius: '10px',
            padding: '16px',
            height: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              opacity: 0.6,
              zIndex: -1,
            },
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2.5rem' },
                mb: 2,
                color: 'white',
              }}>
                Selamat Datang ...
              </Typography>
              <Typography variant="h6" sx={{
                fontWeight: 400,
                opacity: 0.8,
                color: 'white',
              }}>
                Bendahara Desa 
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{
                  fontSize: '100%',
                  opacity: 0.9,
                  color: 'white',
                }}>
                  Total Kas Desa
                </Typography>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: 'white',
                  mt: 1,
                }}>
                  Rp 50.000.000
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Uang Kas"
              value="Rp 2.000.000"
              trend="up"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Uang Masuk"
              value="Rp 500.000"
              trend="up"
              icon={<TrendingUpIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Uang Keluar"
              value="Rp 300.000"
              trend="down"
              icon={<TrendingDownIcon />}
            />
          </Grid>
        </Grid>

        {/* History Section */}
        <Card>
          <CardHeader
            title="History Transaksi"
            action={<SearchHistory placeholder="Cari transaksi..." />}
          />
          <CardBody>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Keterangan</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Jenis</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                    <td style={{ padding: '12px 16px' }}>2024-03-05</td>
                    <td style={{ padding: '12px 16px' }}>Pembayaran Listrik</td>
                    <td style={{ padding: '12px 16px' }} >
                      <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '6px',
                        bgcolor: colors.error.light,
                        color: colors.error.dark,
                        color: 'black',
                      }}>
                        Pengeluaran
                      </Box>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      color: colors.error.main,
                      fontWeight: 600,
                    }}>
                      - Rp 500.000
                    </td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                    <td style={{ padding: '12px 16px' }}>2024-03-04</td>
                    <td style={{ padding: '12px 16px' }}>Dana Desa</td>
                    <td style={{ padding: '12px 16px' }} >
                      <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '6px',
                        bgcolor: colors.success.light,
                        color: colors.success.dark,
                        color: 'black',
                      }}>
                        Pemasukan
                      </Box>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      color: colors.success.main,
                      fontWeight: 600,
                    }}>
                      + Rp 2.000.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </CardBody>
        </Card>

        {/* Biodata Modal */}
        <Dialog open={openBiodata} onClose={handleClose} sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            padding: '16px',
          }
        }}>
          <DialogTitle sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: colors.primary.main,
            textAlign: 'center',
          }}>
            Profil Bendahara Desa
          </DialogTitle>
          <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}>
          <img
            src="image copy.png"
            alt="Profile"
            style={{
              width: '100%', // Make the image take up 100% of its container's width
              maxWidth: '250px', // Set a maximum width for larger screens
              height: 'auto', // Maintain aspect ratio
              borderRadius: '50%', // Keep the image rounded
              marginBottom: '16px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Nama Bendahara: Andi Citra Ayu Lestari
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: colors.text.secondary }}>
            Alamat: Jl. Raya No.123, Jeneponto, Sulawesi Selatan
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: colors.text.secondary }}>
            Tempat Tgl Lahir : yyy , yyy,yyy
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: colors.text.secondary }}>
            Status : bendahara@desa.jeneponto
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: colors.text.secondary }}>
            Pengalaman: bendahara@desa.jeneponto
          </Typography>
        </DialogContent>

        <DialogActions sx={{
          justifyContent: 'center',
          marginTop: '16px',
        }}>
          <Button variant="contained" onClick={handleClose} sx={{
            backgroundColor: colors.primary.main,
            color: 'white',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: colors.primary.dark,
            },
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  </ThemeProvider>
)
}

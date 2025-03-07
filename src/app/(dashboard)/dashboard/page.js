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
import { useState, useEffect } from 'react'
import { laporanService } from '@/services/laporanService'

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif', 
  },
})

export default function Dashboard() {
  const [openBiodata, setOpenBiodata] = useState(false)
  const [laporan, setLaporan] = useState([])
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await laporanService.getAllLaporan()
        setLaporan(data)
        
        // Hitung total saldo, pemasukan, dan pengeluaran
        let saldo = 0
        let pemasukan = 0
        let pengeluaran = 0
        
        data.forEach(item => {
          saldo = item.total_saldo // Mengambil saldo terakhir
          pemasukan += item.pemasukan
          pengeluaran += item.pengeluaran
        })
        
        setTotalSaldo(saldo)
        setTotalPemasukan(pemasukan)
        setTotalPengeluaran(pengeluaran)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
                  {formatCurrency(totalSaldo)}
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
              value={formatCurrency(totalSaldo)}
              trend={totalSaldo >= 0 ? "up" : "down"}
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Uang Masuk"
              value={formatCurrency(totalPemasukan)}
              trend="up"
              icon={<TrendingUpIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Uang Keluar"
              value={formatCurrency(totalPengeluaran)}
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
                  {laporan.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.divider}` }}>
                      <td style={{ padding: '12px 16px' }}>{item.tanggal}</td>
                      <td style={{ padding: '12px 16px' }}>{item.keterangan}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Box sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '6px',
                          bgcolor: item.pengeluaran > 0 ? colors.error.light : colors.success.light,
                          color: item.pengeluaran > 0 ? colors.error.dark : colors.success.dark,
                        }}>
                          {item.pengeluaran > 0 ? 'Pengeluaran' : 'Pemasukan'}
                        </Box>
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: item.pengeluaran > 0 ? colors.error.main : colors.success.main,
                        fontWeight: 600,
                      }}>
                        {item.pengeluaran > 0 
                          ? `- ${formatCurrency(item.pengeluaran)}`
                          : `+ ${formatCurrency(item.pemasukan)}`
                        }
                      </td>
                    </tr>
                  ))}
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
                width: '100%',
                maxWidth: '250px',
                height: 'auto',
                borderRadius: '50%',
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

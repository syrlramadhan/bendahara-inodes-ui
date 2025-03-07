'use client'

import { Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid } from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
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

// Styled Components
const StyledCard = styled(Card)`
  background: ${({ variant }) => {
    const gradients = {
      blue: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      green: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
      red: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
      purple: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)'
    };
    return gradients[variant] || gradients.blue;
  }};
  border-radius: 16px;
  box-shadow: 0 4px 20px 0 rgba(0,0,0,0.1);
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 140px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%);
    opacity: 0.6;
    z-index: 1;
  }
`;

const IconWrapper = styled(Box)`
  position: absolute;
  right: -20px;
  bottom: -20px;
  opacity: 0.2;
  z-index: 0;
`;

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 2;
  padding: 24px;
`;

const HistoryCard = styled(Card)`
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px 0 rgba(0,0,0,0.05);
  overflow: hidden;
`;

export default function Dashboard() {
  const [openBiodata, setOpenBiodata] = useState(false)
  const [laporan, setLaporan] = useState([])
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await laporanService.getAllLaporan()
        
        if (Array.isArray(data)) {
          setLaporan(data)
          
          let saldo = 0
          let pemasukan = 0
          let pengeluaran = 0
          
          data.forEach(item => {
            if (item.total_saldo) saldo = item.total_saldo
            if (item.pemasukan) pemasukan += item.pemasukan
            if (item.pengeluaran) pengeluaran += item.pengeluaran
          })
          
          setTotalSaldo(saldo)
          setTotalPemasukan(pemasukan)
          setTotalPengeluaran(pengeluaran)
        } else {
          console.error('Data is not an array:', data)
          setError('Format data tidak valid')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message || 'Gagal mengambil data')
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
        {/* Welcome Card */}
        <StyledCard variant="purple">
          <ContentWrapper>
            <Box>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2.5rem' },
                mb: 2
              }}>
                Selamat Datang di Sistem Bendahara
              </Typography>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 400,
                opacity: 0.8,
                mb: 4
              }}>
                Kelola keuangan desa dengan lebih mudah dan efisien
              </Typography>
              <Typography component="div" sx={{ fontSize: '100%', opacity: 0.9 }}>
                Total Kas Desa
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 1 }}>
                {formatCurrency(totalSaldo)}
              </Typography>
            </Box>
          </ContentWrapper>
          <IconWrapper>
            <AccountBalanceWalletIcon sx={{ fontSize: '180px' }} />
          </IconWrapper>
        </StyledCard>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard variant="blue">
              <ContentWrapper>
                <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Kas
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(totalSaldo)}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <AccountBalanceWalletIcon sx={{ fontSize: '120px' }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard variant="green">
              <ContentWrapper>
                <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Pemasukan
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(totalPemasukan)}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <TrendingUpIcon sx={{ fontSize: '120px' }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard variant="red">
              <ContentWrapper>
                <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                  Total Pengeluaran
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(totalPengeluaran)}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <TrendingDownIcon sx={{ fontSize: '120px' }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
        </Grid>

        {/* History Section */}
        <HistoryCard>
          <CardHeader
            title={
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                History Transaksi
              </Typography>
            }
            action={<SearchHistory placeholder="Cari transaksi..." />}
            sx={{ borderBottom: '1px solid #eee', p: 3 }}
          />
          <CardBody sx={{ p: 0 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#1a237e', fontWeight: 600 }}>Tanggal</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#1a237e', fontWeight: 600 }}>Keterangan</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#1a237e', fontWeight: 600 }}>Jenis</th>
                    <th style={{ padding: '16px', textAlign: 'right', color: '#1a237e', fontWeight: 600 }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {laporan.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px' }}>{item.tanggal}</td>
                      <td style={{ padding: '16px' }}>{item.keterangan}</td>
                      <td style={{ padding: '16px' }}>
                        <Box sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '6px',
                          bgcolor: item.pengeluaran > 0 ? 'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                          color: item.pengeluaran > 0 ? '#d32f2f' : '#2e7d32',
                          fontWeight: 500
                        }}>
                          {item.pengeluaran > 0 ? 'Pengeluaran' : 'Pemasukan'}
                        </Box>
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'right',
                        color: item.pengeluaran > 0 ? '#d32f2f' : '#2e7d32',
                        fontWeight: 600,
                      }}>
                        {item.pengeluaran > 0 
                          ? `- ${formatCurrency(item.pengeluaran)}`
                          : `+ ${formatCurrency(item.pemasukan)}`
                        }
                      </td>
                    </tr>
                  ))}
                  {laporan.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                        Belum ada data transaksi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </CardBody>
        </HistoryCard>

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

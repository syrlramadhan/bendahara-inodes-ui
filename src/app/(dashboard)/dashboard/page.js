'use client'

import { Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, CircularProgress, Snackbar, Alert } from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SearchHistory from '@/components/dashboard/search-history'
import { colors } from '@/styles/colors'
import { useState, useEffect } from 'react'
import { laporanService } from '@/services/laporanService'
import { transaksiService } from '@/services/transaksiService'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

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
      green: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
      red: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
      purple: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)'
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
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // State baru untuk Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch financial reports data
        const laporanData = await laporanService.getAllLaporan()
        if (laporanData && laporanData.length > 0) {
          const lastReport = laporanData[0]
          setTotalSaldo(lastReport.total_saldo || 0)

          // Calculate totals from reports
          const pemasukan = laporanData.reduce((sum, item) => sum + (item.pemasukan || 0), 0)
          const pengeluaran = laporanData.reduce((sum, item) => sum + (item.pengeluaran || 0), 0)

          setTotalPemasukan(pemasukan)
          setTotalPengeluaran(pengeluaran)
        } else {
          showSnackbar('Data laporan keuangan tidak tersedia', 'warning')
        }

        // Fetch transaction history
        const transaksiData = await transaksiService.getLastTransaksi()
        if (Array.isArray(transaksiData)) {
          setTransactions(transaksiData)
          setFilteredTransactions(transaksiData)
        } else {
          showSnackbar('Format data transaksi tidak valid', 'error')
          setError('Format data transaksi tidak valid')
        }
      } catch (error) {
        const errorMessage = error.message || 'Gagal mengambil data';
        showSnackbar(errorMessage, 'error')
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter transaction data based on search query
    const filtered = transactions.filter(item =>
      item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.jenis_transaksi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tanggal?.includes(searchQuery)
    )
    setFilteredTransactions(filtered)
  }, [searchQuery, transactions])

  const handleSearch = (value) => {
    setSearchQuery(value)
  }

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

  // Fungsi untuk menampilkan Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  // Fungsi untuk menutup Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: { xs: '16px', sm: '24px', md: '32px' } }}>
        {/* Snackbar untuk menampilkan pesan error atau informasi */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              fontWeight: 500,
              bgcolor: snackbar.severity === 'error' ? '#ffebee' : snackbar.severity === 'warning' ? '#fff3e0' : '#e8f5e9'
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Welcome Card + Stats Cards Container */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Welcome Card (Total Kas Desa) */}
          <StyledCard variant="blue">
            <ContentWrapper>
              <Box>
                <Typography variant="h3" component="div" sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2.5rem' },
                  mb: 2
                }}>
                  Selamat Datang di Sistem Bendahara
                </Typography>
                <Typography variant="body1" sx={{
                  fontWeight: 400,
                  opacity: 0.8,
                  mb: 4
                }}>
                  Kelola keuangan desa dengan lebih mudah dan efisien
                </Typography>
                <Typography variant="body2" sx={{
                  fontSize: '100%',
                  opacity: 0.9
                }}>
                  Total Kas Desa
                </Typography>
                <Typography variant="h4" component="div" sx={{
                  fontWeight: 700,
                  mt: 1
                }}>
                  {loading ? 'Memuat...' : formatCurrency(totalSaldo)}
                </Typography>
              </Box>
            </ContentWrapper>
            <IconWrapper>
              <AccountBalanceWalletIcon sx={{ fontSize: '180px' }} />
            </IconWrapper>
          </StyledCard>

          {/* Stats Cards - Rata Kiri Kanan */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 3,
            flexWrap: 'wrap'
          }}>
            {/* Total Pemasukan - Rata Kiri */}
            <Box sx={{
              flex: 1,
              minWidth: { xs: '100%', sm: '48%', md: '48%' }
            }}>
              <StyledCard variant="green">
                <ContentWrapper>
                  <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                    Total Pemasukan
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {loading ? 'Memuat...' : formatCurrency(totalPemasukan)}
                  </Typography>
                </ContentWrapper>
                <IconWrapper>
                  <TrendingUpIcon sx={{ fontSize: '120px' }} />
                </IconWrapper>
              </StyledCard>
            </Box>

            {/* Total Pengeluaran - Rata Kanan */}
            <Box sx={{
              flex: 1,
              minWidth: { xs: '100%', sm: '48%', md: '48%' }
            }}>
              <StyledCard variant="red">
                <ContentWrapper>
                  <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                    Total Pengeluaran
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {loading ? 'Memuat...' : formatCurrency(totalPengeluaran)}
                  </Typography>
                </ContentWrapper>
                <IconWrapper>
                  <TrendingDownIcon sx={{ fontSize: '120px' }} />
                </IconWrapper>
              </StyledCard>
            </Box>
          </Box>
        </Box>

        {/* History Section */}
        <HistoryCard>
          <CardHeader
            title={
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Transaksi Terakhir
              </Typography>
            }
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
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                        <AccountBalanceIcon style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                        <Typography variant="body1" color="textSecondary">
                          {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data transaksi'}
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item, index) => (
                      <tr key={index} style={{
                        borderBottom: '1px solid #eee',
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                      }}>
                        <td style={{ padding: '16px' }}>{item.tanggal}</td>
                        <td style={{ padding: '16px' }}>{item.keterangan}</td>
                        <td style={{ padding: '16px' }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              bgcolor: item.jenis_transaksi === 'Pemasukan' ? '#e8f5e9' : '#ffebee',
                              color: item.jenis_transaksi === 'Pemasukan' ? '#2e7d32' : '#d32f2f',
                              fontWeight: 500
                            }}
                          >
                            {item.jenis_transaksi === 'Pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                          </Box>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: item.jenis_transaksi === 'Pemasukan' ? '#2e7d32' : '#d32f2f',
                          fontWeight: 600
                        }}>
                          {item.jenis_transaksi === 'Pemasukan'
                            ? `+ ${formatCurrency(item.nominal)}`
                            : `- ${formatCurrency(item.nominal)}`
                          }
                        </td>
                      </tr>
                    ))
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
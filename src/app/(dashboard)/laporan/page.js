'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Container,
  Grid,
  Fade,
  Grow,
  styled,
  keyframes,
  CircularProgress,
  IconButton,
  CardContent,
  TextField,
  InputAdornment
} from '@mui/material'
import { 
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { colors } from '@/styles/colors'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { laporanService } from '@/services/laporanService'
import { pemasukanService } from '@/services/pemasukanService'
import { pengeluaranService } from '@/services/pengeluaranService'
import { transaksiService } from '@/services/transaksiService'

// Animations and styled components remain the same as your original code
const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const AnimatedContainer = styled(Container)`
  animation: ${fadeIn} 0.5s ease-out;
`;

const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const StyledCard = styled(Card)(({ theme, variant, delay = 0 }) => ({
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? variant === 'income'
      ? 'linear-gradient(135deg, #2196F3 30%, #64B5F6 100%)'
      : variant === 'expense'
      ? 'linear-gradient(135deg, #1E88E5 30%, #42A5F5 100%)'
      : 'linear-gradient(135deg, #1976D2 30%, #2196F3 100%)'
    : variant === 'income'
      ? 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)'
      : variant === 'expense'
      ? 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)'
      : 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  color: '#ffffff',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 16px rgba(0,0,0,0.4)'
    : '0 8px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  animation: `${slideUp} 0.5s ease-out ${delay}s both`,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 20px rgba(0,0,0,0.6)'
      : '0 12px 20px rgba(0,0,0,0.15)',
  },
  '& .MuiTypography-root': {
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  }
}));

const IconWrapper = styled(Box)({
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.2,
  fontSize: 48,
});

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
  '& .MuiTable-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableRow-root': {
        backgroundColor: '#f8f9fa',
        '& .MuiTableCell-root': {
          color: '#1976D2',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          borderBottom: '2px solid #1976D2',
          padding: '16px'
        }
      }
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          transform: 'scale(1.01)',
          transition: 'all 0.2s'
        },
        '& .MuiTableCell-root': {
          padding: '16px',
          borderBottom: '1px solid rgba(224, 224, 224, 0.8)'
        }
      }
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 24px',
  background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
  },
}));

export default function LaporanKeuangan() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [refreshKey, setRefreshKey] = useState(0)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  useEffect(() => {
    const filtered = data.filter(item => 
      item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tanggal?.includes(searchQuery)
    )
    setFilteredData(filtered)
  }, [searchQuery, data])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get all reports data
      const laporanData = await laporanService.getAllLaporan()
      console.log('Laporan data:', laporanData)
      
      // Get transaction history
      const transaksiData = await transaksiService.getAllTransaksi()
      console.log('Transaction data:', transaksiData)
      
      // Combine data if needed or use whichever is appropriate
      setData(laporanData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Gagal mengambil data laporan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number)
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4')
      
      doc.setFontSize(16)
      doc.text('Laporan Keuangan Desa', 14, 15)
      doc.setFontSize(12)
      doc.text('Periode: Januari 2024', 14, 25)

      doc.setFontSize(12)
      doc.text(`Total Pemasukan: ${formatRupiah(totalPemasukan)}`, 14, 35)
      doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, 42)
      doc.text(`Saldo Akhir: ${formatRupiah(saldoAkhir)}`, 14, 49)
      
      const tableData = data.map(row => [
        row.tanggal,
        row.keterangan,
        formatRupiah(row.pemasukan || 0),
        formatRupiah(row.pengeluaran || 0),
        formatRupiah(row.total_saldo || 0)
      ])

      const tableColumns = ['Tanggal', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo']

      autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 60,
        styles: { 
          fontSize: 10,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' },
          4: { cellWidth: 40, halign: 'right' }
        },
        headStyles: { 
          fillColor: [63, 81, 181],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        }
      })
      
      doc.save('laporan-keuangan.pdf')
      handleClose()
    } catch (error) {
      console.error('Error generating PDF:', error)
      setAlert({
        open: true,
        message: 'Terjadi kesalahan saat membuat PDF',
        severity: 'error'
      })
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(row => ({
      Tanggal: row.tanggal,
      Keterangan: row.keterangan,
      Pemasukan: row.pemasukan,
      Pengeluaran: row.pengeluaran,
      Saldo: row.total_saldo
    })))
    
    const colWidths = [
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ]
    ws['!cols'] = colWidths
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan')
    XLSX.writeFile(wb, 'laporan-keuangan.xlsx')
    handleClose()
  }

  const refreshData = () => {
    setRefreshKey(oldKey => oldKey + 1)
  }

  const handleDelete = async (id, jenis) => {
    if (!id || !jenis) {
      setAlert({
        open: true,
        message: 'Data tidak valid untuk dihapus',
        severity: 'error'
      })
      return
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${jenis} ini?`)) {
      return
    }

    try {
      setLoading(true)
      
      // Call the appropriate service based on transaction type
      if (jenis === 'pemasukan') {
        await pemasukanService.deletePemasukan(id)
      } else if (jenis === 'pengeluaran') {
        await pengeluaranService.deletePengeluaran(id)
      } else {
        throw new Error('Jenis transaksi tidak valid')
      }
      
      // Refresh the data
      const updatedData = await laporanService.getAllLaporan()
      setData(updatedData)
      
      setAlert({
        open: true,
        message: 'Data berhasil dihapus',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error deleting data:', error)
      setAlert({
        open: true,
        message: `Gagal menghapus data: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totalPemasukan = data.reduce((sum, item) => sum + (item.pemasukan || 0), 0)
  const totalPengeluaran = data.reduce((sum, item) => sum + (item.pengeluaran || 0), 0)
  const saldoAkhir = data.length > 0 ? data[0].total_saldo : 0

  return (
    <AnimatedContainer maxWidth="lg" sx={{ 
      mt: 4, 
      mb: 4,
      backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <div>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <AnimatedTypography 
              variant="h4" 
              sx={{
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#42A5F5' : '#1976D2',
                textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Laporan Keuangan
            </AnimatedTypography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: 'background.paper'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="outlined"
                onClick={refreshData}
                fullWidth={false}
                sx={{ 
                  borderRadius: '12px',
                  minWidth: { xs: '100%', sm: '120px' }
                }}
              >
                Refresh Data
              </Button>
              <StyledButton
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleClick}
                fullWidth={false}
                sx={{ 
                  minWidth: { xs: '100%', sm: '160px' }
                }}
              >
                Unduh Laporan
              </StyledButton>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <StyledCard variant="income" delay={0.2} sx={{
                p: { xs: 2, sm: 3 },
                minHeight: { xs: '120px', sm: '140px' }
              }}>
                <IconWrapper>
                  <TrendingUpIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                </IconWrapper>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1, 
                  opacity: 0.8, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Total Pemasukan
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                  {formatRupiah(totalPemasukan)}
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledCard variant="expense" delay={0.4} sx={{
                p: { xs: 2, sm: 3 },
                minHeight: { xs: '120px', sm: '140px' }
              }}>
                <IconWrapper>
                  <TrendingDownIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                </IconWrapper>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1, 
                  opacity: 0.8, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Total Pengeluaran
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                  {formatRupiah(totalPengeluaran)}
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledCard delay={0.6} sx={{
                p: { xs: 2, sm: 3 },
                minHeight: { xs: '120px', sm: '140px' }
              }}>
                <IconWrapper>
                  <AccountBalanceIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                </IconWrapper>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1, 
                  opacity: 0.8, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Saldo Akhir
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600, 
                  position: 'relative', 
                  zIndex: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                  {formatRupiah(saldoAkhir)}
                </Typography>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Export Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ 
              '& .MuiPaper-root': {
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                minWidth: { xs: '200px', sm: '250px' }
              },
            }}
          >
            <MenuItem onClick={generatePDF} sx={{ py: { xs: 1.5, sm: 1 } }}>
              <PdfIcon sx={{ mr: 1, color: '#f44336' }} /> Unduh PDF
            </MenuItem>
            <MenuItem onClick={exportToExcel} sx={{ py: { xs: 1.5, sm: 1 } }}>
              <ExcelIcon sx={{ mr: 1, color: '#4CAF50' }} /> Unduh Excel
            </MenuItem>
          </Menu>

          {/* Desktop Table View */}
          <StyledCard sx={{ 
            p: 0,
            background: 'white',
            color: 'inherit',
            display: { xs: 'none', md: 'block' }
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                p: 2,
                borderRadius: '8px 8px 0 0',
                fontWeight: 500
              }}>
                Kelola data keuangan desa dengan mudah
              </Box>
              <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Keterangan</TableCell>
                      <TableCell align='right'>Nominal</TableCell>
                      <TableCell align='right'>Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                          <Typography variant="body1" color="textSecondary">
                            {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data transaksi'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: '#f8f9fa',
                              '& .action-buttons': {
                                opacity: 1
                              }
                            }
                          }}
                        >
                          <TableCell>{row.tanggal}</TableCell>
                          <TableCell sx={{ 
                            maxWidth: { md: '300px' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{row.keterangan}</TableCell>
                          <TableCell
                            align='right' 
                            sx={{ 
                              color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f',
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {row.pemasukan > 0 
                              ? `+ ${formatRupiah(row.pemasukan)}`
                              : `- ${formatRupiah(row.pengeluaran)}`
                            }
                          </TableCell>
                          <TableCell align='right' sx={{ 
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}>
                            {formatRupiah(row.total_saldo)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </StyledCard>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {filteredData.map((row, index) => (
              <Card 
                key={index}
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'visible',
                  bgcolor: 'background.paper'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Tanggal
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {row.tanggal}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Kategori
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {row.kategori}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Keterangan
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {row.keterangan}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Nominal
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f'
                      }}
                    >
                      {row.pemasukan > 0 
                        ? `+ ${formatRupiah(row.pemasukan)}`
                        : `- ${formatRupiah(row.pengeluaran)}`
                      }
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Saldo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatRupiah(row.total_saldo)}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 2,
                    mt: 2
                  }}>
                    <IconButton
                      onClick={() => handleDelete(
                        row.id_pemasukan || row.id_pengeluaran,
                        row.pemasukan > 0 ? 'pemasukan' : 'pengeluaran'
                      )}
                      color="error"
                      sx={{
                        width: '40px',
                        height: '40px',
                        '&:hover': {
                          bgcolor: 'error.lighter'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: 'background.paper',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data transaksi'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Mobile Info Message */}
          <Box sx={{ 
            display: { xs: 'block', md: 'none' }, 
            mt: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              * Tampilan mobile menampilkan data dalam bentuk kartu untuk kemudahan membaca.
            </Typography>
          </Box>
        </div>
      )}
    </AnimatedContainer>
  )
}
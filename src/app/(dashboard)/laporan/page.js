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
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material'
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { laporanService } from '@/services/laporanService'
import { pemasukanService } from '@/services/pemasukanService'
import { pengeluaranService } from '@/services/pengeluaranService'

// Animasi dan styled components
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: '#1976D2',
    },
  },
}));

export default function LaporanKeuangan() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [timeRange, setTimeRange] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [saldoAkhir, setSaldoAkhir] = useState(0)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })
  const open = Boolean(anchorEl)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoadingSummary(true)
        const [pemasukan, pengeluaran, saldo] = await Promise.all([
          laporanService.getTotalPemasukan(),
          laporanService.getTotalPengeluaran(),
          laporanService.getSaldo()
        ])
        setTotalPemasukan(Number.isFinite(pemasukan) ? pemasukan : 0)
        setTotalPengeluaran(Number.isFinite(pengeluaran) ? pengeluaran : 0)
        setSaldoAkhir(Number.isFinite(saldo) ? saldo : 0)
      } catch (error) {
        console.error('Error fetching summary:', error)
        setAlert({
          open: true,
          message: 'Gagal memuat ringkasan keuangan',
          severity: 'error'
        })
        setTotalPemasukan(0)
        setTotalPengeluaran(0)
        setSaldoAkhir(0)
      } finally {
        setIsLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [])

  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-'
    try {
      const [datePart, timePart] = backendDateString.split(' ')
      const [day, month, year] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return new Date(year, month - 1, day, hours, minutes).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      console.error('Error formatting date:', e)
      return backendDateString
    }
  }

  const getDateRange = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    switch (range) {
      case 'today':
        return { start: today, end: today }
      case 'yesterday':
        startDate.setDate(today.getDate() - 1)
        return { start: startDate, end: startDate }
      case '7days':
        startDate.setDate(today.getDate() - 7)
        return { start: startDate, end: today }
      case '1month':
        startDate.setMonth(today.getMonth() - 1)
        return { start: startDate, end: today }
      case '3months':
        startDate.setMonth(today.getMonth() - 3)
        return { start: startDate, end: today }
      case '6months':
        startDate.setMonth(today.getMonth() - 6)
        return { start: startDate, end: today }
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1)
        return { start: startDate, end: today }
      case 'all':
      default:
        return { start: null, end: null }
    }
  }

  const fetchDataByRange = async (range) => {
    try {
      setLoading(true)
      const { start, end } = getDateRange(range)
      let rangeData
      if (!start || !end) {
        rangeData = await laporanService.getAllLaporan()
      } else {
        const startDate = formatDate(start)
        const endDate = formatDate(end)
        rangeData = await laporanService.getLaporanByDateRange(startDate, endDate)
      }
      setData(rangeData)
      setFilteredData(rangeData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Gagal mengambil data laporan: ' + error.message)
      setData([])
      setFilteredData([])
      setAlert({
        open: true,
        message: 'Gagal memuat data laporan',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataByRange(timeRange)
  }, [timeRange])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const formatRupiah = (number) => {
    const validNumber = Number.isFinite(Number(number)) ? Number(number) : 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validNumber)
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4')
      doc.setFontSize(16)
      doc.text('Laporan Keuangan Desa', 14, 15)
      doc.setFontSize(12)
      const periodLabel = timeRangeOptions.find(opt => opt.value === timeRange)?.label || 'Semua'
      doc.text(`Periode: ${periodLabel}`, 14, 25)
      doc.text(`Total Pemasukan: ${formatRupiah(totalPemasukan)}`, 14, 35)
      doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, 42)
      doc.text(`Saldo Akhir: ${formatRupiah(saldoAkhir)}`, 14, 49)
      const tableData = filteredData.map(row => [
        formatDateTime(row.tanggal),
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
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
        Tanggal: formatDateTime(row.tanggal),
        Keterangan: row.keterangan,
        Pemasukan: row.pemasukan || 0,
        Pengeluaran: row.pengeluaran || 0,
        Saldo: row.total_saldo || 0
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
    } catch (error) {
      console.error('Error exporting Excel:', error)
      setAlert({
        open: true,
        message: 'Terjadi kesalahan saat membuat Excel',
        severity: 'error'
      })
    }
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
      if (jenis === 'pemasukan') {
        await pemasukanService.deletePemasukan(id)
      } else if (jenis === 'pengeluaran') {
        await pengeluaranService.deletePengeluaran(id)
      } else {
        throw new Error('Jenis transaksi tidak valid')
      }
      await fetchDataByRange(timeRange)
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

  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'all', label: 'Semua' }
  ]

  return (
    <AnimatedContainer maxWidth="lg" sx={{
      mt: 4,
      mb: 4,
      backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <Fade in={alert.open}>
        <Alert
          severity={alert.severity}
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Fade>

      {loading && isLoadingSummary ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <div>
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
              <StyledFormControl
                variant="outlined"
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: '250px' }
                }}
              >
                <InputLabel>Filter Periode</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Filter Periode"
                >
                  {timeRangeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <Button
                variant="outlined"
                onClick={() => fetchDataByRange(timeRange)}
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
                  {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPemasukan)}
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
                  {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPengeluaran)}
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
                  {isLoadingSummary ? 'Memuat...' : formatRupiah(saldoAkhir)}
                </Typography>
              </StyledCard>
            </Grid>
          </Grid>

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
                      <TableCell align='center'>Aksi</TableCell>
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
                            Tidak ada data untuk periode ini
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, index) => (
                        <TableRow
                          key={row.id_pemasukan || row.id_pengeluaran || index}
                          sx={{
                            '&:hover': {
                              bgcolor: '#f8f9fa',
                              '& .action-buttons': {
                                opacity: 1
                              }
                            }
                          }}
                        >
                          <TableCell>{formatDateTime(row.tanggal)}</TableCell>
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
                          <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                            <IconButton
                              onClick={() => handleDelete(
                                row.id_pemasukan || row.id_pengeluaran,
                                row.pemasukan > 0 ? 'pemasukan' : 'pengeluaran'
                              )}
                              color="error"
                              sx={{
                                opacity: 0.7,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  opacity: 1,
                                  backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </StyledCard>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {filteredData.map((row, index) => (
              <Card
                key={row.id_pemasukan || row.id_pengeluaran || index}
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
                      {formatDateTime(row.tanggal)}
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
                  Tidak ada data untuk periode ini
                </Typography>
              </Box>
            )}
          </Box>

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
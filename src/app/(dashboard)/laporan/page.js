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
  keyframes
} from '@mui/material'
import { 
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material'
import { colors } from '@/styles/colors'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Data dummy untuk contoh
const dummyData = [
  { tanggal: '2024-01-01', keterangan: 'Pemasukan Dana Desa', debit: 50000000, kredit: 0, saldo: 50000000 },
  { tanggal: '2024-01-05', keterangan: 'Pembayaran ATK', debit: 0, kredit: 500000, saldo: 49500000 },
  { tanggal: '2024-01-10', keterangan: 'Pembangunan Jalan', debit: 0, kredit: 25000000, saldo: 24500000 },
  { tanggal: '2024-01-15', keterangan: 'Dana Bantuan', debit: 30000000, kredit: 0, saldo: 54500000 },
]

// Animasi keyframes
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

// Styled Components
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
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 12px rgba(0,0,0,0.3)'
    : '0 8px 16px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#ffffff',
  animation: `${slideUp} 0.8s ease-out 0.6s both`,
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#f8f9fa',
    '& .MuiTableCell-head': {
      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1976D2',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      borderBottom: `2px solid ${theme.palette.mode === 'dark' ? '#90CAF9' : '#1976D2'}`,
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      opacity: 0,
      animation: `${fadeIn} 0.5s ease-out forwards`,
      '&:nth-of-type(1)': { animationDelay: '0.8s' },
      '&:nth-of-type(2)': { animationDelay: '0.9s' },
      '&:nth-of-type(3)': { animationDelay: '1.0s' },
      '&:nth-of-type(4)': { animationDelay: '1.1s' },
      '&:nth-of-type(5)': { animationDelay: '1.2s' },
      transition: 'background-color 0.3s ease, transform 0.3s ease',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 118, 210, 0.04)',
        transform: 'scale(1.01)',
      },
      '& .MuiTableCell-root': {
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(224, 224, 224, 0.8)'}`,
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
        transition: 'color 0.3s ease',
      },
    },
  },
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
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Format angka ke format rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number)
  }

  // Fungsi untuk generate PDF
  const generatePDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4') // Landscape orientation
      
      // Judul
      doc.setFontSize(16)
      doc.text('Laporan Keuangan Desa', 14, 15)
      doc.setFontSize(12)
      doc.text('Periode: Januari 2024', 14, 25)

      // Ringkasan
      doc.setFontSize(12)
      doc.text(`Total Pemasukan: ${formatRupiah(totalPemasukan)}`, 14, 35)
      doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, 42)
      doc.text(`Saldo Akhir: ${formatRupiah(saldoAkhir)}`, 14, 49)
      
      // Tabel
      const tableData = dummyData.map(row => [
        row.tanggal,
        row.keterangan,
        formatRupiah(row.debit),
        formatRupiah(row.kredit),
        formatRupiah(row.saldo)
      ])

      const tableColumns = ['Tanggal', 'Keterangan', 'Debit', 'Kredit', 'Saldo']

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
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.')
    }
  }

  // Fungsi untuk print
  const handlePrint = () => {
    const printContent = document.getElementById('print-content')
    const originalContents = document.body.innerHTML
    
    document.body.innerHTML = printContent.innerHTML
    
    window.print()
    
    document.body.innerHTML = originalContents
    handleClose()
    window.location.reload() // Reload halaman setelah print
  }

  // Fungsi untuk export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dummyData.map(row => ({
      Tanggal: row.tanggal,
      Keterangan: row.keterangan,
      Debit: row.debit,
      Kredit: row.kredit,
      Saldo: row.saldo
    })))
    
    // Set lebar kolom
    const colWidths = [
      { wch: 12 }, // Tanggal
      { wch: 30 }, // Keterangan
      { wch: 15 }, // Debit
      { wch: 15 }, // Kredit
      { wch: 15 }  // Saldo
    ]
    ws['!cols'] = colWidths
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan')
    XLSX.writeFile(wb, 'laporan-keuangan.xlsx')
    handleClose()
  }

  // Hitung total
  const totalPemasukan = dummyData.reduce((sum, item) => sum + item.debit, 0)
  const totalPengeluaran = dummyData.reduce((sum, item) => sum + item.kredit, 0)
  const saldoAkhir = totalPemasukan - totalPengeluaran

  return (
    <AnimatedContainer maxWidth="lg" sx={{ 
      mt: 4, 
      mb: 4,
      backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div id="print-content">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <AnimatedTypography 
            variant="h4" 
            sx={{
              fontWeight: 600,
              color: theme => theme.palette.mode === 'dark' ? '#42A5F5' : '#1976D2',
              textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            Laporan Keuangan
          </AnimatedTypography>
          <StyledButton
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleClick}
            sx={{ '@media print': { display: 'none' } }}
          >
            Unduh Laporan
          </StyledButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ 
              '@media print': { display: 'none' },
              '& .MuiPaper-root': {
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem onClick={generatePDF}>
              <PdfIcon sx={{ mr: 1, color: '#f44336' }} /> Unduh PDF
            </MenuItem>
            <MenuItem onClick={exportToExcel}>
              <ExcelIcon sx={{ mr: 1, color: '#4CAF50' }} /> Unduh Excel
            </MenuItem>
            <MenuItem onClick={handlePrint}>
              <PrintIcon sx={{ mr: 1, color: '#2196F3' }} /> Cetak
            </MenuItem>
          </Menu>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <StyledCard variant="income" delay={0.2}>
              <IconWrapper>
                <TrendingUpIcon sx={{ fontSize: 48 }} />
              </IconWrapper>
              <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1 }}>
                Total Pemasukan
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
                {formatRupiah(totalPemasukan)}
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard variant="expense" delay={0.4}>
              <IconWrapper>
                <TrendingDownIcon sx={{ fontSize: 48 }} />
              </IconWrapper>
              <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1 }}>
                Total Pengeluaran
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
                {formatRupiah(totalPengeluaran)}
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard delay={0.6}>
              <IconWrapper>
                <AccountBalanceIcon sx={{ fontSize: 48 }} />
              </IconWrapper>
              <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1 }}>
                Saldo Akhir
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
                {formatRupiah(saldoAkhir)}
              </Typography>
            </StyledCard>
          </Grid>
        </Grid>

        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tanggal</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Kredit</TableCell>
                <TableCell align="right">Saldo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.tanggal}</TableCell>
                  <TableCell>{row.keterangan}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: theme => row.debit > 0 
                        ? theme.palette.mode === 'dark' ? '#FFFFFF' : '#1976D2'
                        : theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      fontWeight: row.debit > 0 ? 600 : 400
                    }}
                  >
                    {formatRupiah(row.debit)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: theme => row.kredit > 0 
                        ? theme.palette.mode === 'dark' ? '#FFFFFF' : '#1976D2'
                        : theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      fontWeight: row.kredit > 0 ? 600 : 400
                    }}
                  >
                    {formatRupiah(row.kredit)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#1976D2',
                      fontWeight: 600 
                    }}
                  >
                    {formatRupiah(row.saldo)}
                  </TableCell>
                </TableRow>
              ))}
              {dummyData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="textSecondary">
                      Belum ada data transaksi
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>
    </AnimatedContainer>
  )
}

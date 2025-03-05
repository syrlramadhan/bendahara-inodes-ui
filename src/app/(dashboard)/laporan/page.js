'use client'

import React, { useState } from 'react'
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
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Container
} from '@mui/material'
import { 
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon,
  FilterList as FilterIcon,
  Share as ShareIcon
} from '@mui/icons-material'
import { colors, shadows } from '@/styles/colors'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Data dummy untuk contoh
const dummyData = [
  { tanggal: '2024-01-01', keterangan: 'Pemasukan Dana Desa', debit: 50000000, kredit: 0, saldo: 50000000 },
  { tanggal: '2024-01-05', keterangan: 'Pembayaran ATK', debit: 0, kredit: 500000, saldo: 49500000 },
  { tanggal: '2024-01-10', keterangan: 'Pembangunan Jalan', debit: 0, kredit: 25000000, saldo: 24500000 },
  { tanggal: '2024-01-15', keterangan: 'Dana Bantuan', debit: 30000000, kredit: 0, saldo: 54500000 },
]

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
      currency: 'IDR'
    }).format(number)
  }

  // Fungsi untuk generate PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Judul
    doc.setFontSize(16)
    doc.text('Laporan Keuangan Desa', 14, 15)
    doc.setFontSize(12)
    doc.text('Periode: Januari 2024', 14, 25)
    
    // Tabel
    doc.autoTable({
      head: [['Tanggal', 'Keterangan', 'Debit', 'Kredit', 'Saldo']],
      body: dummyData.map(row => [
        row.tanggal,
        row.keterangan,
        formatRupiah(row.debit),
        formatRupiah(row.kredit),
        formatRupiah(row.saldo)
      ]),
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] }
    })
    
    doc.save('laporan-keuangan.pdf')
    handleClose()
  }

  // Fungsi untuk print
  const handlePrint = () => {
    window.print()
    handleClose()
  }

  // Fungsi untuk export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dummyData)
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Laporan Keuangan
        </Typography>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleClick}
        >
          Unduh Laporan
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={generatePDF}>
            <PdfIcon sx={{ mr: 1 }} /> Unduh PDF
          </MenuItem>
          <MenuItem onClick={exportToExcel}>
            <ExcelIcon sx={{ mr: 1 }} /> Unduh Excel
          </MenuItem>
          <MenuItem onClick={handlePrint}>
            <PrintIcon sx={{ mr: 1 }} /> Cetak
          </MenuItem>
        </Menu>
      </Box>

      {/* Kartu ringkasan */}
      <Box display="flex" gap={2} mb={3}>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Total Pemasukan</Typography>
          <Typography variant="h4" color="success.main">
            {formatRupiah(totalPemasukan)}
          </Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Total Pengeluaran</Typography>
          <Typography variant="h4" color="error.main">
            {formatRupiah(totalPengeluaran)}
          </Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Saldo Akhir</Typography>
          <Typography variant="h4" color="primary.main">
            {formatRupiah(saldoAkhir)}
          </Typography>
        </Card>
      </Box>

      {/* Tabel transaksi */}
      <TableContainer component={Paper}>
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
                <TableCell align="right">{formatRupiah(row.debit)}</TableCell>
                <TableCell align="right">{formatRupiah(row.kredit)}</TableCell>
                <TableCell align="right">{formatRupiah(row.saldo)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
} 
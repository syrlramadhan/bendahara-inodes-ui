'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton
} from '@mui/material'
import { Card } from '@/components/ui/card'
import { colors } from '@/styles/colors'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PrintIcon from '@mui/icons-material/Print'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

const bulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const tahun = [2024, 2023, 2022]

export default function Laporan() {
  const [filter, setFilter] = useState({
    bulan: '',
    tahun: 2024,
    jenis: 'semua'
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleExport = (format) => {
    // Implementasi export ke berbagai format
    console.log(`Exporting to ${format}...`)
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary }}>
          Laporan Keuangan
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => handleExport('excel')}
            sx={{ 
              bgcolor: colors.success.light,
              color: colors.success.dark,
              '&:hover': {
                bgcolor: colors.success.main,
                color: 'white'
              }
            }}
          >
            <FileDownloadIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleExport('pdf')}
            sx={{ 
              bgcolor: colors.error.light,
              color: colors.error.dark,
              '&:hover': {
                bgcolor: colors.error.main,
                color: 'white'
              }
            }}
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleExport('print')}
            sx={{ 
              bgcolor: colors.primary.light,
              color: colors.primary.dark,
              '&:hover': {
                bgcolor: colors.primary.main,
                color: 'white'
              }
            }}
          >
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Filter Laporan
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Bulan"
                name="bulan"
                value={filter.bulan}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Semua Bulan</MenuItem>
                {bulan.map((b) => (
                  <MenuItem key={b} value={b.toLowerCase()}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Tahun"
                name="tahun"
                value={filter.tahun}
                onChange={handleFilterChange}
              >
                {tahun.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Jenis Transaksi"
                name="jenis"
                value={filter.jenis}
                onChange={handleFilterChange}
              >
                <MenuItem value="semua">Semua Transaksi</MenuItem>
                <MenuItem value="masuk">Pemasukan</MenuItem>
                <MenuItem value="keluar">Pengeluaran</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Hasil Laporan
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Keterangan</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Kategori</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pemasukan</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pengeluaran</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <td style={{ padding: '12px 16px' }}>2024-02-20</td>
                  <td style={{ padding: '12px 16px' }}>Pemasukan dari Pajak</td>
                  <td style={{ padding: '12px 16px' }}>Pajak</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.success.main }}>
                    Rp 5.000.000
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                    Rp 5.000.000
                  </td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <td style={{ padding: '12px 16px' }}>2024-02-19</td>
                  <td style={{ padding: '12px 16px' }}>Pembayaran Listrik</td>
                  <td style={{ padding: '12px 16px' }}>Utilitas</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.error.main }}>
                    Rp 500.000
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                    Rp 4.500.000
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `2px solid ${colors.divider}` }}>
                  <td colSpan={3} style={{ padding: '12px 16px', fontWeight: 600 }}>
                    Total
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: colors.success.main }}>
                    Rp 5.000.000
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: colors.error.main }}>
                    Rp 500.000
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                    Rp 4.500.000
                  </td>
                </tr>
              </tfoot>
            </table>
          </Box>
        </Box>
      </Card>
    </Box>
  )
} 
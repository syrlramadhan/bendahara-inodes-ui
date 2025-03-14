'use client'

import { Box, Typography, Grid, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { StatsCard } from '@/components/dashboard/stats-card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { colors } from '@/styles/colors'

// Dummy data untuk testing
const transaksiTerakhir = [
  {
    id: 1,
    tanggal: '2024-02-20',
    keterangan: 'Pemasukan dari Pajak Desa',
    jenis: 'masuk',
    jumlah: 5000000
  },
  {
    id: 2,
    tanggal: '2024-02-19',
    keterangan: 'Pembayaran Listrik Kantor',
    jenis: 'keluar',
    jumlah: 500000
  },
  {
    id: 3,
    tanggal: '2024-02-18',
    keterangan: 'Dana Bantuan Provinsi',
    jenis: 'masuk',
    jumlah: 10000000
  }
]

export default function KasDesa() {
  return (
    <Box sx={{ padding: { xs: '16px', sm: '32px' } }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: colors.text.primary }}>
        Kas Desa
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Kas"
            value="Rp 50.000.000"
            icon={<AccountBalanceWalletIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Pemasukan"
            value="Rp 15.000.000"
            icon={<TrendingUpIcon />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Pengeluaran"
            value="Rp 500.000"
            icon={<TrendingDownIcon />}
            trend="down"
          />
        </Grid>
      </Grid>

      {/* Transaksi Terakhir Table */}
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Transaksi Terakhir
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal</TableCell>
                <TableCell sx={{ padding: '12px 16px', textAlign: 'left' }}>Keterangan</TableCell>
                <TableCell sx={{ padding: '12px 16px', textAlign: 'left' }}>Jenis</TableCell>
                <TableCell sx={{ padding: '12px 16px', textAlign: 'right' }}>Jumlah</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {transaksiTerakhir.map((transaksi) => (
              <TableRow key={transaksi.id}>
                <TableCell sx={{ padding: '12px 16px' }}>{transaksi.tanggal}</TableCell>
                <TableCell sx={{ padding: '12px 16px' }}>{transaksi.keterangan}</TableCell>
                <TableCell sx={{ padding: '12px 16px' }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: '6px',
                      bgcolor: transaksi.jenis === 'masuk' ? colors.success.light : colors.error.light,
                      color: 'black', // Set color to black for both Pemasukan and Pengeluaran
                    }}
                  >
                    {transaksi.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    color: transaksi.jenis === 'masuk' ? colors.success.main : colors.error.main,
                    fontWeight: 600
                  }}
                >
                  {transaksi.jenis === 'masuk' ? '+' : '-'} Rp {transaksi.jumlah.toLocaleString('id-ID')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

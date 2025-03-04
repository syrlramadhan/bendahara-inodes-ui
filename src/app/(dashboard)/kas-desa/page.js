'use client'

import { Box, Typography, Grid } from '@mui/material'
import { StatsCard } from '@/components/dashboard/stats-card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { Card } from '@/components/ui/card'
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
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: colors.text.primary }}>
        Kas Desa
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Kas"
            value="Rp 50.000.000"
            icon={<AccountBalanceWalletIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Pemasukan"
            value="Rp 15.000.000"
            icon={<TrendingUpIcon />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Pengeluaran"
            value="Rp 500.000"
            icon={<TrendingDownIcon />}
            trend="down"
          />
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Transaksi Terakhir
          </Typography>
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
                {transaksiTerakhir.map((transaksi) => (
                  <tr 
                    key={transaksi.id}
                    style={{ borderBottom: `1px solid ${colors.divider}` }}
                  >
                    <td style={{ padding: '12px 16px' }}>{transaksi.tanggal}</td>
                    <td style={{ padding: '12px 16px' }}>{transaksi.keterangan}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '6px',
                          bgcolor: transaksi.jenis === 'masuk' ? colors.success.light : colors.error.light,
                          color: transaksi.jenis === 'masuk' ? colors.success.dark : colors.error.dark,
                        }}
                      >
                        {transaksi.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                      </Box>
                    </td>
                    <td 
                      style={{ 
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: transaksi.jenis === 'masuk' ? colors.success.main : colors.error.main,
                        fontWeight: 600
                      }}
                    >
                      {transaksi.jenis === 'masuk' ? '+' : '-'} Rp {transaksi.jumlah.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Card>
    </Box>
  )
} 
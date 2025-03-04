'use client'

import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { colors } from '@/styles/colors'
import SearchHistory from '@/components/dashboard/search-history'
import Card3 from '@/components/ui/Card3D'

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ATM Card Section */}
      {/* <Box sx={{ mb: 4 }}>
        <Card variant="gradient">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ mb: 2, letterSpacing: 4, fontSize: '2rem', fontWeight: 600 }}>
                  3808 0103 1645 533
                </Typography>
              </Box>
              <Box
                component="img"
                src="/bri-logo.png"
                alt="BRI Logo"
                sx={{
                  width: 60,
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>Card Holder</Typography>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Nabila Ismail Matta</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Expires</Typography>
                <Typography>11/22</Typography>
              </Box>
              <Box
                component="img"
                src="/chip.png"
                alt="Chip"
                sx={{
                  width: 50,
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Box>
          </Box>
        </Card>
      </Box> */}
      <Card3 />

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
        <StatsCard
          title="Uang Kas"
          value="Rp 2.000.000"
          trend="up"
        />
        <StatsCard
          title="Total Uang Masuk"
          value="Rp 500.000"
          trend="up"
        />
        <StatsCard
          title="Total Uang Keluar"
          value="Rp 300.000"
          trend="down"
        />
      </Box>

      {/* History Section */}
      <Card>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              History Sumbangan
            </Typography>
            <SearchHistory placeholder="Cari history sumbangan..." />
          </Box>

          {/* Table content */}
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>No</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nama</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Angkatan</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nota</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Jumlah</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {/* Add table rows here */}
              </tbody>
            </table>
          </Box>
        </Box>
      </Card>
    </Box>
  )
} 
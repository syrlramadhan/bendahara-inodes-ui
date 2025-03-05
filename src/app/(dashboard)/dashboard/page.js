'use client'

import { Box, Typography, Grid } from '@mui/material'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SearchHistory from '@/components/dashboard/search-history'
import { colors } from '@/styles/colors'

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Purple Gradient Card */}
      <Card variant="purple-gradient">
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(150deg, #0284c7 0%, #0ea5e9 100%)',
          borderRadius: '16px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          },
          '&:hover::before': {
            opacity: 0.8,
          }
        }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              fontSize: '2.5rem',
              mb: 2,
              color: 'white'
            }}>
              Selamat Datang, Galang
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 400,
              opacity: 0.8,
              color: 'white'
            }}>
              Bendahara Desa Sukamaju
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ 
              fontSize: '1.1rem',
              opacity: 0.9,
              color: 'white'
            }}>
              Total Kas Desa
            </Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: 'white',
              mt: 1
            }}>
              Rp 50.000.000
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
        <StatsCard
          title="Uang Kas"
          value="Rp 2.000.000"
          trend="up"
          icon={<AccountBalanceWalletIcon />}
        />
        <StatsCard
          title="Total Uang Masuk"
          value="Rp 500.000"
          trend="up"
          icon={<TrendingUpIcon />}
        />
        <StatsCard
          title="Total Uang Keluar"
          value="Rp 300.000"
          trend="down"
          icon={<TrendingDownIcon />}
        />
      </Box>

      {/* History Section */}
      <Card>
        <CardHeader 
          title="History Transaksi"
          action={<SearchHistory placeholder="Cari transaksi..." />}
        />
        <CardBody>
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
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <td style={{ padding: '12px 16px' }}>2024-03-05</td>
                  <td style={{ padding: '12px 16px' }}>Pembayaran Listrik</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Box sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: '6px',
                      bgcolor: colors.error.light,
                      color: colors.error.dark,
                    }}>
                      Pengeluaran
                    </Box>
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'right',
                    color: colors.error.main,
                    fontWeight: 600
                  }}>
                    - Rp 500.000
                  </td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.divider}` }}>
                  <td style={{ padding: '12px 16px' }}>2024-03-04</td>
                  <td style={{ padding: '12px 16px' }}>Dana Desa</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Box sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: '6px',
                      bgcolor: colors.success.light,
                      color: colors.success.dark,
                    }}>
                      Pemasukan
                    </Box>
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'right',
                    color: colors.success.main,
                    fontWeight: 600
                  }}>
                    + Rp 2.000.000
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
} 
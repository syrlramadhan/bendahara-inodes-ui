'use client'

import { Box, Typography } from '@mui/material'
import { Card } from '@/components/ui/card'
import { colors } from '@/styles/colors'

export function StatsCard({ title, value, icon, trend = 'up', ...props }) {
  return (
    <Card variant="outlined" {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box 
          sx={{ 
            bgcolor: colors.primary.light,
            borderRadius: '12px',
            p: 1.5,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary.dark,
          }}
        >
          <Typography sx={{ fontSize: '1.5rem' }}>
            {icon}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>
          {title}
        </Typography>
      </Box>
      <Typography 
        color="text.secondary" 
        gutterBottom 
        sx={{ fontSize: '0.875rem' }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          color: trend === 'up' ? colors.primary.main : colors.error.main,
          fontWeight: 600 
        }}
      >
        {value}
      </Typography>
    </Card>
  )
} 
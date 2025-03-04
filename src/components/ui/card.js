'use client'

import { Card as MuiCard, CardContent } from '@mui/material'
import { shadows, gradients, colors } from '@/styles/colors'

export function Card({ children, variant = 'default', ...props }) {
  const getCardStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: gradients.primary,
          color: 'white',
          boxShadow: shadows.card,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'url("/card-pattern.png")',
            backgroundSize: 'cover',
            opacity: 0.1,
          }
        }
      case 'outlined':
        return {
          border: `1px solid ${colors.divider}`,
          boxShadow: 'none',
          background: gradients.card,
        }
      default:
        return {
          background: colors.background.card,
          boxShadow: shadows.card,
        }
    }
  }

  return (
    <MuiCard
      sx={{
        borderRadius: 2,
        ...getCardStyles(),
        ...props.sx
      }}
      {...props}
    >
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  )
} 
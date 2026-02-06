import type { CardProps } from '@mui/material'
import { Card as MuiCard, useTheme } from '@mui/material'

const Card = (props: CardProps) => {
  const theme = useTheme()
  return (
    <MuiCard
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(26,28,32,0.95), rgba(32,35,40,0.9))'
          : '#ffffff',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(138,180,248,0.12)' : '#e8eaed'}`,
      }}
      {...props}
    />
  )
}

export default Card

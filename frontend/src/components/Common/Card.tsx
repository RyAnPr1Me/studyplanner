import type { CardProps } from '@mui/material'
import { Card as MuiCard } from '@mui/material'

const Card = (props: CardProps) => <MuiCard elevation={2} {...props} />

export default Card

import { Chip, Stack, Typography } from '@mui/material'

interface SuggestionsProps {
  position?: 'sidebar' | 'floating'
}

const Suggestions = ({ position = 'sidebar' }: SuggestionsProps) => {
  const suggestions = ['Try a flashcard session', 'Review overdue tasks', 'Generate a new plan']

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Suggestions ({position})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {suggestions.map((suggestion) => (
          <Chip key={suggestion} label={suggestion} variant="outlined" />
        ))}
      </Stack>
    </Stack>
  )
}

export default Suggestions

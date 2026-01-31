import { Alert, Chip, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useAI } from '../../hooks/useAI'
import { getUserId } from '../../utils/user'

interface SuggestionsProps {
  position?: 'sidebar' | 'floating'
}

const Suggestions = ({ position = 'sidebar' }: SuggestionsProps) => {
  const { suggestions, loadSuggestions, error, isProcessing } = useAI()

  useEffect(() => {
    void loadSuggestions({ user_id: getUserId(), context: 'daily_plan' })
  }, [loadSuggestions])

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Suggestions ({position})
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {suggestions?.suggestions.map((suggestion) => (
          <Chip key={suggestion} label={suggestion} variant="outlined" />
        ))}
        {!suggestions && !isProcessing && (
          <Typography variant="body2" color="text.secondary">
            No suggestions available yet.
          </Typography>
        )}
        {isProcessing && (
          <Typography variant="body2" color="text.secondary">
            Loading suggestions...
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default Suggestions

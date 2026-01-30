import { Card, CardContent, Stack, Switch, TextField, Typography } from '@mui/material'

const Settings = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Settings</Typography>
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Preferences</Typography>
          <TextField label="Display name" defaultValue="Student" />
          <TextField label="Daily study hours" type="number" defaultValue={4} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Enable reminders</Typography>
            <Switch defaultChecked />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  </Stack>
)

export default Settings

import { Alert, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ToolEditor from '../components/Tools/ToolEditor'
import ToolGallery from '../components/Tools/ToolGallery'
import ToolRenderer from '../components/Tools/ToolRenderer'
import { useDynamicTool } from '../hooks/useDynamicTool'
import { getUserId } from '../utils/user'
import type { ToolGenerateRequest } from '../types/tool'

const ToolsPage = () => {
  const { tools, currentTool, loading, error, loadTools, loadTool, createTool, applyEdit } = useDynamicTool()
  const [toolType, setToolType] = useState('calculator')
  const [context, setContext] = useState('Quadratic equations')
  const [requirements, setRequirements] = useState('Calculator for solving quadratic equations with step-by-step solution')

  useEffect(() => {
    void loadTools(getUserId())
  }, [loadTools])

  const handleSelect = async (toolId: string) => {
    await loadTool(toolId)
  }

  const handleCreate = async () => {
    const payload: ToolGenerateRequest = {
      user_id: getUserId(),
      tool_type: toolType,
      context,
      requirements,
      ui_preferences: { theme: 'light', size: 'medium' },
    }
    const tool = await createTool(payload)
    if (tool) {
      await loadTools(getUserId())
    }
  }

  const handleEdit = async (instruction: string) => {
    if (!currentTool) {
      return
    }
    await applyEdit(currentTool.tool_id, instruction)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Tools</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={2}>
        <Typography variant="h6">Create Tool</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Tool type"
            value={toolType}
            onChange={(event) => setToolType(event.target.value)}
            fullWidth
          />
          <TextField label="Context" value={context} onChange={(event) => setContext(event.target.value)} fullWidth />
        </Stack>
        <TextField
          label="Requirements"
          value={requirements}
          onChange={(event) => setRequirements(event.target.value)}
          multiline
          minRows={2}
        />
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Generate Tool'}
        </Button>
      </Stack>
      <Divider />
      {tools && (
        <ToolGallery tools={tools.tools} onSelect={handleSelect} onCreate={handleCreate} />
      )}
      <Divider />
      {currentTool ? (
        <Stack spacing={2}>
          <Typography variant="h5">{currentTool.name}</Typography>
          <ToolRenderer code={currentTool.component_code} title="Generated component" />
          <ToolEditor onEdit={handleEdit} loading={loading} />
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Select a tool to preview and edit.
        </Typography>
      )}
    </Stack>
  )
}

export default ToolsPage

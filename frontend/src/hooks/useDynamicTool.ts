import { useCallback, useState } from 'react'
import type { Tool, ToolGenerateRequest, ToolListResponse } from '../types/tool'
import { editTool, fetchTool, fetchTools, generateTool } from '../store/api/toolApi'

export function useDynamicTool() {
  const [tools, setTools] = useState<ToolListResponse | null>(null)
  const [currentTool, setCurrentTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTools = useCallback(async (userId: string, type?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTools(userId, type)
      setTools(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTool = useCallback(async (toolId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTool(toolId)
      setCurrentTool(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tool')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createTool = useCallback(async (payload: ToolGenerateRequest) => {
    setLoading(true)
    setError(null)
    try {
      const tool = await generateTool(payload)
      setCurrentTool(tool)
      return tool
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tool')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const applyEdit = useCallback(async (toolId: string, instruction: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await editTool(toolId, { edit_instruction: instruction })
      if (currentTool && currentTool.tool_id === toolId) {
        setCurrentTool({ ...currentTool, component_code: response.updated_component_code })
      }
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit tool')
      return null
    } finally {
      setLoading(false)
    }
  }, [currentTool])

  return { tools, currentTool, loading, error, loadTools, loadTool, createTool, applyEdit }
}

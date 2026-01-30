import { useCallback, useState } from 'react'
import type { Tool } from '../types/tool'
import { fetchTools, generateTool } from '../store/api/toolApi'

export function useDynamicTool() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTools = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTools(userId)
      setTools(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createTool = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const tool = await generateTool(payload)
      setTools((prev) => [...prev, tool])
      return tool
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tool')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { tools, loading, error, loadTools, createTool }
}

import { useCallback, useState } from 'react'
import type { Tool } from '../types/tool'
import { fetchTools, generateTool } from '../store/api/toolApi'

export function useDynamicTool() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)

  const loadTools = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const data = await fetchTools(userId)
      setTools(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTool = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true)
    try {
      const tool = await generateTool(payload)
      setTools((prev) => [...prev, tool])
      return tool
    } finally {
      setLoading(false)
    }
  }, [])

  return { tools, loading, loadTools, createTool }
}

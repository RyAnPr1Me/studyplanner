import { useCallback, useState } from 'react'
import type { AIMessage, AISuggestionResponse } from '../types/ai'
import { fetchSuggestions, sendChatMessage } from '../store/api/aiApi'

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [suggestions, setSuggestions] = useState<AISuggestionResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (payload: { user_id: string; message: string; context?: Record<string, unknown> }) => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await sendChatMessage(payload)
      setMessages((prev) => [...prev, response])
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const loadSuggestions = useCallback(async (payload: { user_id: string; context: string; data?: Record<string, unknown> }) => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await fetchSuggestions(payload)
      setSuggestions(response)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions')
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return { messages, suggestions, isProcessing, error, sendMessage, loadSuggestions }
}

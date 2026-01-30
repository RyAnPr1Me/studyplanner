import { useCallback, useState } from 'react'
import type { AIMessage } from '../types/ai'
import { sendChatMessage } from '../store/api/aiApi'

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (payload: Record<string, unknown>) => {
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

  return { messages, isProcessing, error, sendMessage }
}

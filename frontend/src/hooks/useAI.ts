import { useCallback, useState } from 'react'
import type { AIMessage } from '../types/ai'
import { sendChatMessage } from '../store/api/aiApi'

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const sendMessage = useCallback(async (payload: Record<string, unknown>) => {
    setIsProcessing(true)
    try {
      const response = await sendChatMessage(payload)
      setMessages((prev) => [...prev, response])
      return response
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return { messages, isProcessing, sendMessage }
}

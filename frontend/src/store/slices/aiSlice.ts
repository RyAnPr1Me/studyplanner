import { createSlice } from '@reduxjs/toolkit'
import type { AIMessage, AISuggestion } from '../../types/ai'

interface AIState {
  chatHistory: AIMessage[]
  suggestions: AISuggestion[]
  isProcessing: boolean
}

const initialState: AIState = {
  chatHistory: [],
  suggestions: [],
  isProcessing: false,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setChatHistory(state, action) {
      state.chatHistory = action.payload
    },
    addMessage(state, action) {
      state.chatHistory.push(action.payload)
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload
    },
    setProcessing(state, action) {
      state.isProcessing = action.payload
    },
  },
})

export const { setChatHistory, addMessage, setSuggestions, setProcessing } = aiSlice.actions

export default aiSlice.reducer

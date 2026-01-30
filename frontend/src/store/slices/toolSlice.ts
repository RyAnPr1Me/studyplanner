import { createSlice } from '@reduxjs/toolkit'
import type { Tool } from '../../types/tool'

interface ToolsState {
  userTools: Tool[]
  activeTools: Tool[]
  currentTool: Tool | null
}

const initialState: ToolsState = {
  userTools: [],
  activeTools: [],
  currentTool: null,
}

const toolSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setUserTools(state, action) {
      state.userTools = action.payload
    },
    setActiveTools(state, action) {
      state.activeTools = action.payload
    },
    setCurrentTool(state, action) {
      state.currentTool = action.payload
    },
  },
})

export const { setUserTools, setActiveTools, setCurrentTool } = toolSlice.actions

export default toolSlice.reducer

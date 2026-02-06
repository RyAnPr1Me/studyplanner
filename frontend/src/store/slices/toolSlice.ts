import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
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
    setUserTools(state, action: PayloadAction<Tool[]>) {
      state.userTools = action.payload
    },
    setActiveTools(state, action: PayloadAction<Tool[]>) {
      state.activeTools = action.payload
    },
    setCurrentTool(state, action: PayloadAction<Tool | null>) {
      state.currentTool = action.payload
    },
  },
})

export const { setUserTools, setActiveTools, setCurrentTool } = toolSlice.actions

export default toolSlice.reducer

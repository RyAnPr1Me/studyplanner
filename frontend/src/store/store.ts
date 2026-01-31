import { configureStore } from '@reduxjs/toolkit'
import planReducer from './slices/planSlice'
import toolReducer from './slices/toolSlice'
import userReducer from './slices/userSlice'
import aiReducer from './slices/aiSlice'

export const store = configureStore({
  reducer: {
    plans: planReducer,
    tools: toolReducer,
    user: userReducer,
    ai: aiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

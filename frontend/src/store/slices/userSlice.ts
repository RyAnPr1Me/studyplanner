import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile, UserStats } from '../../types/user'

interface UserState {
  profile: UserProfile | null
  preferences: Record<string, unknown>
  stats: UserStats | null
}

const initialState: UserState = {
  profile: null,
  preferences: {},
  stats: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload
    },
    setPreferences(state, action: PayloadAction<Record<string, unknown>>) {
      state.preferences = action.payload
    },
    setStats(state, action: PayloadAction<UserStats | null>) {
      state.stats = action.payload
    },
  },
})

export const { setProfile, setPreferences, setStats } = userSlice.actions

export default userSlice.reducer

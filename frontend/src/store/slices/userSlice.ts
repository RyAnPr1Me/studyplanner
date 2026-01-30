import { createSlice } from '@reduxjs/toolkit'
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
    setProfile(state, action) {
      state.profile = action.payload
    },
    setPreferences(state, action) {
      state.preferences = action.payload
    },
    setStats(state, action) {
      state.stats = action.payload
    },
  },
})

export const { setProfile, setPreferences, setStats } = userSlice.actions

export default userSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import type { DailyPlan, Task, WeeklyPlan } from '../../types/plan'

interface PlansState {
  weekly: WeeklyPlan | null
  daily: DailyPlan | null
  tasks: Task[]
  loading: boolean
}

const initialState: PlansState = {
  weekly: null,
  daily: null,
  tasks: [],
  loading: false,
}

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setWeeklyPlan(state, action) {
      state.weekly = action.payload
    },
    setDailyPlan(state, action) {
      state.daily = action.payload
    },
    setTasks(state, action) {
      state.tasks = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setWeeklyPlan, setDailyPlan, setTasks, setLoading } = planSlice.actions

export default planSlice.reducer

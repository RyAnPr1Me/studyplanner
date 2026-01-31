import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
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
    setWeeklyPlan(state, action: PayloadAction<WeeklyPlan | null>) {
      state.weekly = action.payload
    },
    setDailyPlan(state, action: PayloadAction<DailyPlan | null>) {
      state.daily = action.payload
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setWeeklyPlan, setDailyPlan, setTasks, setLoading } = planSlice.actions

export default planSlice.reducer

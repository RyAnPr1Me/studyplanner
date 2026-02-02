import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import WeeklyPlanPage from './pages/WeeklyPlan'
import DailyPlanPage from './pages/DailyPlan'
import ToolsPage from './pages/ToolsPage'
import Settings from './pages/Settings'

interface AppProps {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}

const App = ({ mode, onToggleMode }: AppProps) => (
  <Layout mode={mode} onToggleMode={onToggleMode}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/weekly" element={<WeeklyPlanPage />} />
      <Route path="/daily" element={<DailyPlanPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
)

export default App

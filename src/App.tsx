import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Quiz from './pages/Quiz'
import Report from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Quiz />} />
        <Route path="/quiz"        element={<Quiz />} />
        <Route path="/report/:id"  element={<Report />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

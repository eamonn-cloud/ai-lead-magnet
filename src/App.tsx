import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Quiz from './pages/Quiz'

const Report = lazy(() => import('./pages/Report'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground">Loading…</div>}>
        <Routes>
          <Route path="/"            element={<Quiz />} />
          <Route path="/quiz"        element={<Quiz />} />
          <Route path="/report/:id"  element={<Report />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

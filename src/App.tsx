import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/Layout/ProtectedRoute'
import { Header } from './components/Layout/Header'
import { Navigation } from './components/Layout/Navigation'
import { BoardPage } from './pages/BoardPage'
import { TodoPage } from './pages/TodoPage'
import { CompletedPage } from './pages/CompletedPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ProtectedRoute>
            <Header />
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<BoardPage />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/completed" element={<CompletedPage />} />
              </Routes>
            </main>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Books from './pages/Books'
import Profile from './pages/Profile'
import BookClubs from './pages/BookClubs'
import Club from './pages/Club'
import Friends from './pages/Friends'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyBooks from './pages/MyBooks'
import Ratings from './pages/Ratings'
import { authService } from './services/authService'

function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    initializeAuth()
    
    // Show splash screen for 3.5 seconds (perfect timing for book animation)
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [initializeAuth])

  // Redirect new/logged out users to signup/login
  useEffect(() => {
    if (!showSplash && !isAuthenticated) {
      // Check if user has visited before
      const hasVisited = localStorage.getItem('hasVisited')
      if (!hasVisited) {
        // First time visitor - redirect to signup
        window.location.href = '/signup'
      } else {
        // Returning user - redirect to login
        window.location.href = '/login'
      }
    }
  }, [showSplash, isAuthenticated])

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      {!showSplash && (
        <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/clubs" element={<BookClubs />} />
                  <Route path="/clubs/:id" element={<Club />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/my-books" element={<MyBooks />} />
                  <Route path="/ratings" element={<Ratings />} />
                </Routes>
        </Layout>
      )}
    </>
  )
}

export default App

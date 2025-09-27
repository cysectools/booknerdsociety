import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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

function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore()
  const [showSplash, setShowSplash] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Simplified auth initialization
    try {
      initializeAuth()
    } catch (error) {
      console.log('Auth initialization skipped:', error)
    }
    
    // Don't show splash screen on login/signup pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
    
    if (isAuthPage) {
      setShowSplash(false)
      return
    }
    
    // Show splash screen for 3.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [initializeAuth, location.pathname])

  // Simplified redirect logic
  useEffect(() => {
    if (!showSplash && !isAuthenticated) {
      const protectedRoutes = ['/', '/profile', '/my-books', '/clubs', '/friends', '/ratings']
      const isOnProtectedRoute = protectedRoutes.includes(location.pathname)
      
      if (isOnProtectedRoute) {
        const hasVisited = localStorage.getItem('hasVisited')
        if (!hasVisited) {
          navigate('/signup', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      }
    }
  }, [showSplash, isAuthenticated, navigate, location.pathname])

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const shouldShowSplash = showSplash && !isAuthPage

  return (
    <>
      <SplashScreen isVisible={shouldShowSplash} />
      {!shouldShowSplash && (
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

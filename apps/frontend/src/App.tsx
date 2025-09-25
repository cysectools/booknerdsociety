import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import Profile from './pages/Profile'
import BookClubs from './pages/BookClubs'
import Club from './pages/Club'
import Friends from './pages/Friends'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyBooks from './pages/MyBooks'
import { authService } from './services/authService'

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
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
      </Routes>
    </Layout>
  )
}

export default App

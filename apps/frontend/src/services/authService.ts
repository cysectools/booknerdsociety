import axios from 'axios'
import { User, ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password
    })
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token)
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Login failed')
  },

  async register(userData: { username: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData)
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token)
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Registration failed')
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    
    if (response.data.success) {
      return response.data.data
    }
    
    throw new Error('Failed to get current user')
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  async refreshToken(): Promise<string> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh')
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token)
      return response.data.data.token
    }
    
    throw new Error('Failed to refresh token')
  }
}

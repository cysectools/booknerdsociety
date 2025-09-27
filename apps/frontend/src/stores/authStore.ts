import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '../types'
import { secureAuthService } from '../services/secureAuthService'
import { securityService } from '../services/securityService'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean }>
  register: (userData: { username: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>
  verify2FA: (email: string, code: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  initializeAuth: () => void
  updateUser: (userData: Partial<User>) => void
  enable2FA: (userId: string) => Promise<{ success: boolean; secret?: string; qrCode?: string }>
  sessionId?: string
  twoFactorEnabled?: boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Input sanitization
          const sanitizedEmail = securityService.sanitizeInput(email)
          
          // Rate limiting check
          const rateLimit = securityService.checkRateLimit(sanitizedEmail)
          if (!rateLimit.allowed) {
            set({ isLoading: false })
            return { success: false, message: 'Too many login attempts. Please try again later.' }
          }

          const result = await secureAuthService.loginUser(sanitizedEmail, password)
          
          if (result.success && result.sessionId) {
            const user: User = {
              id: '1',
              username: sanitizedEmail.split('@')[0],
              email: sanitizedEmail,
              bio: 'Book lover and reading enthusiast',
              avatar: '',
              currentBook: 'The Great Gatsby',
              booksReadThisYear: 12,
              favoriteGenre: 'Fiction',
              activeClubs: [],
              friends: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              sessionId: result.sessionId
            })
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: 'Login failed' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const result = await secureAuthService.registerUser(
            userData.username,
            userData.email,
            userData.password
          )
          
          if (result.success && result.userId) {
            const user: User = {
              id: result.userId,
              username: userData.username,
              email: userData.email,
              bio: 'New book lover!',
              avatar: '',
              currentBook: '',
              booksReadThisYear: 0,
              favoriteGenre: '',
              activeClubs: [],
              friends: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }
            set({
              user,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: 'Registration failed' }
        }
      },

      verify2FA: async (email: string, code: string) => {
        set({ isLoading: true })
        try {
          const result = await secureAuthService.verify2FA(email, code)
          
          if (result.success && result.sessionId) {
            set({
              isAuthenticated: true,
              isLoading: false,
              sessionId: result.sessionId
            })
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: '2FA verification failed' }
        }
      },

      enable2FA: async (userId: string) => {
        try {
          return await secureAuthService.enable2FA(userId)
        } catch (error) {
          return { success: false }
        }
      },

      logout: () => {
        const { sessionId } = get()
        if (sessionId) {
          secureAuthService.logoutUser(sessionId)
        }
        securityService.clearSession()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          sessionId: undefined,
          twoFactorEnabled: false
        })
      },

      initializeAuth: () => {
        try {
          // Simplified auth initialization - just set loading to false
          set({ isLoading: false })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ isLoading: false })
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

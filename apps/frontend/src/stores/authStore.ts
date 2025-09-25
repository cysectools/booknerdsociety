import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '../types'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: { username: string; email: string; password: string }) => Promise<void>
  logout: () => void
  initializeAuth: () => void
  updateUser: (userData: Partial<User>) => void
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
          // Simulate API call for now
          await new Promise(resolve => setTimeout(resolve, 1000))
          const user: User = {
            id: '1',
            username: email.split('@')[0],
            email,
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
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          // Simulate API call for now
          await new Promise(resolve => setTimeout(resolve, 1000))
          const user: User = {
            id: '1',
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
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      initializeAuth: () => {
        const token = localStorage.getItem('token')
        if (token) {
          // Simulate user data from token
          const user: User = {
            id: '1',
            username: 'BookLover123',
            email: 'user@example.com',
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
            isLoading: false
          })
        } else {
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

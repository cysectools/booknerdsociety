import { create } from 'zustand'
import { databaseService } from '../services/databaseService'

interface UserProfile {
  id: string
  username: string
  email: string
  bio: string
  avatar?: string
  booksRead: number
  averageRating: number
  bookClubs: number
  favoriteGenre?: string
  memberSince: Date
  isPublic: boolean
  twoFactorEnabled: boolean
  twoFactorMethod?: 'email' | 'phone'
  phoneNumber?: string
  lastActive: Date
  isTutorialCompleted: boolean
}

interface UserState {
  profile: UserProfile
  isTutorialCompleted: boolean
  isLoading: boolean
  
  // Actions
  loadUser: (userId: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updateStats: (stats: { booksRead?: number; averageRating?: number; bookClubs?: number }) => Promise<void>
  toggleProfileVisibility: () => Promise<void>
  enableTwoFactor: (method: 'email' | 'phone', phoneNumber?: string) => Promise<void>
  disableTwoFactor: () => Promise<void>
  deleteAccount: () => Promise<void>
  completeTutorial: () => Promise<void>
  resetTutorial: () => Promise<void>
  syncUserData: () => Promise<void>
}

const defaultProfile: UserProfile = {
  id: '1',
  username: 'NewUser',
  email: 'user@example.com',
  bio: 'Click the "Edit Profile" button to customize your bio and tell others about your reading interests!',
  avatar: '',
  booksRead: 0,
  averageRating: 0,
  bookClubs: 1, // Start with 1 default club
  favoriteGenre: '',
  memberSince: new Date(),
  isPublic: true,
  twoFactorEnabled: false,
  lastActive: new Date(),
  isTutorialCompleted: false
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: defaultProfile,
  isTutorialCompleted: false,
  isLoading: false,

  loadUser: async (userId: string) => {
    set({ isLoading: true })
    try {
      const userData = await databaseService.getUser(userId)
      if (userData) {
        set({ 
          profile: userData,
          isTutorialCompleted: userData.isTutorialCompleted || false
        })
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { ...currentProfile, ...updates }
      
      await databaseService.saveUser(updatedProfile)
      set({ profile: updatedProfile })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateStats: async (stats) => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        ...stats,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ profile: updatedProfile })
    } catch (error) {
      console.error('Error updating stats:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  toggleProfileVisibility: async () => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        isPublic: !currentProfile.isPublic,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ profile: updatedProfile })
    } catch (error) {
      console.error('Error toggling profile visibility:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  enableTwoFactor: async (method, phoneNumber) => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        twoFactorEnabled: true,
        twoFactorMethod: method,
        phoneNumber: method === 'phone' ? phoneNumber : currentProfile.phoneNumber,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ profile: updatedProfile })
    } catch (error) {
      console.error('Error enabling 2FA:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  disableTwoFactor: async () => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        twoFactorEnabled: false,
        twoFactorMethod: undefined,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ profile: updatedProfile })
    } catch (error) {
      console.error('Error disabling 2FA:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true })
    try {
      await databaseService.clearUserData(get().profile.id)
      set({
        profile: defaultProfile,
        isTutorialCompleted: false
      })
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  completeTutorial: async () => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        isTutorialCompleted: true,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ 
        profile: updatedProfile,
        isTutorialCompleted: true
      })
    } catch (error) {
      console.error('Error completing tutorial:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  resetTutorial: async () => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const updatedProfile = { 
        ...currentProfile, 
        isTutorialCompleted: false,
        lastActive: new Date()
      }
      
      await databaseService.saveUser(updatedProfile)
      set({ 
        profile: updatedProfile,
        isTutorialCompleted: false
      })
    } catch (error) {
      console.error('Error resetting tutorial:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  syncUserData: async () => {
    set({ isLoading: true })
    try {
      const currentProfile = get().profile
      const syncedProfile = await databaseService.syncUserStats(currentProfile.id)
      
      if (syncedProfile) {
        set({ profile: syncedProfile })
      }
    } catch (error) {
      console.error('Error syncing user data:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))

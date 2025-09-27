import { create } from 'zustand'
import { Book } from '../types'
import { databaseService } from '../services/databaseService'
import { useUserStore } from './userStore'

interface UserBook extends Book {
  progress: number
  rating: number
  userRating?: number
  isFavorite: boolean
  isBookmarked: boolean
  addedDate: Date
  startedDate?: Date
  finishedDate?: Date
  ratingHistory?: {
    rating: number
    date: Date
    review?: string
  }[]
}

interface BooksState {
  reading: UserBook[]
  read: UserBook[]
  wishlist: UserBook[]
  
  // Actions
  addToWishlist: (book: Book) => void
  addToReadingList: (book: Book) => void
  updateProgress: (bookId: string, progress: number) => void
  markAsRead: (bookId: string, rating?: number) => void
  toggleFavorite: (bookId: string) => void
  toggleBookmark: (bookId: string) => void
  removeFromCollection: (bookId: string, collection: 'reading' | 'read' | 'wishlist') => void
  moveBook: (bookId: string, from: 'reading' | 'read' | 'wishlist', to: 'reading' | 'read' | 'wishlist') => void
  rateBook: (bookId: string, rating: number, review?: string) => void
}

export const useBooksStore = create<BooksState>((set, get) => ({
  reading: [],
  read: [],
  wishlist: [],

  addToWishlist: async (book: Book) => {
    const userBook: UserBook = {
      ...book,
      progress: 0,
      rating: 0,
      isFavorite: false,
      isBookmarked: false,
      addedDate: new Date()
    }
    
    set((state) => ({
      wishlist: [...state.wishlist, userBook]
    }))

    // Save to database
    try {
      await databaseService.addBookToCollection('1', book.id, 'wishlist')
      // Sync user stats
      const { syncUserData } = useUserStore.getState()
      await syncUserData()
    } catch (error) {
      console.error('Error saving to wishlist:', error)
    }
  },

  addToReadingList: async (book: Book) => {
    const userBook: UserBook = {
      ...book,
      progress: 0,
      rating: 0,
      isFavorite: false,
      isBookmarked: false,
      addedDate: new Date(),
      startedDate: new Date()
    }
    
    set((state) => ({
      reading: [...state.reading, userBook]
    }))

    // Save to database
    try {
      await databaseService.addBookToCollection('1', book.id, 'reading')
      // Sync user stats
      const { syncUserData } = useUserStore.getState()
      await syncUserData()
    } catch (error) {
      console.error('Error saving to reading list:', error)
    }
  },

  updateProgress: async (bookId: string, progress: number) => {
    const newProgress = Math.min(100, Math.max(0, progress))
    
    set((state) => ({
      reading: state.reading.map(book => 
        book.id === bookId 
          ? { ...book, progress: newProgress }
          : book
      )
    }))

    // Save to database
    try {
      await databaseService.updateBookProgress('1', bookId, newProgress)
      // Sync user stats
      const { syncUserData } = useUserStore.getState()
      await syncUserData()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  },

  markAsRead: async (bookId: string, rating?: number) => {
    const { reading } = get()
    const book = reading.find(b => b.id === bookId)
    
    if (book) {
      const readBook: UserBook = {
        ...book,
        progress: 100,
        rating: rating || book.rating,
        finishedDate: new Date()
      }
      
      set((state) => ({
        reading: state.reading.filter(b => b.id !== bookId),
        read: [...state.read, readBook]
      }))

      // Save to database
      try {
        await databaseService.updateBookProgress('1', bookId, 100)
        if (rating) {
          await databaseService.saveRating({
            id: `${bookId}-${Date.now()}`,
            userId: '1',
            bookId,
            rating,
            createdAt: new Date()
          })
        }
        // Sync user stats
        const { syncUserData } = useUserStore.getState()
        await syncUserData()
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    }
  },

  toggleFavorite: (bookId: string) => {
    set((state) => ({
      reading: state.reading.map(book => 
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      ),
      read: state.read.map(book => 
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      ),
      wishlist: state.wishlist.map(book => 
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    }))
  },

  toggleBookmark: (bookId: string) => {
    set((state) => ({
      reading: state.reading.map(book => 
        book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
      ),
      read: state.read.map(book => 
        book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
      ),
      wishlist: state.wishlist.map(book => 
        book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
      )
    }))
  },

  removeFromCollection: (bookId: string, collection: 'reading' | 'read' | 'wishlist') => {
    set((state) => ({
      [collection]: state[collection].filter(book => book.id !== bookId)
    }))
  },

  moveBook: (bookId: string, from: 'reading' | 'read' | 'wishlist', to: 'reading' | 'read' | 'wishlist') => {
    const { [from]: sourceCollection } = get()
    const book = sourceCollection.find(b => b.id === bookId)
    
    if (book) {
      const updatedBook: UserBook = {
        ...book,
        ...(to === 'reading' && { startedDate: new Date() }),
        ...(to === 'read' && { finishedDate: new Date(), progress: 100 })
      }
      
      set((state) => ({
        [from]: state[from].filter(b => b.id !== bookId),
        [to]: [...state[to], updatedBook]
      }))
    }
  },

  rateBook: async (bookId: string, rating: number, review?: string) => {
    const newRatingEntry = {
      rating,
      date: new Date(),
      review
    }

    set((state) => ({
      reading: state.reading.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              userRating: rating,
              ratingHistory: [...(book.ratingHistory || []), newRatingEntry]
            } 
          : book
      ),
      read: state.read.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              userRating: rating,
              ratingHistory: [...(book.ratingHistory || []), newRatingEntry]
            } 
          : book
      ),
      wishlist: state.wishlist.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              userRating: rating,
              ratingHistory: [...(book.ratingHistory || []), newRatingEntry]
            } 
          : book
      )
    }))

    // Save to database
    try {
      await databaseService.saveRating({
        id: `${bookId}-${Date.now()}`,
        userId: '1',
        bookId,
        rating,
        review,
        createdAt: new Date()
      })
      // Sync user stats
      const { syncUserData } = useUserStore.getState()
      await syncUserData()
    } catch (error) {
      console.error('Error saving rating:', error)
    }
  }
}))

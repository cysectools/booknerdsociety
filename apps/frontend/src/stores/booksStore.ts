import { create } from 'zustand'
import { Book } from '../types'

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

  addToWishlist: (book: Book) => {
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
  },

  addToReadingList: (book: Book) => {
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
  },

  updateProgress: (bookId: string, progress: number) => {
    set((state) => ({
      reading: state.reading.map(book => 
        book.id === bookId 
          ? { ...book, progress: Math.min(100, Math.max(0, progress)) }
          : book
      )
    }))
  },

  markAsRead: (bookId: string, rating?: number) => {
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

  rateBook: (bookId: string, rating: number, review?: string) => {
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
  }
}))

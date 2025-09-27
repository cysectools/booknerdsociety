import { Book } from '../types'

const GOOGLE_BOOKS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_BOOKS_API_KEY || 'AIzaSyBsB8wNzX8nBj7I7C1SM9teRdhtnkQVWvc'
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes'

export interface GoogleBooksResponse {
  items: GoogleBookItem[]
  totalItems: number
}

export interface GoogleBookItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    categories?: string[]
    pageCount?: number
    language?: string
    publisher?: string
    averageRating?: number
    ratingsCount?: number
  }
}

export const booksService = {
  async searchBooks(query: string, maxResults: number = 10): Promise<Book[]> {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      return data.items?.map(this.transformGoogleBook) || []
    } catch (error) {
      console.error('Error searching books:', error)
      return []
    }
  },

  async getRecommendedBooks(maxResults: number = 8): Promise<Book[]> {
    const genres = [
      'fiction',
      'mystery',
      'romance',
      'science fiction',
      'fantasy',
      'biography',
      'history',
      'self-help'
    ]
    
    const randomGenre = genres[Math.floor(Math.random() * genres.length)]
    
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=subject:${encodeURIComponent(randomGenre)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&orderBy=relevance`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommended books')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      return data.items?.map(this.transformGoogleBook) || []
    } catch (error) {
      console.error('Error fetching recommended books:', error)
      return []
    }
  },

  async getTrendingBooks(maxResults: number = 8): Promise<Book[]> {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=bestseller&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&orderBy=relevance`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending books')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      return data.items?.map(this.transformGoogleBook) || []
    } catch (error) {
      console.error('Error fetching trending books:', error)
      return []
    }
  },

  transformGoogleBook(item: GoogleBookItem): Book {
    const volumeInfo = item.volumeInfo
    
    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.join(', ') || 'Unknown Author',
      authors: volumeInfo.authors || [],
      genre: volumeInfo.categories?.[0] || 'Unknown',
      genres: volumeInfo.categories || [],
      year: volumeInfo.publishedDate?.split('-')[0] || 'Unknown',
      cover: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '/placeholder-book.jpg',
      description: volumeInfo.description || '',
      isbn: item.id,
      rating: volumeInfo.averageRating || 0,
      pages: volumeInfo.pageCount || 0,
      language: volumeInfo.language || 'en',
      publisher: volumeInfo.publisher || 'Unknown'
    }
  }
}

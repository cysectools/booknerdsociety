import { Book } from '../types'

const GOOGLE_BOOKS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_BOOKS_API_KEY || 'AIzaSyBsB8wNzX8nBj7I7C1SM9teRdhtnkQVWvc'
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes'
const MAX_RESULTS_PER_PAGE = 40 // Google Books API maximum

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
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
  }
}

export interface PaginatedSearchResult {
  books: Book[]
  totalItems: number
  hasMore: boolean
  nextStartIndex: number
}

class EnhancedBooksService {
  // Search with pagination support
  async searchBooks(
    query: string, 
    startIndex: number = 0, 
    maxResults: number = MAX_RESULTS_PER_PAGE
  ): Promise<PaginatedSearchResult> {
    try {
      if (!query.trim()) {
        return { books: [], totalItems: 0, hasMore: false, nextStartIndex: 0 }
      }

      const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch books from Google Books API')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      const books = (data.items || []).map(this.transformGoogleBook)
      const totalItems = data.totalItems || 0
      const nextStartIndex = startIndex + maxResults
      const hasMore = nextStartIndex < totalItems && books.length > 0
    
    return {
        books,
        totalItems,
        hasMore,
        nextStartIndex: hasMore ? nextStartIndex : startIndex
      }
    } catch (error) {
      console.error('Error searching books:', error)
      return { books: [], totalItems: 0, hasMore: false, nextStartIndex: startIndex }
    }
  }

  // Browse books by subject with pagination
  async browseBySubject(
    subject: string,
    startIndex: number = 0,
    maxResults: number = MAX_RESULTS_PER_PAGE
  ): Promise<PaginatedSearchResult> {
    try {
      const url = `${GOOGLE_BOOKS_API_URL}?q=subject:${encodeURIComponent(subject)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch books by subject')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      const books = (data.items || []).map(this.transformGoogleBook)
      const totalItems = data.totalItems || 0
      const nextStartIndex = startIndex + maxResults
      const hasMore = nextStartIndex < totalItems && books.length > 0

      return {
        books,
        totalItems,
        hasMore,
        nextStartIndex: hasMore ? nextStartIndex : startIndex
      }
    } catch (error) {
      console.error('Error browsing by subject:', error)
      return { books: [], totalItems: 0, hasMore: false, nextStartIndex: startIndex }
    }
  }

  // Get new releases with pagination
  async getNewReleases(
    startIndex: number = 0,
    maxResults: number = MAX_RESULTS_PER_PAGE
  ): Promise<PaginatedSearchResult> {
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1
    
    try {
      const url = `${GOOGLE_BOOKS_API_URL}?q=subject:fiction+publishedDate:${lastYear}..${currentYear}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=newest`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch new releases')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      const books = (data.items || []).map(this.transformGoogleBook)
      const totalItems = data.totalItems || 0
      const nextStartIndex = startIndex + maxResults
      const hasMore = nextStartIndex < totalItems && books.length > 0

      return {
        books,
        totalItems,
        hasMore,
        nextStartIndex: hasMore ? nextStartIndex : startIndex
      }
    } catch (error) {
      console.error('Error fetching new releases:', error)
      return { books: [], totalItems: 0, hasMore: false, nextStartIndex: startIndex }
    }
  }

  // Get bestsellers with pagination
  async getBestsellers(
    startIndex: number = 0,
    maxResults: number = MAX_RESULTS_PER_PAGE
  ): Promise<PaginatedSearchResult> {
    try {
      // Query bestseller lists from multiple categories
      const url = `${GOOGLE_BOOKS_API_URL}?q=bestseller&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bestsellers')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      const books = (data.items || []).map(this.transformGoogleBook)
      const totalItems = data.totalItems || 0
      const nextStartIndex = startIndex + maxResults
      const hasMore = nextStartIndex < totalItems && books.length > 0

      return {
        books,
        totalItems,
        hasMore,
        nextStartIndex: hasMore ? nextStartIndex : startIndex
      }
    } catch (error) {
      console.error('Error fetching bestsellers:', error)
      return { books: [], totalItems: 0, hasMore: false, nextStartIndex: startIndex }
    }
  }

  // Get highly rated books with pagination
  async getHighlyRated(
    startIndex: number = 0,
    maxResults: number = MAX_RESULTS_PER_PAGE
  ): Promise<PaginatedSearchResult> {
    try {
      // Search for books with high average ratings
      const url = `${GOOGLE_BOOKS_API_URL}?q=subject:fiction&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch highly rated books')
      }
      
      const data: GoogleBooksResponse = await response.json()
      
      // Filter for books with ratings >= 4.0
      const books = (data.items || [])
        .map(this.transformGoogleBook)
        .filter(book => book.rating >= 4.0)
      
      const totalItems = data.totalItems || 0
      const nextStartIndex = startIndex + maxResults
      const hasMore = nextStartIndex < totalItems && books.length > 0

      return {
        books,
        totalItems,
        hasMore,
        nextStartIndex: hasMore ? nextStartIndex : startIndex
      }
    } catch (error) {
      console.error('Error fetching highly rated books:', error)
      return { books: [], totalItems: 0, hasMore: false, nextStartIndex: startIndex }
    }
  }

  // Get book details by ID
  async getBookDetails(bookId: string): Promise<Book | null> {
    try {
      const url = `${GOOGLE_BOOKS_API_URL}/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch book details')
      }
      
      const data = await response.json()
      return this.transformGoogleBook(data)
    } catch (error) {
      console.error('Error fetching book details:', error)
      return null
    }
  }

  // Transform Google Books API response to our Book type
  private transformGoogleBook(item: GoogleBookItem | any): Book {
    const volumeInfo = item.volumeInfo || {}
    
    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.join(', ') || 'Unknown Author',
      authors: volumeInfo.authors || ['Unknown Author'],
      genre: volumeInfo.categories?.[0] || 'Fiction',
      genres: volumeInfo.categories || ['Fiction'],
      year: volumeInfo.publishedDate?.split('-')[0] || 'Unknown',
      cover: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
             volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') || 
             '/placeholder-book.jpg',
      description: volumeInfo.description || 'No description available.',
      isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier || 
            volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier || 
            item.id,
      rating: volumeInfo.averageRating || 4.0,
      pages: volumeInfo.pageCount || 0,
      language: volumeInfo.language || 'en',
      publisher: volumeInfo.publisher || 'Unknown Publisher'
    }
  }

  // Popular subjects for browsing
  getPopularSubjects(): string[] {
    return [
      'fiction',
      'mystery',
      'romance',
      'science fiction',
      'fantasy',
      'thriller',
      'horror',
      'biography',
      'history',
      'self-help',
      'business',
      'cooking',
      'art',
      'travel',
      'poetry',
      'drama',
      'adventure',
      'classics'
    ]
  }
}

export const enhancedBooksService = new EnhancedBooksService()

import { Book } from '../types'

interface GoogleBooksResponse {
  items: Array<{
    id: string
    volumeInfo: {
      title: string
      authors: string[]
      publishedDate: string
      description: string
      imageLinks?: {
        thumbnail: string
        smallThumbnail: string
      }
      categories?: string[]
      averageRating?: number
      ratingsCount?: number
      industryIdentifiers?: Array<{
        type: string
        identifier: string
      }>
      publisher?: string
      pageCount?: number
      language?: string
    }
  }>
}

interface BookRanking {
  book: Book
  score: number
  reasons: string[]
}

class RealBookService {
  private baseUrl = 'https://www.googleapis.com/books/v1/volumes'
  private cache = new Map<string, Book[]>()

  // Real book data for popular books with accurate information
  private popularBooks = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      year: "1925",
      genre: "Classic Literature",
      description: "A classic American novel set in the Jazz Age, following the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
      rating: 4.5,
      cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780061120084",
      year: "1960",
      genre: "Classic Literature",
      description: "A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.",
      rating: 4.8,
      cover: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780452284234",
      year: "1949",
      genre: "Dystopian Fiction",
      description: "A dystopian social science fiction novel about totalitarian control and surveillance in a future society.",
      rating: 4.7,
      cover: "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      year: "1813",
      genre: "Romance",
      description: "A romantic novel of manners that follows the character development of Elizabeth Bennet, the dynamic protagonist.",
      rating: 4.6,
      cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      year: "1937",
      genre: "Fantasy",
      description: "A fantasy novel about a hobbit's unexpected journey to help dwarves reclaim their mountain home from a dragon.",
      rating: 4.9,
      cover: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      isbn: "9780747532699",
      year: "1997",
      genre: "Fantasy",
      description: "The first book in the Harry Potter series, following a young wizard's first year at Hogwarts School of Witchcraft and Wizardry.",
      rating: 4.8,
      cover: "https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg"
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      isbn: "9780544003415",
      year: "1954",
      genre: "Fantasy",
      description: "An epic high-fantasy novel about the quest to destroy the One Ring and defeat the Dark Lord Sauron.",
      rating: 4.9,
      cover: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg"
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441013593",
      year: "1965",
      genre: "Science Fiction",
      description: "A science fiction epic set on the desert planet Arrakis, following Paul Atreides as he navigates political intrigue and mystical powers.",
      rating: 4.8,
      cover: "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg"
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "9780316769174",
      year: "1951",
      genre: "Coming-of-age",
      description: "A coming-of-age story about teenager Holden Caulfield's experiences in New York City after being expelled from prep school.",
      rating: 4.3,
      cover: "https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg"
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      isbn: "9780307269751",
      year: "2005",
      genre: "Mystery",
      description: "A psychological thriller about a journalist and a hacker investigating a decades-old disappearance.",
      rating: 4.3,
      cover: "https://covers.openlibrary.org/b/isbn/9780307269751-L.jpg"
    }
  ]

  private calculateBookScore(book: Book, query: string): BookRanking {
    let score = 0
    const reasons: string[] = []
    const queryLower = query.toLowerCase()

    // Title exact match (highest priority)
    if (book.title.toLowerCase() === queryLower) {
      score += 100
      reasons.push("Exact title match")
    } else if (book.title.toLowerCase().includes(queryLower)) {
      score += 80
      reasons.push("Title contains search term")
    }

    // Author exact match
    if (book.author.toLowerCase() === queryLower) {
      score += 90
      reasons.push("Exact author match")
    } else if (book.author.toLowerCase().includes(queryLower)) {
      score += 70
      reasons.push("Author contains search term")
    }

    // Genre match
    if (book.genre.toLowerCase().includes(queryLower)) {
      score += 30
      reasons.push("Genre match")
    }

    // Description match
    if (book.description && book.description.toLowerCase().includes(queryLower)) {
      score += 20
      reasons.push("Description contains search term")
    }

    // Rating bonus (higher rated books get priority)
    if (book.rating && book.rating >= 4.5) {
      score += 15
      reasons.push("High rating (4.5+)")
    } else if (book.rating && book.rating >= 4.0) {
      score += 10
      reasons.push("Good rating (4.0+)")
    }

    // Popularity bonus (based on known popular books)
    const isPopular = this.popularBooks.some((pb: any) => 
      pb.title.toLowerCase() === book.title.toLowerCase() && 
      pb.author.toLowerCase() === book.author.toLowerCase()
    )
    if (isPopular) {
      score += 25
      reasons.push("Popular/classic book")
    }

    // Original publication year bonus (older, established books)
    const year = parseInt(book.year || '0')
    if (year < 2000 && year > 1900) {
      score += 10
      reasons.push("Classic literature")
    }

    return { book, score, reasons }
  }

  async searchBooks(query: string, limit: number = 20): Promise<Book[]> {
    if (!query.trim()) return []

    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.slice(0, limit)
    }

    try {
      // First, search our curated popular books
      const popularMatches = this.popularBooks.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      )

      // Calculate scores and rank
      const rankedBooks = popularMatches
        .map(book => this.calculateBookScore(book as Book, query))
        .sort((a, b) => b.score - a.score)

      // If we have good matches from popular books, return them
      if (rankedBooks.length > 0 && rankedBooks[0].score >= 50) {
        const results = rankedBooks.map(rb => rb.book).slice(0, limit)
        this.cache.set(cacheKey, results)
        return results
      }

      // Fallback to Google Books API for more results
      const apiResults = await this.searchGoogleBooks(query, limit)
      
      // Combine and rank all results
      const allBooks = [...popularMatches, ...apiResults]
      const allRanked = allBooks
        .map(book => this.calculateBookScore(book as Book, query))
        .sort((a, b) => b.score - a.score)

      const results = allRanked.map(rb => rb.book).slice(0, limit)
      this.cache.set(cacheKey, results)
      return results

    } catch (error) {
      console.error('Error searching books:', error)
      // Fallback to popular books only
      const fallbackResults = this.popularBooks
        .filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit)
      
      return fallbackResults as Book[]
    }
  }

  private async searchGoogleBooks(query: string, limit: number): Promise<Book[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${limit * 2}&orderBy=relevance`
      )
      
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`)
      }

      const data: GoogleBooksResponse = await response.json()
      
      if (!data.items) return []

      return data.items
        .filter(item => item.volumeInfo && item.volumeInfo.title)
        .map(item => {
          const volumeInfo = item.volumeInfo
          return {
            id: item.id,
            title: volumeInfo.title,
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            year: volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : 'Unknown',
            genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown',
            description: volumeInfo.description || 'No description available',
            rating: volumeInfo.averageRating || 4.0,
            cover: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '/placeholder-book.jpg',
            pages: volumeInfo.pageCount || 0,
            language: volumeInfo.language || 'en',
            publisher: volumeInfo.publisher || 'Unknown',
            isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 
                  volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || 
                  'Unknown'
          } as Book
        })
        .slice(0, limit)
    } catch (error) {
      console.error('Google Books API error:', error)
      return []
    }
  }

  async getBookDetails(bookId: string): Promise<Book | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${bookId}`)
      if (!response.ok) return null

      const data = await response.json()
      const volumeInfo = data.volumeInfo

      return {
        id: bookId,
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
        year: volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : 'Unknown',
        genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown',
        description: volumeInfo.description || 'No description available',
        rating: volumeInfo.averageRating || 4.0,
        cover: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '/placeholder-book.jpg',
        pages: volumeInfo.pageCount || 0,
        language: volumeInfo.language || 'en',
        publisher: volumeInfo.publisher || 'Unknown',
        isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier || 
              volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier || 
              'Unknown'
      } as Book
    } catch (error) {
      console.error('Error fetching book details:', error)
      return null
    }
  }

  // Get recommended books based on popular/classic titles
  async getRecommendedBooks(limit: number = 20): Promise<Book[]> {
    const shuffled = [...this.popularBooks].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, limit) as Book[]
  }

  // Get top rated books from our curated list
  async getTopRatedBooks(limit: number = 20): Promise<Book[]> {
      return this.popularBooks
        .filter(book => book.rating && book.rating >= 4.5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit) as Book[]
  }

  // Get new releases (books from recent years)
  async getNewReleases(limit: number = 20): Promise<Book[]> {
    const currentYear = new Date().getFullYear()
    return this.popularBooks
      .filter(book => parseInt(book.year) >= currentYear - 5)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, limit) as Book[]
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }
}

export const realBookService = new RealBookService()

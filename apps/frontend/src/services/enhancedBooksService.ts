import { Book } from '../types'

// Enhanced book data with more variety
const bookTemplates = [
  // Classic Literature
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic Literature", year: "1925", rating: 4.5 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic Literature", year: "1960", rating: 4.8 },
  { title: "1984", author: "George Orwell", genre: "Dystopian Fiction", year: "1949", rating: 4.7 },
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: "1813", rating: 4.6 },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming-of-age", year: "1951", rating: 4.3 },
  
  // Fantasy
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: "1937", rating: 4.9 },
  { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", genre: "Fantasy", year: "1997", rating: 4.8 },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", year: "1954", rating: 4.9 },
  { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", year: "1996", rating: 4.6 },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", year: "2007", rating: 4.7 },
  
  // Science Fiction
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", year: "1965", rating: 4.8 },
  { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction", year: "1951", rating: 4.6 },
  { title: "The Martian", author: "Andy Weir", genre: "Science Fiction", year: "2011", rating: 4.7 },
  { title: "Neuromancer", author: "William Gibson", genre: "Science Fiction", year: "1984", rating: 4.4 },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Science Fiction", year: "1969", rating: 4.5 },
  
  // Mystery & Thriller
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery", year: "2005", rating: 4.3 },
  { title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", year: "2012", rating: 4.2 },
  { title: "The Da Vinci Code", author: "Dan Brown", genre: "Mystery", year: "2003", rating: 4.1 },
  { title: "The Silence of the Lambs", author: "Thomas Harris", genre: "Thriller", year: "1988", rating: 4.4 },
  { title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery", year: "1939", rating: 4.3 },
  
  // Romance
  { title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", year: "1996", rating: 4.2 },
  { title: "Outlander", author: "Diana Gabaldon", genre: "Romance", year: "1991", rating: 4.5 },
  { title: "Me Before You", author: "Jojo Moyes", genre: "Romance", year: "2012", rating: 4.3 },
  { title: "The Time Traveler's Wife", author: "Audrey Niffenegger", genre: "Romance", year: "2003", rating: 4.1 },
  { title: "The Fault in Our Stars", author: "John Green", genre: "Young Adult", year: "2012", rating: 4.4 },
  
  // Contemporary Fiction
  { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Contemporary Fiction", year: "2003", rating: 4.6 },
  { title: "Life of Pi", author: "Yann Martel", genre: "Contemporary Fiction", year: "2001", rating: 4.4 },
  { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction", year: "2005", rating: 4.7 },
  { title: "The Help", author: "Kathryn Stockett", genre: "Historical Fiction", year: "2009", rating: 4.5 },
  { title: "Water for Elephants", author: "Sara Gruen", genre: "Historical Fiction", year: "2006", rating: 4.3 },
  
  // Non-Fiction
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", year: "2011", rating: 4.6 },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", year: "2011", rating: 4.5 },
  { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", genre: "Biography", year: "2010", rating: 4.4 },
  { title: "Educated", author: "Tara Westover", genre: "Memoir", year: "2018", rating: 4.7 },
  { title: "Becoming", author: "Michelle Obama", genre: "Memoir", year: "2018", rating: 4.8 }
]

// Additional book variations for infinite scroll
const additionalTitles = [
  "The Chronicles of Narnia", "The Handmaid's Tale", "Brave New World", "Animal Farm", "Lord of the Flies",
  "The Scarlet Letter", "Moby Dick", "The Adventures of Huckleberry Finn", "The Grapes of Wrath", "Of Mice and Men",
  "The Sun Also Rises", "A Farewell to Arms", "The Old Man and the Sea", "For Whom the Bell Tolls", "The Sound and the Fury",
  "As I Lay Dying", "Light in August", "Absalom, Absalom!", "Go Down, Moses", "The Hamlet",
  "The Brothers Karamazov", "Crime and Punishment", "War and Peace", "Anna Karenina", "The Idiot",
  "Les Misérables", "The Hunchback of Notre-Dame", "The Count of Monte Cristo", "The Three Musketeers", "Twenty Thousand Leagues Under the Sea"
]

const additionalAuthors = [
  "Charles Dickens", "Mark Twain", "Herman Melville", "Nathaniel Hawthorne", "John Steinbeck",
  "Ernest Hemingway", "William Faulkner", "Fyodor Dostoevsky", "Leo Tolstoy", "Victor Hugo",
  "Jules Verne", "Alexandre Dumas", "Honoré de Balzac", "Gustave Flaubert", "Émile Zola",
  "Anton Chekhov", "Ivan Turgenev", "Nikolai Gogol", "Mikhail Bulgakov", "Boris Pasternak",
  "Gabriel García Márquez", "Jorge Luis Borges", "Isabel Allende", "Mario Vargas Llosa", "Pablo Neruda"
]

const genres = [
  "Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance", "Historical Fiction",
  "Contemporary Fiction", "Literary Fiction", "Young Adult", "Children's Literature",
  "Biography", "Memoir", "Self-Help", "Philosophy", "History", "Science", "Travel",
  "Poetry", "Drama", "Horror", "Adventure", "Crime", "Western", "Dystopian"
]

class EnhancedBooksService {
  private loadedBookIds = new Set<string>()
  private currentPage = 0
  // private _booksPerPage = 20

  private generateUniqueId(): string {
    return `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private generateRandomBook(): Book {
    const template = this.getRandomElement(bookTemplates)
    const additionalTitle = this.getRandomElement(additionalTitles)
    const additionalAuthor = this.getRandomElement(additionalAuthors)
    const genre = this.getRandomElement(genres)
    
    // Mix template and additional data for variety
    const useTemplate = Math.random() > 0.5
    const title = useTemplate ? template.title : additionalTitle
    const author = useTemplate ? template.author : additionalAuthor
    
    const currentYear = new Date().getFullYear()
    const year = Math.floor(Math.random() * (currentYear - 1900 + 1)) + 1900
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0 to 5.0
    const pages = Math.floor(Math.random() * 500) + 200 // 200 to 700 pages
    
    return {
      id: this.generateUniqueId(),
      title,
      author,
      genre,
      year: year.toString(),
      cover: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
      description: `A captivating ${genre.toLowerCase()} novel that explores themes of ${this.getRandomElement(['love', 'adventure', 'mystery', 'redemption', 'courage', 'friendship', 'betrayal', 'hope'])}.`,
      rating,
      pages,
      language: 'English',
      publisher: this.getRandomElement(['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Macmillan', 'Hachette Book Group']),
      isbn: `978-${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }
  }

  private generateBooks(count: number): Book[] {
    const newBooks: Book[] = []
    let attempts = 0
    const maxAttempts = count * 3 // Prevent infinite loops

    while (newBooks.length < count && attempts < maxAttempts) {
      const book = this.generateRandomBook()
      
      // Check for duplicates by title and author combination
      const isDuplicate = this.loadedBookIds.has(`${book.title}-${book.author}`) ||
                         newBooks.some(b => b.title === book.title && b.author === book.author)
      
      if (!isDuplicate) {
        this.loadedBookIds.add(`${book.title}-${book.author}`)
        newBooks.push(book)
      }
      attempts++
    }

    return newBooks
  }

  async getRecommendedBooks(limit: number = 20): Promise<Book[]> {
    // Reset for fresh start
    this.loadedBookIds.clear()
    this.currentPage = 0
    
    const books = this.generateBooks(limit)
    this.currentPage++
    return books
  }

  async loadMoreBooks(limit: number = 20): Promise<Book[]> {
    const books = this.generateBooks(limit)
    this.currentPage++
    return books
  }

  async searchBooks(query: string, limit: number = 20): Promise<Book[]> {
    // Reset for search
    this.loadedBookIds.clear()
    this.currentPage = 0
    
    const allBooks = this.generateBooks(limit * 2) // Generate more to filter from
    const filteredBooks = allBooks.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genre.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
    
    return filteredBooks
  }

  async getTopRatedBooks(limit: number = 20): Promise<Book[]> {
    // Reset for filter
    this.loadedBookIds.clear()
    this.currentPage = 0
    
    const allBooks = this.generateBooks(limit * 2)
    const topRatedBooks = allBooks
      .filter(book => book.rating && book.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
    
    return topRatedBooks
  }

  async getNewReleases(limit: number = 20): Promise<Book[]> {
    // Reset for filter
    this.loadedBookIds.clear()
    this.currentPage = 0
    
    const currentYear = new Date().getFullYear()
    const allBooks = this.generateBooks(limit * 2)
    const newReleases = allBooks
      .filter(book => parseInt(book.year) >= currentYear - 2)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, limit)
    
    return newReleases
  }

  async loadMoreTopRated(limit: number = 20): Promise<Book[]> {
    const allBooks = this.generateBooks(limit * 2)
    const topRatedBooks = allBooks
      .filter(book => book.rating && book.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
    
    return topRatedBooks
  }

  async loadMoreNewReleases(limit: number = 20): Promise<Book[]> {
    const currentYear = new Date().getFullYear()
    const allBooks = this.generateBooks(limit * 2)
    const newReleases = allBooks
      .filter(book => parseInt(book.year) >= currentYear - 2)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, limit)
    
    return newReleases
  }

  reset(): void {
    this.loadedBookIds.clear()
    this.currentPage = 0
  }
}

export const enhancedBooksService = new EnhancedBooksService()

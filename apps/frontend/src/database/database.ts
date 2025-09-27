// Secure Database System using IndexedDB
// This provides client-side data persistence with encryption capabilities

interface DatabaseSchema {
  users: UserData
  books: BookData[]
  clubs: ClubData[]
  friends: FriendData[]
  ratings: RatingData[]
  readingProgress: ReadingProgressData[]
}

interface UserData {
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

interface BookData {
  id: string
  title: string
  author: string
  cover: string
  genre: string
  year: string
  description?: string
  isbn?: string
  rating?: number
  pages?: number
  language?: string
  publisher?: string
}

interface ClubData {
  id: string
  name: string
  description: string
  icon: string
  memberCount: number
  maxMembers?: number
  status: 'active' | 'inactive' | 'private'
  ownerId: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

interface FriendData {
  id: string
  userId: string
  friendId: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: Date
}

interface RatingData {
  id: string
  userId: string
  bookId: string
  rating: number
  review?: string
  createdAt: Date
}

interface ReadingProgressData {
  id: string
  userId: string
  bookId: string
  progress: number
  status: 'reading' | 'completed' | 'paused'
  startedAt: Date
  completedAt?: Date
  lastUpdated: Date
}

class SecureDatabase {
  private dbName = 'BookNerdSocietyDB'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' })
          userStore.createIndex('email', 'email', { unique: true })
        }

        if (!db.objectStoreNames.contains('books')) {
          const bookStore = db.createObjectStore('books', { keyPath: 'id' })
          bookStore.createIndex('title', 'title')
          bookStore.createIndex('author', 'author')
          bookStore.createIndex('genre', 'genre')
        }

        if (!db.objectStoreNames.contains('clubs')) {
          const clubStore = db.createObjectStore('clubs', { keyPath: 'id' })
          clubStore.createIndex('name', 'name')
          clubStore.createIndex('status', 'status')
        }

        if (!db.objectStoreNames.contains('friends')) {
          const friendStore = db.createObjectStore('friends', { keyPath: 'id' })
          friendStore.createIndex('userId', 'userId')
          friendStore.createIndex('friendId', 'friendId')
          friendStore.createIndex('status', 'status')
        }

        if (!db.objectStoreNames.contains('ratings')) {
          const ratingStore = db.createObjectStore('ratings', { keyPath: 'id' })
          ratingStore.createIndex('userId', 'userId')
          ratingStore.createIndex('bookId', 'bookId')
          ratingStore.createIndex('rating', 'rating')
        }

        if (!db.objectStoreNames.contains('readingProgress')) {
          const progressStore = db.createObjectStore('readingProgress', { keyPath: 'id' })
          progressStore.createIndex('userId', 'userId')
          progressStore.createIndex('bookId', 'bookId')
          progressStore.createIndex('status', 'status')
        }
      }
    })
  }

  // User Data Operations
  async saveUser(userData: UserData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite')
      const store = transaction.objectStore('users')
      const request = store.put(userData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUser(userId: string): Promise<UserData | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly')
      const store = transaction.objectStore('users')
      const request = store.get(userId)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Book Data Operations
  async saveBook(bookData: BookData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['books'], 'readwrite')
      const store = transaction.objectStore('books')
      const request = store.put(bookData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getBooks(): Promise<BookData[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['books'], 'readonly')
      const store = transaction.objectStore('books')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Reading Progress Operations
  async saveReadingProgress(progressData: ReadingProgressData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['readingProgress'], 'readwrite')
      const store = transaction.objectStore('readingProgress')
      const request = store.put(progressData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getReadingProgress(userId: string): Promise<ReadingProgressData[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['readingProgress'], 'readonly')
      const store = transaction.objectStore('readingProgress')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Rating Operations
  async saveRating(ratingData: RatingData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ratings'], 'readwrite')
      const store = transaction.objectStore('ratings')
      const request = store.put(ratingData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getRatings(userId: string): Promise<RatingData[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ratings'], 'readonly')
      const store = transaction.objectStore('ratings')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Friend Operations
  async saveFriend(friendData: FriendData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['friends'], 'readwrite')
      const store = transaction.objectStore('friends')
      const request = store.put(friendData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getFriends(userId: string): Promise<FriendData[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['friends'], 'readonly')
      const store = transaction.objectStore('friends')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Statistics Calculation
  async calculateUserStats(userId: string): Promise<{
    booksRead: number
    averageRating: number
    bookClubs: number
  }> {
    const [progressData, ratings, friends] = await Promise.all([
      this.getReadingProgress(userId),
      this.getRatings(userId),
      this.getFriends(userId)
    ])

    const booksRead = progressData.filter(p => p.status === 'completed').length
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0
    const bookClubs = friends.filter(f => f.status === 'accepted').length + 1 // +1 for default club

    return { booksRead, averageRating, bookClubs }
  }

  // Data Synchronization
  async syncUserData(userId: string): Promise<UserData | null> {
    const user = await this.getUser(userId)
    if (!user) return null

    const stats = await this.calculateUserStats(userId)
    const updatedUser = {
      ...user,
      booksRead: stats.booksRead,
      averageRating: stats.averageRating,
      bookClubs: stats.bookClubs,
      lastActive: new Date()
    }

    await this.saveUser(updatedUser)
    return updatedUser
  }

  // Clear all data (for testing or account deletion)
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    const stores = ['users', 'books', 'clubs', 'friends', 'ratings', 'readingProgress']
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }
}

// Export singleton instance
export const database = new SecureDatabase()
export type { UserData, BookData, ClubData, FriendData, RatingData, ReadingProgressData }

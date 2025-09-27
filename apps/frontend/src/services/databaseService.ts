import { database, UserData, BookData, ReadingProgressData, RatingData, ClubData, ClubMembershipData } from '../database/database'

class DatabaseService {
  private isInitialized = false

  async init(): Promise<void> {
    if (!this.isInitialized) {
      await database.init()
      this.isInitialized = true
    }
  }

  // User Operations
  async saveUser(userData: UserData): Promise<void> {
    await this.init()
    await database.saveUser(userData)
  }

  async getUser(userId: string): Promise<UserData | null> {
    await this.init()
    return await database.getUser(userId)
  }

  async syncUserStats(userId: string): Promise<UserData | null> {
    await this.init()
    return await database.syncUserData(userId)
  }

  // Book Operations
  async saveBook(bookData: BookData): Promise<void> {
    await this.init()
    await database.saveBook(bookData)
  }

  async getBooks(): Promise<BookData[]> {
    await this.init()
    return await database.getBooks()
  }

  // Reading Progress Operations
  async saveReadingProgress(progressData: ReadingProgressData): Promise<void> {
    await this.init()
    await database.saveReadingProgress(progressData)
    
    // Auto-sync user stats when progress is updated
    await this.syncUserStats(progressData.userId)
  }

  async getReadingProgress(userId: string): Promise<ReadingProgressData[]> {
    await this.init()
    return await database.getReadingProgress(userId)
  }

  // Rating Operations
  async saveRating(ratingData: RatingData): Promise<void> {
    await this.init()
    await database.saveRating(ratingData)
    
    // Auto-sync user stats when rating is added
    await this.syncUserStats(ratingData.userId)
  }

  async getRatings(userId: string): Promise<RatingData[]> {
    await this.init()
    return await database.getRatings(userId)
  }

  // Book Collection Operations
  async addBookToCollection(
    userId: string, 
    bookId: string, 
    collection: 'reading' | 'read' | 'wishlist'
  ): Promise<void> {
    await this.init()
    
    const progressData: ReadingProgressData = {
      id: `${userId}-${bookId}-${Date.now()}`,
      userId,
      bookId,
      progress: collection === 'read' ? 100 : 0,
      status: collection === 'read' ? 'completed' : 'reading',
      startedAt: new Date(),
      completedAt: collection === 'read' ? new Date() : undefined,
      lastUpdated: new Date()
    }

    await this.saveReadingProgress(progressData)
  }

  async updateBookProgress(
    userId: string,
    bookId: string,
    progress: number
  ): Promise<void> {
    await this.init()
    
    const existingProgress = await database.getReadingProgress(userId)
    const bookProgress = existingProgress.find(p => p.bookId === bookId)
    
    if (bookProgress) {
      const updatedProgress: ReadingProgressData = {
        ...bookProgress,
        progress,
        status: progress >= 100 ? 'completed' : 'reading',
        completedAt: progress >= 100 ? new Date() : bookProgress.completedAt,
        lastUpdated: new Date()
      }
      
      await this.saveReadingProgress(updatedProgress)
    }
  }

  async getBookCollections(userId: string): Promise<{
    reading: BookData[]
    read: BookData[]
    wishlist: BookData[]
  }> {
    await this.init()
    
    const [allBooks, progressData] = await Promise.all([
      this.getBooks(),
      this.getReadingProgress(userId)
    ])

    const reading: BookData[] = []
    const read: BookData[] = []
    const wishlist: BookData[] = []

    for (const book of allBooks) {
      const progress = progressData.find(p => p.bookId === book.id)
      
      if (progress) {
        if (progress.status === 'completed') {
          read.push(book)
        } else if (progress.status === 'reading') {
          reading.push(book)
        }
      } else {
        // Books without progress are considered wishlist
        wishlist.push(book)
      }
    }

    return { reading, read, wishlist }
  }

  // Statistics
  async getUserStats(userId: string): Promise<{
    booksRead: number
    averageRating: number
    bookClubs: number
  }> {
    await this.init()
    return await database.calculateUserStats(userId)
  }

  // Data Export/Import
  async exportUserData(userId: string): Promise<any> {
    await this.init()
    
    const [user, books, progress, ratings] = await Promise.all([
      this.getUser(userId),
      this.getBooks(),
      this.getReadingProgress(userId),
      this.getRatings(userId)
    ])

    return {
      user,
      books,
      progress,
      ratings,
      exportDate: new Date().toISOString()
    }
  }

  async clearUserData(userId: string): Promise<void> {
    await this.init()
    // In a real app, you'd delete specific user data
    // For now, we'll clear all data
    await database.clearAllData()
  }

  // Club Operations
  async saveClub(clubData: ClubData): Promise<void> {
    await this.init()
    await database.saveClub(clubData)
  }

  async getClub(clubId: string): Promise<ClubData | null> {
    await this.init()
    return await database.getClub(clubId)
  }

  async getAllClubs(): Promise<ClubData[]> {
    await this.init()
    return await database.getAllClubs()
  }

  async saveClubMembership(membershipData: ClubMembershipData): Promise<void> {
    await this.init()
    await database.saveClubMembership(membershipData)
  }

  async getUserClubMemberships(userId: string): Promise<ClubMembershipData[]> {
    await this.init()
    return await database.getUserClubMemberships(userId)
  }

  async removeClubMembership(userId: string, clubId: string): Promise<void> {
    await this.init()
    await database.removeClubMembership(userId, clubId)
  }

  // Rating Operations
  async getBookRatings(bookId: string): Promise<any[]> {
    await this.init()
    return await database.getBookRatings(bookId)
  }
}

export const databaseService = new DatabaseService()

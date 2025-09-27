import { databaseService } from './databaseService'

export interface BookClub {
  id: string
  name: string
  description: string
  icon: string
  memberCount: number
  maxMembers: number
  isPublic: boolean
  createdAt: Date
  createdBy: string
  currentBook?: {
    title: string
    author: string
    startDate: Date
  }
  rules: string[]
  tags: string[]
}

export interface ClubMembership {
  id: string
  userId: string
  clubId: string
  joinedAt: Date
  role: 'member' | 'moderator' | 'admin'
  isActive: boolean
}

class ClubService {
  private defaultClub: BookClub = {
    id: 'booknerdsociety',
    name: 'BookNerdSociety',
    description: 'The official BookNerdSociety club for all book lovers! Join discussions, share recommendations, and discover your next favorite read.',
    icon: '📚',
    memberCount: 1,
    maxMembers: 1000,
    isPublic: true,
    createdAt: new Date(),
    createdBy: 'system',
    currentBook: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      startDate: new Date()
    },
    rules: [
      'Be respectful to all members',
      'Keep discussions book-related',
      'No spam or self-promotion',
      'Share your honest opinions'
    ],
    tags: ['general', 'classics', 'discussion']
  }

  async createDefaultClub(): Promise<void> {
    try {
      await databaseService.saveClub(this.defaultClub)
    } catch (error) {
      console.error('Error creating default club:', error)
    }
  }

  async addUserToDefaultClub(userId: string): Promise<void> {
    try {
      const membership: ClubMembership = {
        id: `${userId}-booknerdsociety`,
        userId,
        clubId: 'booknerdsociety',
        joinedAt: new Date(),
        role: 'member',
        isActive: true
      }
      
      await databaseService.saveClubMembership(membership)
      
      // Update club member count
      const club = await databaseService.getClub('booknerdsociety')
      if (club) {
        club.memberCount += 1
        await databaseService.saveClub(club)
      }
    } catch (error) {
      console.error('Error adding user to default club:', error)
    }
  }

  async removeUserFromClub(userId: string, clubId: string): Promise<void> {
    try {
      await databaseService.removeClubMembership(userId, clubId)
      
      // Update club member count
      const club = await databaseService.getClub(clubId)
      if (club) {
        club.memberCount = Math.max(0, club.memberCount - 1)
        await databaseService.saveClub(club)
      }
    } catch (error) {
      console.error('Error removing user from club:', error)
    }
  }

  async getUserClubs(userId: string): Promise<BookClub[]> {
    try {
      const memberships = await databaseService.getUserClubMemberships(userId)
      const clubs: BookClub[] = []
      
      for (const membership of memberships) {
        if (membership.isActive) {
          const club = await databaseService.getClub(membership.clubId)
          if (club) {
            clubs.push(club)
          }
        }
      }
      
      return clubs
    } catch (error) {
      console.error('Error getting user clubs:', error)
      return []
    }
  }

  async joinClub(userId: string, clubId: string): Promise<void> {
    try {
      const membership: ClubMembership = {
        id: `${userId}-${clubId}`,
        userId,
        clubId,
        joinedAt: new Date(),
        role: 'member',
        isActive: true
      }
      
      await databaseService.saveClubMembership(membership)
      
      // Update club member count
      const club = await databaseService.getClub(clubId)
      if (club) {
        club.memberCount += 1
        await databaseService.saveClub(club)
      }
    } catch (error) {
      console.error('Error joining club:', error)
    }
  }

  async leaveClub(userId: string, clubId: string): Promise<void> {
    await this.removeUserFromClub(userId, clubId)
  }

  async getClub(clubId: string): Promise<BookClub | null> {
    try {
      return await databaseService.getClub(clubId)
    } catch (error) {
      console.error('Error getting club:', error)
      return null
    }
  }

  async getAllClubs(): Promise<BookClub[]> {
    try {
      return await databaseService.getAllClubs()
    } catch (error) {
      console.error('Error getting all clubs:', error)
      return []
    }
  }

  async isUserInClub(userId: string, clubId: string): Promise<boolean> {
    try {
      const memberships = await databaseService.getUserClubMemberships(userId)
      return memberships.some(m => m.clubId === clubId && m.isActive)
    } catch (error) {
      console.error('Error checking club membership:', error)
      return false
    }
  }
}

export const clubService = new ClubService()

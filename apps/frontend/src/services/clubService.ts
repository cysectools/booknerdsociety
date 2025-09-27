import { databaseService } from './databaseService'
import { BookClub } from '../types'

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
    ownerId: 'system',
    members: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  async createDefaultClub(): Promise<void> {
    try {
      // Convert BookClub to ClubData format
      const clubData = {
        id: this.defaultClub.id,
        name: this.defaultClub.name,
        description: this.defaultClub.description,
        memberCount: this.defaultClub.memberCount,
        maxMembers: this.defaultClub.maxMembers,
        currentBook: undefined,
        icon: this.defaultClub.icon,
        owner: 'system',
        isOfficial: false,
        rating: 4.0,
        isJoined: false,
        rules: [],
        status: 'active' as const,
        ownerId: 'system',
        members: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await databaseService.saveClub(clubData)
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
          const clubData = await databaseService.getClub(membership.clubId)
          if (clubData) {
            // Convert ClubData to BookClub format
            const club: BookClub = {
              id: clubData.id,
              name: clubData.name,
              description: clubData.description,
              icon: clubData.icon,
              memberCount: clubData.memberCount,
              maxMembers: clubData.maxMembers || 100,
              ownerId: clubData.ownerId,
              members: clubData.members,
              createdAt: clubData.createdAt,
              updatedAt: clubData.updatedAt,
              currentBook: undefined,
              owner: clubData.ownerId,
              isOfficial: false,
              rating: 4.0,
              isJoined: false,
              rules: [],
              isPublic: true,
              createdBy: clubData.ownerId,
              tags: ['general']
            }
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
      const clubData = await databaseService.getClub(clubId)
      if (clubData) {
        clubData.memberCount += 1
        await databaseService.saveClub(clubData)
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
      const clubData = await databaseService.getClub(clubId)
      if (!clubData) return null
      
      // Convert ClubData to BookClub format
      return {
        id: clubData.id,
        name: clubData.name,
        description: clubData.description,
        memberCount: clubData.memberCount,
        maxMembers: clubData.maxMembers || 100,
        currentBook: undefined,
        icon: clubData.icon,
        owner: clubData.ownerId,
        isOfficial: false,
        rating: 4.0,
        isJoined: false,
        rules: [],
        isPublic: true,
        createdBy: clubData.ownerId,
        tags: ['general'],
        createdAt: clubData.createdAt,
        ownerId: clubData.ownerId,
        members: clubData.members,
        updatedAt: clubData.updatedAt
      }
    } catch (error) {
      console.error('Error getting club:', error)
      return null
    }
  }

  async getAllClubs(): Promise<BookClub[]> {
    try {
      const clubsData = await databaseService.getAllClubs()
      return clubsData.map(clubData => ({
        id: clubData.id,
        name: clubData.name,
        description: clubData.description,
        memberCount: clubData.memberCount,
        maxMembers: clubData.maxMembers || 100,
        currentBook: undefined,
        icon: clubData.icon,
        owner: clubData.ownerId,
        isOfficial: false,
        rating: 4.0,
        isJoined: false,
        rules: [],
        isPublic: true,
        createdBy: clubData.ownerId,
        tags: ['general'],
        createdAt: clubData.createdAt,
        ownerId: clubData.ownerId,
        members: clubData.members,
        updatedAt: clubData.updatedAt
      }))
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

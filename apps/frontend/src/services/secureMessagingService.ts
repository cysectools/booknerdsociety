import { encryptionService } from './encryptionService'
import { securityService } from './securityService'

interface SecureMessage {
  id: string
  content: string
  senderId: string
  recipientId: string
  timestamp: number
  encrypted: boolean
  signature: string
  messageType: 'text' | 'image' | 'file'
  metadata?: any
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  encryptionKey: string
  createdAt: number
  lastMessage?: SecureMessage
}

interface MessageDeliveryStatus {
  messageId: string
  delivered: boolean
  read: boolean
  deliveredAt?: number
  readAt?: number
}

class SecureMessagingService {
  private messages = new Map<string, SecureMessage>()
  private chatRooms = new Map<string, ChatRoom>()
  private deliveryStatus = new Map<string, MessageDeliveryStatus>()
  private userRooms = new Map<string, string[]>()

  // Create secure chat room
  createChatRoom(name: string, participants: string[]): { success: boolean; roomId?: string; encryptionKey?: string } {
    try {
      const roomId = securityService.generateSecureToken(32)
      const encryptionKey = encryptionService.generateChatRoomKey(roomId)
      
      const room: ChatRoom = {
        id: roomId,
        name: securityService.sanitizeInput(name),
        participants: participants.map(p => securityService.sanitizeInput(p)),
        encryptionKey,
        createdAt: Date.now()
      }

      this.chatRooms.set(roomId, room)

      // Add room to each participant's room list
      participants.forEach(participantId => {
        const userRooms = this.userRooms.get(participantId) || []
        userRooms.push(roomId)
        this.userRooms.set(participantId, userRooms)
      })

      return { success: true, roomId, encryptionKey }
    } catch (error) {
      console.error('Chat room creation error:', error)
      return { success: false }
    }
  }

  // Send secure message
  sendMessage(content: string, recipientId: string, senderId: string, roomId?: string): { success: boolean; messageId?: string } {
    try {
      // Sanitize input
      const sanitizedContent = securityService.sanitizeInput(content)
      
      if (!sanitizedContent.trim()) {
        return { success: false }
      }

      const messageId = securityService.generateSecureToken(32)
      
      let encryptedMessage: SecureMessage

      if (roomId) {
        // Group chat message
        const room = this.chatRooms.get(roomId)
        if (!room || !room.participants.includes(senderId)) {
          return { success: false }
        }

        const encrypted = encryptionService.encryptChatMessage(sanitizedContent, roomId, senderId)
        
        encryptedMessage = {
          id: messageId,
          content: encrypted.content,
          senderId,
          recipientId: roomId,
          timestamp: encrypted.timestamp,
          encrypted: true,
          signature: encrypted.signature,
          messageType: 'text'
        }

        // Update room's last message
        room.lastMessage = encryptedMessage
      } else {
        // Direct message
        const senderKeys = this.getUserKeys(senderId)
        const recipientKeys = this.getUserKeys(recipientId)
        
        if (!senderKeys.privateKey || !recipientKeys.publicKey) {
          return { success: false }
        }

        const encrypted = encryptionService.encryptMessage(sanitizedContent, recipientKeys.publicKey, senderKeys.privateKey)
        
        encryptedMessage = {
          id: messageId,
          content: encrypted.content,
          senderId,
          recipientId,
          timestamp: encrypted.timestamp,
          encrypted: true,
          signature: encrypted.signature,
          messageType: 'text'
        }
      }

      this.messages.set(messageId, encryptedMessage)
      
      // Set delivery status
      this.deliveryStatus.set(messageId, {
        messageId,
        delivered: true,
        read: false,
        deliveredAt: Date.now()
      })

      return { success: true, messageId }
    } catch (error) {
      console.error('Message sending error:', error)
      return { success: false }
    }
  }

  // Decrypt and retrieve messages
  getMessages(userId: string, roomId?: string, limit: number = 50): SecureMessage[] {
    try {
      let messages: SecureMessage[] = []

      if (roomId) {
        // Get room messages
        const room = this.chatRooms.get(roomId)
        if (!room || !room.participants.includes(userId)) {
          return []
        }

        // Get all messages for this room
        messages = Array.from(this.messages.values())
          .filter(msg => msg.recipientId === roomId)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
      } else {
        // Get direct messages
        messages = Array.from(this.messages.values())
          .filter(msg => msg.senderId === userId || msg.recipientId === userId)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
      }

      // Decrypt messages
      return messages.map(msg => this.decryptMessage(msg, userId))
    } catch (error) {
      console.error('Message retrieval error:', error)
      return []
    }
  }

  // Decrypt individual message
  private decryptMessage(message: SecureMessage, userId: string): SecureMessage {
    try {
      if (!message.encrypted) {
        return message
      }

      let decryptedContent: string

      if (message.recipientId.startsWith('room_')) {
        // Room message
        const encryptedMessage = {
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
          recipientId: message.recipientId,
          keyId: message.recipientId,
          signature: message.signature
        }
        decryptedContent = encryptionService.decryptChatMessage(encryptedMessage, message.recipientId)
      } else {
        // Direct message
        const userKeys = this.getUserKeys(userId)
        if (!userKeys.privateKey) {
          throw new Error('User keys not found')
        }
        const encryptedMessage = {
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
          recipientId: message.recipientId,
          keyId: message.recipientId,
          signature: message.signature
        }
        decryptedContent = encryptionService.decryptMessage(encryptedMessage, userKeys.privateKey)
      }

      return {
        ...message,
        content: decryptedContent,
        encrypted: false
      }
    } catch (error) {
      console.error('Message decryption error:', error)
      return {
        ...message,
        content: '[Encrypted message - decryption failed]',
        encrypted: false
      }
    }
  }

  // Mark message as read
  markAsRead(messageId: string, _userId: string): { success: boolean } {
    try {
      const status = this.deliveryStatus.get(messageId)
      if (status) {
        status.read = true
        status.readAt = Date.now()
        this.deliveryStatus.set(messageId, status)
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      console.error('Mark as read error:', error)
      return { success: false }
    }
  }

  // Get message delivery status
  getDeliveryStatus(messageId: string): MessageDeliveryStatus | null {
    return this.deliveryStatus.get(messageId) || null
  }

  // Get user's chat rooms
  getUserRooms(userId: string): ChatRoom[] {
    const userRoomIds = this.userRooms.get(userId) || []
    return userRoomIds
      .map(roomId => this.chatRooms.get(roomId))
      .filter(room => room !== undefined) as ChatRoom[]
  }

  // Join chat room
  joinRoom(roomId: string, userId: string): { success: boolean } {
    try {
      const room = this.chatRooms.get(roomId)
      if (!room) {
        return { success: false }
      }

      if (!room.participants.includes(userId)) {
        room.participants.push(userId)
        
        const userRooms = this.userRooms.get(userId) || []
        userRooms.push(roomId)
        this.userRooms.set(userId, userRooms)
      }

      return { success: true }
    } catch (error) {
      console.error('Join room error:', error)
      return { success: false }
    }
  }

  // Leave chat room
  leaveRoom(roomId: string, userId: string): { success: boolean } {
    try {
      const room = this.chatRooms.get(roomId)
      if (!room) {
        return { success: false }
      }

      room.participants = room.participants.filter(id => id !== userId)
      
      const userRooms = this.userRooms.get(userId) || []
      this.userRooms.set(userId, userRooms.filter(id => id !== roomId))

      return { success: true }
    } catch (error) {
      console.error('Leave room error:', error)
      return { success: false }
    }
  }

  // Get user's encryption keys (placeholder)
  private getUserKeys(_userId: string): { publicKey?: string; privateKey?: string } {
    // In real implementation, this would fetch from secure storage
    return {
      publicKey: 'user_public_key_' + _userId,
      privateKey: 'user_private_key_' + _userId
    }
  }

  // Search messages securely
  searchMessages(_userId: string, query: string, roomId?: string): SecureMessage[] {
    try {
      const sanitizedQuery = securityService.sanitizeInput(query)
      if (!sanitizedQuery.trim()) {
        return []
      }

      let messages = this.getMessages(_userId, roomId, 1000) // Get more messages for search
      
      // Filter messages containing the search term
      return messages.filter(msg => 
        msg.content.toLowerCase().includes(sanitizedQuery.toLowerCase())
      )
    } catch (error) {
      console.error('Message search error:', error)
      return []
    }
  }

  // Delete message (soft delete)
  deleteMessage(messageId: string, _userId: string): { success: boolean } {
    try {
      const message = this.messages.get(messageId)
      if (!message || message.senderId !== _userId) {
        return { success: false }
      }

      // In real implementation, you'd mark as deleted rather than removing
      this.messages.delete(messageId)
      return { success: true }
    } catch (error) {
      console.error('Delete message error:', error)
      return { success: false }
    }
  }

  // Get messaging statistics
  getMessagingStats(): { totalMessages: number; totalRooms: number; activeUsers: number } {
    return {
      totalMessages: this.messages.size,
      totalRooms: this.chatRooms.size,
      activeUsers: this.userRooms.size
    }
  }
}

export const secureMessagingService = new SecureMessagingService()

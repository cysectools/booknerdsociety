import CryptoJS from 'crypto-js'

interface EncryptionKey {
  publicKey: string
  privateKey: string
  keyId: string
  createdAt: number
}

interface EncryptedMessage {
  content: string
  timestamp: number
  senderId: string
  recipientId: string
  keyId: string
  signature: string
}

class EncryptionService {
  private keyStore = new Map<string, EncryptionKey>()
  private sessionKeys = new Map<string, string>()

  // Generate RSA-like key pair (simplified for demo)
  generateKeyPair(): EncryptionKey {
    const keyId = this.generateKeyId()
    const publicKey = this.generateSecureKey(256)
    const privateKey = this.generateSecureKey(256)
    
    const keyPair: EncryptionKey = {
      publicKey,
      privateKey,
      keyId,
      createdAt: Date.now()
    }
    
    this.keyStore.set(keyId, keyPair)
    return keyPair
  }

  // Generate secure key
  private generateSecureKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let result = ''
    const randomArray = new Uint8Array(length)
    crypto.getRandomValues(randomArray)
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length]
    }
    
    return result
  }

  // Generate unique key ID
  private generateKeyId(): string {
    return 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Encrypt message with recipient's public key
  encryptMessage(content: string, recipientPublicKey: string, senderPrivateKey: string): EncryptedMessage {
    // Generate session key for this message
    const sessionKey = this.generateSecureKey(32)
    
    // Encrypt content with session key
    const encryptedContent = CryptoJS.AES.encrypt(content, sessionKey).toString()
    
    // Encrypt session key with recipient's public key (simplified)
    // Encrypt session key with recipient's public key (simplified)
    CryptoJS.AES.encrypt(sessionKey, recipientPublicKey).toString()
    
    // Create digital signature
    const signature = this.createSignature(encryptedContent, senderPrivateKey)
    
    return {
      content: encryptedContent,
      timestamp: Date.now(),
      senderId: this.getCurrentUserId(),
      recipientId: this.getRecipientId(recipientPublicKey),
      keyId: this.getKeyId(recipientPublicKey),
      signature
    }
  }

  // Decrypt message with recipient's private key
  decryptMessage(encryptedMessage: EncryptedMessage, _recipientPrivateKey: string): string {
    try {
      // Verify signature
      if (!this.verifySignature(encryptedMessage.content, encryptedMessage.signature, encryptedMessage.senderId)) {
        throw new Error('Invalid message signature')
      }
      
      // Get session key (in real implementation, this would be encrypted with recipient's private key)
      const sessionKey = this.getSessionKey(encryptedMessage.keyId)
      
      // Decrypt content
      const bytes = CryptoJS.AES.decrypt(encryptedMessage.content, sessionKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt message')
    }
  }

  // Create digital signature
  private createSignature(content: string, privateKey: string): string {
    return CryptoJS.HmacSHA256(content, privateKey).toString()
  }

  // Verify digital signature
  private verifySignature(content: string, signature: string, senderId: string): boolean {
    // In real implementation, you'd get sender's public key
    const senderPublicKey = this.getSenderPublicKey(senderId)
    const expectedSignature = CryptoJS.HmacSHA256(content, senderPublicKey).toString()
    return expectedSignature === signature
  }

  // Get current user ID (placeholder)
  private getCurrentUserId(): string {
    return localStorage.getItem('current_user_id') || 'anonymous'
  }

  // Get recipient ID from public key (placeholder)
  private getRecipientId(publicKey: string): string {
    // In real implementation, this would be a lookup
    return 'recipient_' + publicKey.substring(0, 8)
  }

  // Get key ID from public key (placeholder)
  private getKeyId(publicKey: string): string {
    return 'key_' + publicKey.substring(0, 8)
  }

  // Get session key (placeholder)
  private getSessionKey(keyId: string): string {
    return this.sessionKeys.get(keyId) || this.generateSecureKey(32)
  }

  // Get sender's public key (placeholder)
  private getSenderPublicKey(senderId: string): string {
    // In real implementation, this would be a lookup
    return 'sender_public_key_' + senderId
  }

  // Generate secure chat room key
  generateChatRoomKey(roomId: string): string {
    const roomKey = this.generateSecureKey(64)
    this.sessionKeys.set(roomId, roomKey)
    return roomKey
  }

  // Encrypt chat message
  encryptChatMessage(content: string, roomId: string, senderId: string): EncryptedMessage {
    const roomKey = this.sessionKeys.get(roomId) || this.generateChatRoomKey(roomId)
    const encryptedContent = CryptoJS.AES.encrypt(content, roomKey).toString()
    const signature = this.createSignature(encryptedContent, roomKey)
    
    return {
      content: encryptedContent,
      timestamp: Date.now(),
      senderId,
      recipientId: roomId,
      keyId: roomId,
      signature
    }
  }

  // Decrypt chat message
  decryptChatMessage(encryptedMessage: EncryptedMessage, roomId: string): string {
    try {
      const roomKey = this.sessionKeys.get(roomId)
      if (!roomKey) {
        throw new Error('Room key not found')
      }
      
      // Verify signature
      const expectedSignature = this.createSignature(encryptedMessage.content, roomKey)
      if (expectedSignature !== encryptedMessage.signature) {
        throw new Error('Invalid message signature')
      }
      
      const bytes = CryptoJS.AES.decrypt(encryptedMessage.content, roomKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Chat decryption error:', error)
      throw new Error('Failed to decrypt chat message')
    }
  }

  // Secure key exchange (simplified)
  performKeyExchange(recipientId: string): { success: boolean; sharedKey?: string } {
    try {
      // Generate shared secret
      const sharedKey = this.generateSecureKey(256)
      
      // Store shared key securely
      this.sessionKeys.set(`exchange_${recipientId}`, sharedKey)
      
      return { success: true, sharedKey }
    } catch (error) {
      console.error('Key exchange error:', error)
      return { success: false }
    }
  }

  // Clean up expired keys
  cleanupExpiredKeys(): void {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    for (const [keyId, key] of this.keyStore.entries()) {
      if (now - key.createdAt > maxAge) {
        this.keyStore.delete(keyId)
      }
    }
  }

  // Get encryption status
  getEncryptionStatus(): { isEnabled: boolean; keyCount: number; sessionCount: number } {
    return {
      isEnabled: true,
      keyCount: this.keyStore.size,
      sessionCount: this.sessionKeys.size
    }
  }
}

export const encryptionService = new EncryptionService()

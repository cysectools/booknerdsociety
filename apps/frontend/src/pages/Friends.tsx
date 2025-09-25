import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Search, Plus, MessageCircle, BookOpen, Star, Clock } from 'lucide-react'

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('')
  const [friends] = useState([
    {
      id: 1,
      username: 'BookLover42',
      avatar: '',
      isOnline: true,
      booksRead: 23,
      favoriteGenre: 'Fantasy',
      lastActive: '2 minutes ago',
      currentBook: 'The Hobbit'
    },
    {
      id: 2,
      username: 'ReadingQueen',
      avatar: '',
      isOnline: false,
      booksRead: 67,
      favoriteGenre: 'Romance',
      lastActive: '1 hour ago',
      currentBook: 'Pride and Prejudice'
    },
    {
      id: 3,
      username: 'SciFiFan',
      avatar: '',
      isOnline: true,
      booksRead: 45,
      favoriteGenre: 'Science Fiction',
      lastActive: '5 minutes ago',
      currentBook: 'Dune'
    },
    {
      id: 4,
      username: 'MysteryReader',
      avatar: '',
      isOnline: false,
      booksRead: 89,
      favoriteGenre: 'Mystery',
      lastActive: '3 hours ago',
      currentBook: 'The Girl with the Dragon Tattoo'
    }
  ])

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your <span className="gradient-text">Friends</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with fellow book lovers and share your reading journey
          </p>
          <button className="btn-primary flex items-center gap-2 mx-auto">
            <Plus className="h-5 w-5" />
            Add Friends
          </button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Friends Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{friend.username}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {friend.lastActive}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{friend.booksRead} books read</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4" />
                  <span>Favorite: {friend.favoriteGenre}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Currently reading:</span> {friend.currentBook}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-primary">
                  View Profile
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredFriends.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No friends found</h3>
            <p className="text-gray-500">Try searching for a different username</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

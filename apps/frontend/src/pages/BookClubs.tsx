import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Search, Filter, Star, MessageCircle } from 'lucide-react'

export default function BookClubs() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleClubClick = (clubId: string) => {
    navigate(`/clubs/${clubId}`)
  }
  const [clubs] = useState([
    {
      id: 'booknerdsociety',
      name: 'BookNerdSociety',
      description: 'The official BookNerdSociety club for all book lovers! Join discussions, share recommendations, and discover your next favorite read.',
      memberCount: 1,
      maxMembers: 1000,
      currentBook: 'The Great Gatsby',
      icon: '📚',
      rating: 4.9,
      isJoined: true,
      isOfficial: true
    },
    {
      id: 1,
      name: 'Fantasy Readers',
      description: 'A community for fantasy book lovers to discuss magical worlds and epic adventures.',
      memberCount: 156,
      maxMembers: 200,
      currentBook: 'The Name of the Wind',
      icon: '🧙‍♂️',
      rating: 4.8,
      isJoined: true
    },
    {
      id: 2,
      name: 'Sci-Fi Enthusiasts',
      description: 'Exploring the universe through science fiction literature and futuristic concepts.',
      memberCount: 89,
      maxMembers: 150,
      currentBook: 'Dune',
      icon: '🚀',
      rating: 4.6,
      isJoined: false
    },
    {
      id: 3,
      name: 'Mystery & Thriller',
      description: 'Unraveling mysteries and solving crimes through gripping thriller novels.',
      memberCount: 203,
      maxMembers: 250,
      currentBook: 'Gone Girl',
      icon: '🕵️‍♀️',
      rating: 4.9,
      isJoined: true
    },
    {
      id: 4,
      name: 'Romance Readers',
      description: 'Sharing love stories and heartwarming romance novels with fellow readers.',
      memberCount: 134,
      maxMembers: 180,
      currentBook: 'The Seven Husbands of Evelyn Hugo',
      icon: '💕',
      rating: 4.7,
      isJoined: false
    }
  ])

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Book <span className="gradient-text">Clubs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join vibrant communities of readers and discover your next favorite book
          </p>
          <button className="btn-primary flex items-center gap-2 mx-auto">
            <Plus className="h-5 w-5" />
            Create New Club
          </button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search book clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="glass-effect px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`club-card cursor-pointer hover:scale-105 transition-all duration-300 ${club.isOfficial ? 'ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-primary-100' : ''}`}
              onClick={() => handleClubClick(String(club.id))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{club.icon}</div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{club.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{club.name}</h3>
                {club.isOfficial && (
                  <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                    Official
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{club.memberCount}/{club.maxMembers} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>Currently reading: {club.currentBook}</span>
                </div>
              </div>

              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    club.isJoined
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'btn-primary'
                  }`}
                >
                  {club.isJoined ? 'Leave Club' : 'Join Club'}
                </button>
                <button className="glass-effect p-2 rounded-xl hover:scale-105 transition-all duration-300">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredClubs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No clubs found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new club</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

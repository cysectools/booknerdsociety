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
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&crop=center',
      rating: 4.7,
      isJoined: false
    },
    {
      id: 5,
      name: 'Classic Literature',
      description: 'Exploring timeless classics and literary masterpieces from around the world.',
      memberCount: 98,
      maxMembers: 120,
      currentBook: 'Pride and Prejudice',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
      rating: 4.8,
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                club.isOfficial ? 'ring-2 ring-primary-500' : ''
              }`}
              whileHover={{ y: -5 }}
            >
              {/* Club Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-semibold">{club.rating}</span>
                </div>
                {club.isOfficial && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                      Official
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Users className="h-4 w-4" />
                      <span>{club.memberCount}/{club.maxMembers} members</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Club Content */}
              <div className="p-6">
                {/* Club Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{club.name}</h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{club.description}</p>
                
                {/* Current Book */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <MessageCircle className="h-4 w-4" />
                  <span>Currently reading: <strong>{club.currentBook}</strong></span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      club.isJoined
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'btn-primary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle join/leave logic here
                    }}
                  >
                    {club.isJoined ? 'Leave Club' : 'Join Club'}
                  </button>
                  <button 
                    className="glass-effect p-3 rounded-xl hover:scale-105 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClubClick(String(club.id))
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
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

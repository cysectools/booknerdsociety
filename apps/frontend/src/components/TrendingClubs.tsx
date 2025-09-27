import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, Flame, MessageCircle, Star } from 'lucide-react'
import { BookClub } from '../types'

export default function TrendingClubs() {
  const [clubs, setClubs] = useState<BookClub[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleJoinClub = (clubId: string) => {
    navigate(`/clubs/${clubId}`)
  }

  const loadClubs = async () => {
    setLoading(true)
    try {
      // Mock trending clubs data
      const mockClubs: BookClub[] = [
        {
          id: '1',
          name: 'Fantasy Readers',
          description: 'A community for fantasy book lovers to discuss magical worlds and epic adventures.',
          icon: '🧙‍♂️',
          memberCount: 156,
          maxMembers: 200,
          status: 'active',
          ownerId: '1',
          members: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Sci-Fi Enthusiasts',
          description: 'Exploring the universe through science fiction literature and futuristic concepts.',
          icon: '🚀',
          memberCount: 89,
          maxMembers: 150,
          status: 'active',
          ownerId: '2',
          members: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Mystery & Thriller',
          description: 'Unraveling mysteries and solving crimes through gripping thriller novels.',
          icon: '🕵️‍♀️',
          memberCount: 203,
          maxMembers: 250,
          status: 'active',
          ownerId: '3',
          members: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          name: 'Romance Readers',
          description: 'Sharing love stories and heartwarming romance novels with fellow readers.',
          icon: '💕',
          memberCount: 134,
          maxMembers: 180,
          status: 'active',
          ownerId: '4',
          members: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setClubs(mockClubs)
    } catch (error) {
      console.error('Error loading clubs:', error)
      setClubs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClubs()
  }, [])

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Flame className="h-6 w-6 text-primary-600" />
          Trending Book Clubs
        </h2>
      </div>

      {/* Clubs Container */}
      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-scroll hover:pause-animation">
          {loading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : clubs.length === 0 ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No trending clubs available</p>
                <p className="text-sm text-gray-400">Check back later for new clubs</p>
              </div>
            </div>
          ) : (
            [...clubs, ...clubs].map((club, index) => (
              <motion.div
                key={`${club.id || index}-${Math.floor(index / clubs.length)}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="club-card min-w-[280px] max-w-[280px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{club.icon}</div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{club.memberCount}/{club.maxMembers} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>Currently reading: The Great Gatsby</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button 
                    onClick={() => handleJoinClub(club.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ 
                      scale: 0.98,
                      rotateY: 5,
                      transition: { duration: 0.1 }
                    }}
                    className="flex-1 btn-primary text-sm relative overflow-hidden group"
                  >
                    <motion.div
                      whileTap={{
                        rotateY: 8,
                        transition: { duration: 0.2 }
                      }}
                    >
                      Join Club
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileTap={{ x: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-effect p-2 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

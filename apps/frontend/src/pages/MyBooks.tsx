import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Plus, Search, Filter, Heart, Bookmark } from 'lucide-react'

export default function MyBooks() {
  const [activeTab, setActiveTab] = useState('reading')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [books] = useState({
    reading: [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: '',
        progress: 65,
        rating: 0,
        genre: 'Classic Literature'
      },
      {
        id: 2,
        title: 'Dune',
        author: 'Frank Herbert',
        cover: '',
        progress: 30,
        rating: 0,
        genre: 'Science Fiction'
      }
    ],
    read: [
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        cover: '',
        progress: 100,
        rating: 5,
        genre: 'Dystopian Fiction'
      },
      {
        id: 4,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: '',
        progress: 100,
        rating: 4,
        genre: 'Classic Literature'
      }
    ],
    wishlist: [
      {
        id: 5,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        cover: '',
        progress: 0,
        rating: 0,
        genre: 'Fantasy'
      },
      {
        id: 6,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: '',
        progress: 0,
        rating: 0,
        genre: 'Romance'
      }
    ]
  })

  const tabs = [
    { id: 'reading', label: 'Currently Reading', count: books.reading.length },
    { id: 'read', label: 'Read', count: books.read.length },
    { id: 'wishlist', label: 'Wishlist', count: books.wishlist.length }
  ]

  const currentBooks = books[activeTab as keyof typeof books]
  const filteredBooks = currentBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
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
            My <span className="gradient-text">Books</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your reading progress and manage your personal library
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'glass-effect hover:scale-105'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Book
            </button>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="book-card"
            >
              <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={book.cover || '/placeholder-book.jpg'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <p className="text-sm text-gray-500 mb-4">{book.genre}</p>

              {/* Progress Bar */}
              {activeTab === 'reading' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Rating */}
              {activeTab === 'read' && book.rating > 0 && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {activeTab === 'reading' && (
                  <button className="flex-1 btn-primary text-sm">
                    Update Progress
                  </button>
                )}
                {activeTab === 'read' && (
                  <button className="flex-1 btn-secondary text-sm">
                    Rate Book
                  </button>
                )}
                {activeTab === 'wishlist' && (
                  <button className="flex-1 btn-primary text-sm">
                    Start Reading
                  </button>
                )}
                <button className="p-2 glass-effect rounded-lg hover:scale-105 transition-all duration-300">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="p-2 glass-effect rounded-lg hover:scale-105 transition-all duration-300">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {activeTab === 'reading' && 'No books currently reading'}
              {activeTab === 'read' && 'No books read yet'}
              {activeTab === 'wishlist' && 'No books in wishlist'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'reading' && 'Start reading a book to see it here'}
              {activeTab === 'read' && 'Finish reading a book to see it here'}
              {activeTab === 'wishlist' && 'Add books to your wishlist to see them here'}
            </p>
            <button className="btn-primary">
              <Plus className="inline h-4 w-4 mr-2" />
              Add Your First Book
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

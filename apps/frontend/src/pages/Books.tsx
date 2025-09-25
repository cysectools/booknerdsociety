import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Star, Filter, X, Calendar, User, Globe } from 'lucide-react'
import { booksService } from '../services/booksService'
import { Book } from '../types'

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showModal, setShowModal] = useState(false)

  const loadInitialBooks = async () => {
    setLoading(true)
    try {
      const initialBooks = await booksService.getRecommendedBooks(20)
      setBooks(initialBooks)
    } catch (error) {
      console.error('Error loading initial books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const searchResults = await booksService.searchBooks(searchQuery, 20)
      setBooks(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
  }

  useEffect(() => {
    loadInitialBooks()
  }, [])

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
            Discover <span className="gradient-text">Amazing Books</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your next favorite read from millions of books
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for books, authors, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button className="glass-effect px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300">
            <Filter className="inline h-4 w-4 mr-2" />
            All Genres
          </button>
          <button className="glass-effect px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300">
            <Star className="inline h-4 w-4 mr-2" />
            Top Rated
          </button>
          <button className="glass-effect px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300">
            <BookOpen className="inline h-4 w-4 mr-2" />
            New Releases
          </button>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
              <p className="text-gray-500">Try searching for a book to get started</p>
            </div>
          ) : (
            books.map((book: any, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="book-card cursor-pointer"
                onClick={() => handleBookClick(book)}
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
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{book.rating || '4.5'}</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Book Details Modal */}
      {showModal && selectedBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img
                  src={selectedBook.cover || '/placeholder-book.jpg'}
                  alt={selectedBook.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{selectedBook.rating || 'N/A'}</span>
                  <span className="text-gray-500">({selectedBook.rating ? 'Rating' : 'No rating available'})</span>
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Published: {selectedBook.year || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedBook.pages || 'Unknown'} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Genre: {selectedBook.genre || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Language: {selectedBook.language || 'Unknown'}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedBook.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedBook.description.length > 300 
                        ? `${selectedBook.description.substring(0, 300)}...` 
                        : selectedBook.description
                      }
                    </p>
                  </div>
                )}

                {/* Publisher */}
                {selectedBook.publisher && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Publisher</h3>
                    <p className="text-gray-700">{selectedBook.publisher}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    Add to Wishlist
                  </button>
                  <button className="btn-secondary flex-1">
                    Add to Reading List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

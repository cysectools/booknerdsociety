import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Star, Filter, X, Calendar, User, Globe, RefreshCw } from 'lucide-react'
import { realBookService } from '../services/realBookService'
import { Book } from '../types'
import { useBooksStore } from '../stores/booksStore'

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'top-rated' | 'new-releases'>('all')
  const [hasMore, setHasMore] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState<Set<string>>(new Set())
  const [addedToReadingList, setAddedToReadingList] = useState<Set<string>>(new Set())
  
  const { addToWishlist, addToReadingList } = useBooksStore()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const loadInitialBooks = async () => {
    setLoading(true)
    setHasMore(true)
    try {
      const initialBooks = await realBookService.getRecommendedBooks(20)
      setFilteredBooks(initialBooks)
    } catch (error) {
      console.error('Error loading initial books:', error)
      setFilteredBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setIsSearching(true)
    setHasMore(false) // Disable infinite scroll for search
    try {
      const searchResults = await realBookService.searchBooks(searchQuery, 20)
      setFilteredBooks(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setFilteredBooks([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = async (filter: 'all' | 'top-rated' | 'new-releases') => {
    setActiveFilter(filter)
    setLoading(true)
    setIsSearching(false)
    setHasMore(true)
    
    try {
      let newBooks: Book[] = []
      
      switch (filter) {
        case 'top-rated':
          newBooks = await realBookService.getTopRatedBooks(20)
          break
        case 'new-releases':
          newBooks = await realBookService.getNewReleases(20)
          break
        case 'all':
        default:
          newBooks = await realBookService.getRecommendedBooks(20)
          break
      }
      
      setFilteredBooks(newBooks)
    } catch (error) {
      console.error('Filter error:', error)
      setFilteredBooks([])
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

  const handleAddToWishlist = async (book: Book) => {
    try {
      await addToWishlist(book)
      setAddedToWishlist(prev => new Set([...prev, book.id]))
      console.log('Added to wishlist:', book.title)
      
      // Reset animation after 2 seconds
      setTimeout(() => {
        setAddedToWishlist(prev => {
          const newSet = new Set(prev)
          newSet.delete(book.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  const handleAddToReadingList = async (book: Book) => {
    try {
      await addToReadingList(book)
      setAddedToReadingList(prev => new Set([...prev, book.id]))
      console.log('Added to reading list:', book.title)
      
      // Reset animation after 2 seconds
      setTimeout(() => {
        setAddedToReadingList(prev => {
          const newSet = new Set(prev)
          newSet.delete(book.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Error adding to reading list:', error)
    }
  }

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore || isSearching) return
    
    setLoadingMore(true)
    try {
      // For real book service, we'll just reload the same books
      // In a real implementation, you'd implement pagination
      let newBooks: Book[] = []
      
      switch (activeFilter) {
        case 'top-rated':
          newBooks = await realBookService.getTopRatedBooks(20)
          break
        case 'new-releases':
          newBooks = await realBookService.getNewReleases(20)
          break
        case 'all':
        default:
          newBooks = await realBookService.getRecommendedBooks(20)
          break
      }
      
      setFilteredBooks(newBooks)
      setHasMore(false) // Disable infinite scroll for now
    } catch (error) {
      console.error('Error loading more books:', error)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleRefresh = async () => {
    setSearchQuery('')
    setIsSearching(false)
    setHasMore(true)
    await loadInitialBooks()
  }

  // Infinite scroll observer
  const lastBookElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isSearching) {
        loadMoreBooks()
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [loadingMore, hasMore, isSearching])

  useEffect(() => {
    loadInitialBooks()
  }, [])

  // Real-time search effect
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch()
      } else if (isSearching) {
        // Reset to initial books when search is cleared
        loadInitialBooks()
      }
    }, 300) // 300ms delay for debouncing

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

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
                  placeholder="Search for books, authors, or genres... (real-time)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <motion.button
                onClick={handleRefresh}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center gap-2"
                title="Refresh books"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
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
          <motion.button 
            onClick={() => applyFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                : 'glass-effect hover:scale-105'
            }`}
          >
            <Filter className="inline h-4 w-4 mr-2" />
            All Genres
          </motion.button>
          <motion.button 
            onClick={() => applyFilter('top-rated')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              activeFilter === 'top-rated' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                : 'glass-effect hover:scale-105'
            }`}
          >
            <Star className="inline h-4 w-4 mr-2" />
            Top Rated
          </motion.button>
          <motion.button 
            onClick={() => applyFilter('new-releases')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              activeFilter === 'new-releases' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                : 'glass-effect hover:scale-105'
            }`}
          >
            <BookOpen className="inline h-4 w-4 mr-2" />
            New Releases
          </motion.button>
        </motion.div>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-lg">Loading books...</span>
            </div>
          </motion.div>
        )}

        {/* Books Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
          {filteredBooks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
              <p className="text-gray-500">
                {activeFilter === 'top-rated' 
                  ? 'No highly rated books found' 
                  : activeFilter === 'new-releases' 
                    ? 'No recent releases found' 
                    : 'Try searching for a book to get started'
                }
              </p>
            </div>
          ) : (
            filteredBooks.map((book: any, index) => {
              const isLastBook = index === filteredBooks.length - 1
              return (
                <motion.div
                  key={book.id || index}
                  ref={isLastBook ? lastBookElementRef : null}
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
              )
            })
          )}
          </motion.div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span>Loading more books...</span>
            </div>
          </motion.div>
        )}

        {/* End of Results */}
        {!hasMore && filteredBooks.length > 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>You've reached the end! No more books to load.</p>
          </motion.div>
        )}
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
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <motion.button 
                    onClick={() => handleAddToWishlist(selectedBook)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedToWishlist.has(selectedBook.id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'btn-primary'
                    }`}
                    animate={addedToWishlist.has(selectedBook.id) ? {
                      scale: [1, 1.05, 1],
                      backgroundColor: ['#3b82f6', '#10b981', '#3b82f6']
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={addedToWishlist.has(selectedBook.id) ? {
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <Star className="h-4 w-4" />
                    </motion.div>
                    {addedToWishlist.has(selectedBook.id) ? 'Added to Wishlist!' : 'Add to Wishlist'}
                  </motion.button>
                  <motion.button 
                    onClick={() => handleAddToReadingList(selectedBook)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedToReadingList.has(selectedBook.id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'btn-secondary'
                    }`}
                    animate={addedToReadingList.has(selectedBook.id) ? {
                      scale: [1, 1.05, 1],
                      backgroundColor: ['#6b7280', '#10b981', '#6b7280']
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={addedToReadingList.has(selectedBook.id) ? {
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </motion.div>
                    {addedToReadingList.has(selectedBook.id) ? 'Added to Reading List!' : 'Add to Reading List'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

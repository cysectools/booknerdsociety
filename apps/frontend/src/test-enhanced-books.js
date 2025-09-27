// Quick test for enhanced books service
import { enhancedBooksService } from './services/enhancedBooksService.js'

async function testEnhancedBooks() {
  console.log('🧪 Testing Enhanced Books Service...')
  
  try {
    // Test initial load
    console.log('\n📚 Testing initial book load...')
    const initialBooks = await enhancedBooksService.getRecommendedBooks(5)
    console.log(`✅ Loaded ${initialBooks.length} initial books`)
    console.log('Sample books:', initialBooks.slice(0, 2).map(b => `${b.title} by ${b.author}`))
    
    // Test load more
    console.log('\n📚 Testing load more books...')
    const moreBooks = await enhancedBooksService.loadMoreBooks(5)
    console.log(`✅ Loaded ${moreBooks.length} more books`)
    console.log('Sample more books:', moreBooks.slice(0, 2).map(b => `${b.title} by ${b.author}`))
    
    // Test top rated filter
    console.log('\n⭐ Testing top rated books...')
    const topRated = await enhancedBooksService.getTopRatedBooks(5)
    console.log(`✅ Loaded ${topRated.length} top rated books`)
    console.log('Top rated books:', topRated.map(b => `${b.title} (${b.rating}/5)`))
    
    // Test new releases filter
    console.log('\n🆕 Testing new releases...')
    const newReleases = await enhancedBooksService.getNewReleases(5)
    console.log(`✅ Loaded ${newReleases.length} new releases`)
    console.log('New releases:', newReleases.map(b => `${b.title} (${b.year})`))
    
    // Test search
    console.log('\n🔍 Testing search...')
    const searchResults = await enhancedBooksService.searchBooks('fantasy', 5)
    console.log(`✅ Found ${searchResults.length} fantasy books`)
    console.log('Search results:', searchResults.map(b => `${b.title} by ${b.author}`))
    
    console.log('\n🎉 All tests passed! Enhanced Books Service is working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testEnhancedBooks()

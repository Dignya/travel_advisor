import { NextRequest, NextResponse } from 'next/server'

const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1'

// Mock Wikipedia data for fallback
const getMockWikipediaData = (query: string) => {
  const mockSummaries = {
    'paris': 'Paris is the capital and most populous city of France. Situated on the Seine River, in the heart of the Île-de-France region, it is one of the world\'s leading centers for art, fashion, gastronomy, and culture.',
    'tokyo': 'Tokyo is the capital and most populous city of Japan. A bustling metropolis that blends ultramodern and traditional elements, from neon-lit skyscrapers to historic temples.',
    'bali': 'Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands. East of Java and west of Lombok, the province includes the island of Bali and a few smaller neighbouring islands.',
    'default': `${query} is a popular travel destination known for its unique culture, beautiful landscapes, and rich history. Visitors can enjoy local cuisine, explore historical sites, and experience the authentic atmosphere of this remarkable place.`
  }
  
  const key = query.toLowerCase()
  const summary = mockSummaries[key as keyof typeof mockSummaries] || mockSummaries.default
  
  return {
    title: query,
    displayTitle: query,
    extract: summary,
    extractHtml: null,
    thumbnail: null,
    originalImage: null,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
    lang: 'en',
    timestamp: new Date().toISOString(),
    mock: true // Flag to indicate this is mock data
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const title = searchParams.get('title')

    if (!query && !title) {
      return NextResponse.json(
        { error: 'Missing required parameters: query or title' },
        { status: 400 }
      )
    }

    let wikipediaData: any
    const searchTerm = query || title

    if (query) {
      // Search for articles
      const searchUrl = `${WIKIPEDIA_BASE_URL}/page/summary/${encodeURIComponent(query)}`
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'SmartTravelAdvisor/1.0'
        }
      })

      if (!searchResponse.ok) {
        // If direct summary fails, try search first
        const searchResultsUrl = `${WIKIPEDIA_BASE_URL}/page/search/${encodeURIComponent(query)}`
        const searchResultsResponse = await fetch(searchResultsUrl, {
          headers: {
            'User-Agent': 'SmartTravelAdvisor/1.0'
          }
        })

        if (searchResultsResponse.ok) {
          const searchData = await searchResultsResponse.json()
          if (searchData.pages && searchData.pages.length > 0) {
            // Get summary of the first search result
            const firstResult = searchData.pages[0]
            const summaryUrl = `${WIKIPEDIA_BASE_URL}/page/summary/${encodeURIComponent(firstResult.title)}`
            const summaryResponse = await fetch(summaryUrl, {
              headers: {
                'User-Agent': 'SmartTravelAdvisor/1.0'
              }
            })

            if (summaryResponse.ok) {
              wikipediaData = await summaryResponse.json()
            } else {
              throw new Error('Failed to fetch Wikipedia summary')
            }
          } else {
            throw new Error('No Wikipedia articles found')
          }
        } else {
          throw new Error('Failed to search Wikipedia')
        }
      } else {
        wikipediaData = await searchResponse.json()
      }
    } else if (title) {
      // Get summary by title
      const summaryUrl = `${WIKIPEDIA_BASE_URL}/page/summary/${encodeURIComponent(title)}`
      const summaryResponse = await fetch(summaryUrl, {
        headers: {
          'User-Agent': 'SmartTravelAdvisor/1.0'
        }
      })

      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch Wikipedia summary')
      }

      wikipediaData = await summaryResponse.json()
    }

    // Transform the response to a cleaner format
    const transformedData = {
      title: wikipediaData.title,
      displayTitle: wikipediaData.displaytitle || wikipediaData.title,
      extract: wikipediaData.extract || 'No summary available.',
      extractHtml: wikipediaData.extract_html || null,
      thumbnail: wikipediaData.thumbnail ? {
        source: wikipediaData.thumbnail.source,
        width: wikipediaData.thumbnail.width,
        height: wikipediaData.thumbnail.height
      } : null,
      originalImage: wikipediaData.originalimage ? {
        source: wikipediaData.originalimage.source,
        width: wikipediaData.originalimage.width,
        height: wikipediaData.originalimage.height
      } : null,
      url: wikipediaData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaData.title)}`,
      lang: wikipediaData.lang || 'en',
      timestamp: new Date().toISOString(),
      mock: false // Flag to indicate this is real data
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Wikipedia API error:', error)
    // Fallback to mock data if API fails
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const title = searchParams.get('title')
    const searchTerm = query || title || 'Unknown'
    
    console.log('Wikipedia API failed, using mock data as fallback')
    const mockData = getMockWikipediaData(searchTerm)
    return NextResponse.json(mockData)
  }
}
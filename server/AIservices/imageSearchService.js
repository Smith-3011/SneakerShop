import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Cache to store image results and minimize API calls
const imageCache = {};

// Using Google Custom Search JSON API (100 searches per day free)
// Create a free account at https://developers.google.com/custom-search/v1/overview
// and get your API key and Search Engine ID (cx)
const GOOGLE_CUSTOM_SEARCH_KEY = process.env.GOOGLE_CUSTOM_SEARCH_KEY || 'demo_google_search_key';
const GOOGLE_CUSTOM_SEARCH_CX = process.env.GOOGLE_CUSTOM_SEARCH_CX || 'demo_google_search_cx';

/**
 * Searches for an image of a specific sneaker model using Google Custom Search API
 * @param {string} query - The sneaker name to search for
 * @returns {Promise<string>} - URL of the found image
 */
export const searchSneakerImage = async (query) => {
  try {
    // Check cache first to avoid unnecessary API calls
    if (imageCache[query]) {
      console.log(`Returning cached image for: "${query}"`);
      return imageCache[query];
    }

    // Format the query for better results
    const formattedQuery = `${query} sneakers shoes`;
    
    console.log(`Searching Google for: "${formattedQuery}"`);
    
    // Make the API request to Google Custom Search
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_CUSTOM_SEARCH_KEY,
        cx: GOOGLE_CUSTOM_SEARCH_CX,
        q: formattedQuery,
        searchType: 'image',
        num: 1,
        imgSize: 'large',
        safe: 'active'
      }
    });

    // Check if we got results
    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      
      // Cache the result for future use
      imageCache[query] = imageUrl;
      
      console.log(`Found image for "${query}": ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`No image found for "${query}" on Google`);
    return null;
  } catch (error) {
    console.error(`Error searching for image: ${error.message}`);
    return null;
  }
};

/**
 * Alternative implementation using Pexels API (also free)
 * Create an account at https://www.pexels.com/api/
 */
export const searchSneakerImagePexels = async (query) => {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'demo_pexels_api_key';
    
    // Check cache first
    if (imageCache[query]) {
      return imageCache[query];
    }
    
    const formattedQuery = `${query} sneakers`;
    
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query: formattedQuery,
        per_page: 1
      },
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (response.data.photos && response.data.photos.length > 0) {
      const imageUrl = response.data.photos[0].src.large;
      imageCache[query] = imageUrl;
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching Pexels: ${error.message}`);
    return null;
  }
};

// Fallback to a free image placeholder service if API calls fail
export const getPlaceholderImage = (sneakerName) => {
  // Create a hash of the sneaker name to get different images
  const hash = sneakerName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0) % 1000;
  
  // Use placeholder.com (completely free, no API key required)
  return `https://placehold.co/600x400/232323/FFFFFF?text=${encodeURIComponent(sneakerName)}`;
};

export default searchSneakerImage; 
import searchSneakerImage, { getPlaceholderImage } from '../AIservices/imageSearchService.js';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils.js';

/**
 * Controller to handle sneaker image search requests
 * Uses a hybrid approach:
 * 1. First tries to find a match in our local catalog
 * 2. If not found, searches online using Google Custom Search API
 * 3. Falls back to placeholder if both fail
 */
const getSneakerImage = async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ 
      message: "Search query is required",
      success: false 
    });
  }

  try {
    console.log(`Processing image search for: ${query}`);
    
    // Step 1: Try to find a match in our local catalog first (fastest)
    try {
      const localImage = getImageForProduct(query);
      
      // If we have a local match, return it along with source info
      if (localImage) {
        return res.json({
          imageUrl: localImage,
          source: 'local',
          success: true
        });
      }
    } catch (localError) {
      console.log(`No local image match found: ${localError.message}`);
      // Continue to web search if local fails
    }
    
    // Step 2: Search online using Google Custom Search API
    const imageUrl = await searchSneakerImage(query);
    
    if (imageUrl) {
      return res.json({
        imageUrl,
        source: 'google',
        success: true
      });
    }
    
    // Step 3: Fall back to placeholder if both fail
    const placeholderUrl = getPlaceholderImage(query);
    
    return res.json({
      imageUrl: placeholderUrl,
      source: 'placeholder',
      success: true,
      message: 'Using placeholder image as fallback'
    });
    
  } catch (error) {
    console.error("Error processing image search:", error);
    
    // In case of any error, return a fallback image
    res.status(500).json({ 
      message: "Error processing image search", 
      error: error.message,
      imageUrl: getDefaultImage(),
      source: 'default',
      success: false
    });
  }
};

export default getSneakerImage; 
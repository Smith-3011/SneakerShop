/**
 * Server-side image utilities 
 * (simplified version of client-side utility to provide local image matching)
 */

// Default brand-model associations (simplified for the server)
const BRAND_MODELS = {
  'yeezy': ['boost', 'slide', '450', '700'],
  'nike': ['dunk', 'air force', 'air max', 'zoom', 'vomero'],
  'jordan': ['1', '4', 'retro', 'high', 'mid', 'low'],
  'adidas': ['ultraboost', 'stan smith', 'superstar', 'forum', 'samba'],
  'puma': ['rs-x', 'rs-dreamer', 'suede'],
  'new balance': ['550', '990', '991', '992', '327'],
  'converse': ['chuck taylor', 'all star', 'one star'],
  'vans': ['old skool', 'sk8', 'authentic', 'era'],
  'reebok': ['club c', 'classic', 'question']
};

// Special terms that help identify specific models
const SPECIAL_MODELS = [
  'travis scott', 'fragment', 'off-white', 'union', 'lot 45',
  'panda', 'unc', 'michigan', 'chicago', 'starfish', 'wolf grey',
  'oreo', 'zebra', 'beluga', 'natural', 'black red'
];

/**
 * Returns details about a sneaker based on its name
 * Used by the image search service to provide context for images
 */
export const getSneakerDetails = (sneakerName) => {
  if (!sneakerName) return { brand: null, model: null, specialTerms: [] };
  
  const normalizedName = sneakerName.toLowerCase().trim();
  let brand = null;
  let model = null;
  const specialTerms = [];
  
  // Find the brand
  for (const [brandName, models] of Object.entries(BRAND_MODELS)) {
    if (normalizedName.includes(brandName)) {
      brand = brandName;
      
      // Find the model
      for (const modelName of models) {
        if (normalizedName.includes(modelName)) {
          model = modelName;
          break;
        }
      }
      
      break;
    }
  }
  
  // Find special terms
  for (const term of SPECIAL_MODELS) {
    if (normalizedName.includes(term)) {
      specialTerms.push(term);
    }
  }
  
  return {
    brand,
    model,
    specialTerms,
    hasSpecificIdentifiers: specialTerms.length > 0
  };
};

/**
 * Server-side implementation of getImageForProduct
 * Returns a relative path to a matching local image if one exists
 */
export const getImageForProduct = (title) => {
  const details = getSneakerDetails(title);
  
  // We're only checking if we have a matching local image
  // The actual image files are on the client side, so we just return a boolean
  if (details.brand && (details.model || details.specialTerms.length > 0)) {
    return true; // Indicates we have a likely match in our catalog
  }
  
  return false; // No matching local image
};

/**
 * Returns a default placeholder for unknown sneakers
 */
export const getDefaultImage = () => {
  return '/default-sneaker.png'; // Path to a default image
}; 
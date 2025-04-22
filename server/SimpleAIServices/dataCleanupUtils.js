/**
 * Special data cleanup utilities for the AI sneaker data
 */

/**
 * Fixes common formatting issues with the AI-generated sneaker data
 * - Removes duplicate brand names (e.g., "Brand: NikeNike")
 * - Fixes hyphenation issues (e.g., "long term" to "long-term")
 * - Cleans up price ranges and dollar signs
 * @param {string} text - The raw AI response text
 * @returns {string} - The cleaned up text
 */
export const cleanupSneakerData = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Fix duplicate brand names
  cleaned = cleaned.replace(/Brand:\s*(\w+)\1/g, 'Brand: $1');
  cleaned = cleaned.replace(/Brand:\s*(\w+)(\s+\1)+/g, 'Brand: $1');
  
  // Fix specific brand name issues
  cleaned = cleaned.replace(/Nike\s*Nike/g, 'Nike');
  cleaned = cleaned.replace(/Adidas\s*Adidas/g, 'Adidas');
  cleaned = cleaned.replace(/Jordan\s*Jordan/g, 'Jordan');
  
  // Fix spacing issues with hyphenated terms
  cleaned = cleaned.replace(/\b(long)\s+(term)\b/gi, '$1-$2');
  
  // Fix formatting of price ranges
  cleaned = cleaned.replace(/\$\s*-\s*\$/g, '$-$');
  cleaned = cleaned.replace(/\$(\d+)\s+\$(\d+)/g, '$$$1-$$$2');
  cleaned = cleaned.replace(/\$(\s*)$/g, '');
  
  return cleaned;
};

/**
 * Fixes the title display in the shoe section to avoid duplications
 * @param {string} text - The raw AI response text
 * @returns {string} - The text with fixed shoe section heading
 */
export const fixShoeSectionTitle = (text) => {
  if (!text) return '';
  
  // Get the section between 👟 and 🕒
  const shoeSectionMatch = text.match(/👟.*?(?=🕒)/s);
  
  if (!shoeSectionMatch) return text;
  
  const shoeSection = shoeSectionMatch[0];
  
  // Extract shoe name and brand
  const shoeNameMatch = shoeSection.match(/Shoe Name:\s*(.*?)(?=\n)/);
  const brandMatch = shoeSection.match(/Brand:\s*(.*?)(?=\n)/);
  
  if (shoeNameMatch && brandMatch) {
    const shoeName = shoeNameMatch[1].trim();
    const brand = brandMatch[1].trim();
    
    // Avoid showing "Nike Nike" or "Nike SB DunkNike SB Dunk" type issues
    if (shoeName.includes(brand)) {
      // Create a clean section
      const cleanedShoeSection = `👟 Shoe Name & Brand
Shoe Name: ${shoeName}
Brand: ${brand}

`;
      
      // Replace the original section with the cleaned one
      return text.replace(shoeSectionMatch[0], cleanedShoeSection);
    }
  }
  
  return text;
};

export default {
  cleanupSneakerData,
  fixShoeSectionTitle
}; 
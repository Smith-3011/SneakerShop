import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "../components";
import MuiError from "../assets/mui/Alert";
import { mobile } from "../responsive";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { getImageForProduct, getDefaultImage } from "../utils/imageUtils";

const AiSearch = () => {
  const [code, setCode] = useState(""); // Input search term (code)
  const [searchResults, setSearchResults] = useState(null); // Results from the backend
  const [isLoading, setIsLoading] = useState(false); // Loading state for search
  const [error, setError] = useState(null); // Error handling state
  const [imageError, setImageError] = useState(false); // Track image loading errors

  // Handle image loading errors
  const handleImageError = () => {
    console.log("Image failed to load, falling back to default");
    setImageError(true);
  };

  const handleSearch = async () => {
    if (!code) {
      setError("Please enter a sneaker name to search for information.");
      return;
    }

    // Check if the search term is likely a valid sneaker name
    if (!isValidSneakerTerm(code)) {
      setError(null);
      setSearchResults("ERROR_NONSENSICAL_TERM");
      setIsLoading(false);
      return;
    }

    // Normalize the search term for better results
    const normalizedSearchTerm = normalizeSearchTerm(code);
    console.log(`Sending search request for: "${normalizedSearchTerm}"`);
    
    setIsLoading(true);
    setError(null); // Clear any previous error
    setImageError(false); // Reset image error state
    setSearchResults(null); // Clear previous results

    try {
      // Use the simplified AI endpoint that doesn't rely on Google Cloud Console
      const response = await axios.post(
        "/SimpleAiSearch", // Use the new simplified endpoint
        { code: normalizedSearchTerm }, // Send the normalized search term
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 30000 // 30 second timeout for the AI request
        }
      );

      if (response.data) {
        console.log("Received response data. First 50 chars:", response.data.substring(0, 50));
        setSearchResults(response.data);
        setError(null);
      } else {
        setError("No results returned. Please try a different search term.");
      }
    } catch (err) {
      console.error("Error details: ", err); // Log full error object
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(
          `Server Error: ${
            err.response.data.message || err.response.data || "Something went wrong."
          }`
        );
      } else if (err.request) {
        // Request was made but no response was received
        setError("No response from server. Please check if the server is running.");
      } else {
        // Something happened in setting up the request
        setError(`Request Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to normalize search terms for better results
  const normalizeSearchTerm = (term) => {
    if (!term) return "";
    
    console.log(`Original search term: "${term}"`);
    
    // Convert to lowercase for consistency
    let normalized = term.toLowerCase().trim();
    
    // Handle special collab models
    if (normalized.includes("travis scott") || normalized.includes("fragment") || normalized.includes("cactus jack")) {
      // Format Travis x Fragment collab correctly
      if ((normalized.includes("travis") || normalized.includes("cactus")) && normalized.includes("fragment")) {
        if (normalized.includes("jordan 1") || normalized.includes("aj1")) {
          return "nike air jordan 1 low fragment design x travis scott";
        }
      }
      
      // Other Travis Scott models
      if (normalized.includes("travis scott") && normalized.includes("jordan 1")) {
        if (normalized.includes("low")) {
          return "nike air jordan 1 low travis scott";
        }
        return "travis scott air jordan 1 high";
      }
    }
    
    // Standardize brand names
    if (normalized.includes("aj1") || normalized.includes("aj 1")) {
      normalized = normalized.replace(/aj1|aj 1/g, "air jordan 1");
    }
    
    if (normalized.includes("sb") && !normalized.includes("dunk")) {
      normalized = normalized.replace(/sb/g, "sb dunk");
    }
    
    // Handle specific colorways
    if (normalized.includes("chicago") && !normalized.includes("high")) {
      normalized = normalized.replace("chicago", "high chicago");
    }
    
    // Add 'high' if jordan 1 is mentioned but not low/mid/high
    if (normalized.includes("jordan 1") || normalized.includes("air jordan 1")) {
      if (!normalized.includes("low") && !normalized.includes("mid") && !normalized.includes("high")) {
        normalized = normalized.replace("jordan 1", "jordan 1 high");
      }
    }
    
    // Add common brand prefixes if missing
    if (normalized.includes("dunk") && !normalized.includes("nike")) {
      normalized = `nike ${normalized}`;
    }
    
    if (normalized.includes("jordan") && !normalized.includes("air")) {
      normalized = normalized.replace(/jordan/g, "air jordan");
    }
    
    // Force common sneaker terms to the expected format
    if (normalized === "nike air jordan 1 chicago" || 
        normalized === "air jordan 1 chicago" ||
        normalized === "jordan 1 chicago") {
      normalized = "nike air jordan 1 high chicago";
      console.log("Using exact match for Chicago");
    }
    
    console.log(`Normalized search term: "${term}" → "${normalized}"`);
    return normalized;
  };

  // Function to clean HTML tags and separate the content from the section title
  const cleanContent = (content) => {
    if (!content) return "";
    
    // Remove HTML tags more thoroughly
    let cleanedContent = content.replace(/<br\s*\/?>/gi, '\n'); // Replace <br> tags with newlines
    cleanedContent = cleanedContent.replace(/<[^>]*>/g, ''); // Remove all other HTML tags
    
    // Remove markdown style formatting (** for bold, * for italic, etc.)
    cleanedContent = cleanedContent.replace(/\*\*/g, '');
    cleanedContent = cleanedContent.replace(/\*/g, ''); // Remove any remaining single asterisks
    
    // Remove section titles that are repeated in the content
    const parts = cleanedContent.split('|');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    
    // Remove brand section markers (e.g., "Nike Section:", "Adidas Section:")
    cleanedContent = cleanedContent.replace(/(\w+)\s+Section\s*:/gi, '');
    
    // Fix common formatting issues with price ranges
    cleanedContent = cleanedContent.replace(/\$\s*-\s*\$/g, '$-$'); // Fix "$  -  $" to "$-$"
    cleanedContent = cleanedContent.replace(/\$(\d+)\s+\$(\d+)/g, '$$$1-$$$2'); // Fix "$100 $200" to "$100-$200"
    
    // Fix incomplete price ranges that end with a $ sign
    cleanedContent = cleanedContent.replace(/\$(\s*)$/gm, ''); // Remove isolated $ at end of lines
    
    // Remove extra whitespace while preserving paragraph breaks
    cleanedContent = cleanedContent.replace(/[ \t]+/g, ' '); // Replace multiple spaces/tabs with a single space
    cleanedContent = cleanedContent.trim();
    
    return cleanedContent;
  };

  // Function to fix common formatting issues in section content
  const fixSectionContent = (content) => {
    if (!content) return "";
    
    // Apply common fixes to all sections
    let fixed = content;
    
    // Fix line breaks within sentences and paragraphs
    fixed = fixed.replace(/(\w)[\r\n]+(\w)/g, '$1 $2'); // Line breaks between words
    fixed = fixed.replace(/(\w-)[\r\n]+(\w)/g, '$1$2'); // Hyphenated words across lines
    
    // Fix common phrases that might be split across lines
    fixed = fixed.replace(/white\s*[\r\n\s]*on\s*[\r\n\s]*white/gi, 'white-on-white');
    fixed = fixed.replace(/long\s*[\r\n\s]*term/gi, 'long-term');
    fixed = fixed.replace(/short\s*[\r\n\s]*term/gi, 'short-term');
    fixed = fixed.replace(/ready\s*[\r\n\s]*to\s*[\r\n\s]*wear/gi, 'ready-to-wear');
    fixed = fixed.replace(/one\s*[\r\n\s]*of\s*[\r\n\s]*a\s*[\r\n\s]*kind/gi, 'one-of-a-kind');
    fixed = fixed.replace(/limited\s*[\r\n\s]*edition/gi, 'limited edition');
    fixed = fixed.replace(/high\s*[\r\n\s]*end/gi, 'high-end');
    fixed = fixed.replace(/low\s*[\r\n\s]*end/gi, 'low-end');
    fixed = fixed.replace(/mid\s*[\r\n\s]*range/gi, 'mid-range');
    
    return fixed;
  };

  // Function to format the result into sections
  const formatSneakerInfo = (data) => {
    if (!data) return null;

    // Check for specific error codes from the server
    if (data === "ERROR_NONSENSICAL_TERM") {
      return { error: "nonsensical" };
    }
    
    if (data === "ERROR_NO_INFORMATION" || data === "ERROR_API_FAILURE") {
      return { error: "no_information" };
    }

    // Check if we received an error response from the AI service
    if (data.includes("Sorry, I couldn't generate information about this sneaker")) {
      return { error: "no_information" };
    }

    // Fix specific problematic patterns in the raw data before parsing
    let cleanedData = data;
    // Direct fix for "NikeNike" pattern
    cleanedData = cleanedData.replace(/Brand:\s*NikeNike/g, 'Brand: Nike');
    cleanedData = cleanedData.replace(/Brand:\s*Nike\s+Nike/g, 'Brand: Nike');
    // Handle other potential double brands
    cleanedData = cleanedData.replace(/Brand:\s*(\w+)\s*\1/g, 'Brand: $1');
    
    // Parse sections from the response
    const sections = {};
    
    // Extract sections based on emoji prefixes
    const sectionMatches = cleanedData.match(/👟.*?(?=🕒)|🕒.*?(?=🚀)|🚀.*?(?=💰)|💰.*?(?=📉)|📉.*?(?=🔮)|🔮.*?(?=✨)|✨.*?(?=📊)|📊.*?(?=🛒)|🛒.*?(?=$)/gs);
    
    if (sectionMatches) {
      // Using for...of instead of forEach
      for (const section of sectionMatches) {
        if (section.includes("👟")) {
          // Special handling for nameAndBrand section
          const rawSection = section.replace(/👟\s*Shoe Name & Brand/i, "").trim();
          
          // Extract brand explicitly before cleaning
          const brandMatch = rawSection.match(/Brand:\s*([^\n]+)/i);
          let extractedBrand = brandMatch?.[1]?.trim();
          
          // Fix duplicate brand names like "NikeNike" or "Nike Nike"
          if (extractedBrand) {
            // Check for exact problematic patterns
            if (extractedBrand === "NikeNike" || extractedBrand === "Nike Nike") {
              extractedBrand = "Nike";
            } else {
              // Fix duplicated brand names (e.g., "NikeNike" or "Nike Nike")
              extractedBrand = extractedBrand.replace(/(\w+)\1/g, '$1');
              extractedBrand = extractedBrand.replace(/(\w+)(\s+\1)+/g, '$1');
              
              // Fix specific brand duplications
              extractedBrand = extractedBrand.replace(/Nike\s*Nike/g, 'Nike');
              extractedBrand = extractedBrand.replace(/Jordan\s*Jordan/g, 'Jordan');
              extractedBrand = extractedBrand.replace(/Adidas\s*Adidas/g, 'Adidas');
              extractedBrand = extractedBrand.replace(/Puma\s*Puma/g, 'Puma');
              extractedBrand = extractedBrand.replace(/Reebok\s*Reebok/g, 'Reebok');
              extractedBrand = extractedBrand.replace(/Converse\s*Converse/g, 'Converse');
              extractedBrand = extractedBrand.replace(/Vans\s*Vans/g, 'Vans');
            }
          }
          
          // Clean the content
          let nameAndBrand = cleanContent(rawSection);
          nameAndBrand = fixSectionContent(nameAndBrand);
          
          // Replace the original brand line with the cleaned version
          if (extractedBrand) {
            // Remove any existing brand line
            nameAndBrand = nameAndBrand.replace(/Brand:.*(\n|$)/i, '');
            // Add the cleaned brand
            nameAndBrand += `\nBrand: ${extractedBrand}`;
          }
          
          sections.nameAndBrand = nameAndBrand;
        }
        if (section.includes("🕒")) {
          const content = cleanContent(section.replace(/🕒\s*Sneaker History/i, "").trim());
          sections.history = fixSectionContent(content);
        }
        if (section.includes("🚀")) {
          const content = cleanContent(section.replace(/🚀\s*Launch Information/i, "").trim());
          sections.launch = fixSectionContent(content);
        }
        if (section.includes("💰")) {
          const content = cleanContent(section.replace(/💰\s*Current Market Price/i, "").trim());
          sections.price = fixSectionContent(content);
        }
        if (section.includes("📉")) {
          const content = cleanContent(section.replace(/📉\s*Price History & Trends/i, "").trim());
          sections.trends = fixSectionContent(content);
        }
        if (section.includes("🔮")) {
          const content = cleanContent(section.replace(/🔮\s*Future Price Prediction/i, "").trim());
          sections.prediction = fixSectionContent(content);
        }
        if (section.includes("✨")) {
          const content = cleanContent(section.replace(/✨\s*Features & Benefits/i, "").trim());
          sections.features = fixSectionContent(content);
        }
        if (section.includes("📊")) {
          const content = cleanContent(section.replace(/📊\s*Investment Potential/i, "").trim());
          sections.investment = fixSectionContent(content);
        }
        if (section.includes("🛒")) {
          const content = cleanContent(section.replace(/🛒\s*Buying Recommendations/i, "").trim());
          sections.recommendation = fixSectionContent(content);
        }
      }
    }

    return sections;
  };

  const parsedResults = searchResults ? formatSneakerInfo(searchResults) : null;

  // Improved function to extract shoe name from the parsed results
  const extractShoeName = () => {
    if (!parsedResults?.nameAndBrand) return '';

    const nameSection = parsedResults.nameAndBrand;
    
    // Try to find by explicit "Shoe Name:" format
    const nameMatch = nameSection.split('-').find(part => 
      part.trim().toLowerCase().startsWith('shoe name:') || 
      part.trim().toLowerCase().startsWith('name:')
    );
    
    if (nameMatch) {
      // Remove any "Brand:" text if it somehow got included
      let extractedName = nameMatch.replace(/shoe name:|name:/i, '').trim();
      extractedName = extractedName.replace(/brand:\s*.*$/i, '').trim();
      if (extractedName) return extractedName;
    }
    
    // Try to find by line that contains "Model:" 
    const modelLine = nameSection.split('\n').find(line => 
      line.trim().toLowerCase().startsWith('model:')
    );
    
    if (modelLine) {
      let extractedName = modelLine.replace(/model:/i, '').trim();
      extractedName = extractedName.replace(/brand:\s*.*$/i, '').trim();
      if (extractedName) return extractedName;
    }
    
    // If no explicit name found, use first line if reasonable
    const lines = nameSection.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Check if first line is reasonable to be a shoe name (not too long, not a label)
      if (firstLine && firstLine.length < 50 && !firstLine.includes(':')) {
        return firstLine;
      }
      
      // If first line isn't suitable, try second line (sometimes first line is a header)
      if (lines.length > 1) {
        const secondLine = lines[1].trim();
        if (secondLine && secondLine.length < 50 && !secondLine.includes(':')) {
          return secondLine;
        }
      }
    }
    
    // Use the search term as a fallback if it seems to be a valid shoe name
    if (code && code.length < 50) {
      // Capitalize the search term properly
      return code.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    return '';
  };

  // Get the shoe name using improved extraction
  const shoeName = extractShoeName();
  
  // Get the brand name from the parsed results if available
  const extractBrandName = () => {
    if (!parsedResults?.nameAndBrand) return '';
    
    // First try to find explicit brand name in nameAndBrand section
    const lines = parsedResults.nameAndBrand.split('\n');
    const brandLine = lines.find(line => 
      line.trim().toLowerCase().startsWith('brand:')
    );
    
    if (brandLine) {
      const extractedBrand = brandLine.replace(/brand:/i, '').trim();
      if (extractedBrand) return extractedBrand;
    }
    
    // Try to detect brand from shoe name if we have one
    if (shoeName) {
      const shoeNameLower = shoeName.toLowerCase();
      
      // Air Jordan specific detection
      if (shoeNameLower.includes('jordan 1') || 
          shoeNameLower.includes('aj1') || 
          shoeNameLower.includes('air jordan')) {
        return 'Jordan';
      }
      
      // Nike specific detection
      if (shoeNameLower.includes('nike dunk') || 
          shoeNameLower.includes('dunk low') ||
          shoeNameLower.includes('dunk high') ||
          shoeNameLower.includes('nike air force') || 
          shoeNameLower.includes('air force 1') ||
          shoeNameLower.includes('nike sb') ||
          shoeNameLower.includes('nike zoom')) {
        return 'Nike';
      }
      
      // Adidas specific detection
      if (shoeNameLower.includes('yeezy')) {
        return 'Adidas Yeezy';
      }
      
      if (shoeNameLower.includes('adidas') || 
          shoeNameLower.includes('forum') ||
          shoeNameLower.includes('ultraboost') ||
          shoeNameLower.includes('superstar') ||
          shoeNameLower.includes('stan smith') ||
          shoeNameLower.includes('gazelle')) {
        return 'Adidas';
      }
      
      // Bad Bunny collaboration specific detection
      if (shoeNameLower.includes('bad bunny')) {
        // Bad Bunny primarily collaborates with Adidas
        return 'Adidas';
      }
      
      // General brand detection
      const commonBrands = [
        'Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 
        'Reebok', 'ASICS', 'Saucony', 'Under Armour', 'Air Jordan'
      ];
      
      for (const brand of commonBrands) {
        if (shoeNameLower.includes(brand.toLowerCase())) {
          return brand;
        }
      }
    }
    
    // Check if brand info is in the history section
    if (parsedResults.history) {
      const historyLower = parsedResults.history.toLowerCase();
      
      if (historyLower.includes('nike') && historyLower.includes('jordan')) {
        return 'Jordan';
      }
      if (historyLower.includes('nike')) return 'Nike';
      if (historyLower.includes('jordan')) return 'Jordan';
      if (historyLower.includes('adidas')) return 'Adidas';
      if (historyLower.includes('puma')) return 'Puma';
      if (historyLower.includes('new balance')) return 'New Balance';
      if (historyLower.includes('converse')) return 'Converse';
      if (historyLower.includes('vans')) return 'Vans';
      if (historyLower.includes('reebok')) return 'Reebok';
    }
    
    // Check original search term as a last resort
    if (code) {
      const codeLower = code.toLowerCase();
      if (codeLower.includes('jordan')) return 'Jordan';
      if (codeLower.includes('nike')) return 'Nike';
      if (codeLower.includes('adidas')) return 'Adidas';
      if (codeLower.includes('puma')) return 'Puma';
      if (codeLower.includes('new balance')) return 'New Balance';
      if (codeLower.includes('yeezy')) return 'Adidas Yeezy';
      if (codeLower.includes('forum')) return 'Adidas';
      if (codeLower.includes('bad bunny')) return 'Adidas';
    }
    
    return '';
  };
  
  const brandName = extractBrandName();
  
  // Helper function to generate unique keys for list items
  const generateUniqueKey = (section, item, index) => {
    // Use the content to create a more unique key
    const contentPart = typeof item === 'string' ? item.substring(0, 20) : '';
    const hashCode = (str) => {
      let hash = 0;
      if (str.length === 0) return hash;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    // Create a more unique identifier based on content and position
    return `${section}-${hashCode(contentPart || section)}-${index}`;
  };

  // Check if the search term is vague and we have a suggestion
  const getSearchSuggestion = (term) => {
    if (!term) return null;
    
    const lowerTerm = term.toLowerCase().trim();
    
    // Common suggestions for vague terms
    const suggestions = {
      // Shortened terms
      'jordan': 'Nike Air Jordan 1 High Chicago',
      'panda': 'Nike Dunk Low Panda',
      'dunk': 'Nike Dunk Low Panda',
      'yeezy': 'Adidas Yeezy Boost 350 V2 Zebra',
      'unc': 'Air Jordan 4 University Blue',
      'chicago': 'Nike Air Jordan 1 High Chicago',
      'travis': 'Travis Scott Air Jordan 1 High',
      'travis scott': 'Travis Scott Air Jordan 1 High',
      'fragment': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'cactus jack': 'Travis Scott Air Jordan 1 High',
      'af1': 'Nike Air Force 1',
      'force': 'Nike Air Force 1',
      
      // Slightly mistyped versions of popular searches
      'nike dunk panda': 'Nike Dunk Low Panda',
      'nike dunk': 'Nike Dunk Low Panda',
      'nike dunks': 'Nike Dunk Low Panda',
      'dunk low': 'Nike Dunk Low Panda',
      'aj1': 'Nike Air Jordan 1 High Chicago',
      'aj1 chicago': 'Nike Air Jordan 1 High Chicago',
      'air jordan chicago': 'Nike Air Jordan 1 High Chicago',
      'jordan chicago': 'Nike Air Jordan 1 High Chicago',
      'yeezy 350': 'Adidas Yeezy Boost 350 V2 Zebra',
      'yeezy 350 v2': 'Adidas Yeezy Boost 350 V2 Zebra',
      'yeezy boost': 'Adidas Yeezy Boost 350 V2 Zebra',
      'jordan 4 unc': 'Air Jordan 4 University Blue',
      'aj4 unc': 'Air Jordan 4 University Blue',
      'university blue': 'Air Jordan 4 University Blue',
      'travis scott jordan': 'Travis Scott Air Jordan 1 High',
      'travis scott fragment': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'fragment travis': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'jordan 1 travis': 'Travis Scott Air Jordan 1 High',
      'jordan 1 low travis': 'Nike Air Jordan 1 Low Travis Scott',
      'jordan 1 fragment': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'jordan 1 low fragment': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'travis fragment': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
      'fragment x travis': 'Nike Air Jordan 1 Low Fragment Design x Travis Scott',
    };
    
    return suggestions[lowerTerm] || null;
  };

  // Get search suggestion if available
  const searchSuggestion = code ? getSearchSuggestion(code) : null;

  // Function to fix broken lines in recommendation text
  const fixRecommendationText = (text) => {
    if (!text) return "";
    
    // First, normalize all line breaks
    let fixed = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Join lines that end without punctuation (likely broken sentences)
    fixed = fixed.replace(/(\w+)[\n]+(\w+)/g, '$1 $2');
    
    // Fix specific "long-term" pattern that might be split
    fixed = fixed.replace(/(\w+)\s+long[\n\s]*term/gi, '$1 long-term');
    
    // Special fix for the common pattern in recommendations
    fixed = fixed.replace(/though\s+the\s+Panda\s+may\s+appreciate\s+modestly\s+long[\n\s]*term/gi, 
                        'though the Panda may appreciate modestly long-term');
    
    return processText(fixed);
  };

  // Function to check if a term is likely a valid sneaker name
  const isValidSneakerTerm = (term) => {
    if (!term) return false;

    // Convert to lowercase for comparison
    const lowerTerm = term.toLowerCase().trim();
    
    // Common sneaker brands
    const brands = [
      'nike', 'adidas', 'jordan', 'air jordan', 'yeezy', 'puma', 'reebok',
      'new balance', 'asics', 'converse', 'vans', 'under armour', 'saucony',
      'hoka', 'nb', 'fila'
    ];
    
    // Common sneaker model terms
    const models = [
      'dunk', 'air force', 'af1', 'air max', 'sb', 'jordan', 'yeezy',
      'superstar', 'stan smith', 'gazelle', 'forum', 'ultraboost', 'nmd',
      'gel', 'air', 'react', 'zoom', 'pegasus', 'huarache', 'presto',
      'cortez', 'blazer', 'chuck', 'converse', 'vans', 'old skool',
      'authentic', 'sk8', 'slip-on', '990', '574', '327', '550', '997',
      'boost', 'wave', 'gel lyte', 'retro', 'high', 'low', 'mid'
    ];
    
    // Common colorway terms
    const colorways = [
      'panda', 'chicago', 'bred', 'royal', 'shadow', 'university blue',
      'unc', 'crimson', 'navy', 'volt', 'infrared', 'cement', 'concord',
      'space jam', 'mocha', 'triple black', 'triple white', 'zebra',
      'beluga', 'oreo', 'starfish', 'obsidian'
    ];
    
    // Check if the term contains any valid sneaker brand
    const hasBrand = brands.some(brand => lowerTerm.includes(brand));
    
    // Check if the term contains any valid sneaker model
    const hasModel = models.some(model => lowerTerm.includes(model));
    
    // Check if the term contains any common colorway
    const hasColorway = colorways.some(color => lowerTerm.includes(color));
    
    // Terms that are definitely not sneakers
    const nonsensicalTerms = [
      'bulbul', 'djkdkvjdnvjld', 'asdfgh', 'qwerty', 'zxcvbn', 'poiuyt',
      'lkjhgf', 'mnbvcx', 'random', 'test', 'hello', 'xyz', 'blah', 'foo',
      'bar', 'baz', 'lorem', 'ipsum', 'dolor', 'sit', 'amet'
    ];
    
    // If the term matches a known nonsensical term, it's not valid
    if (nonsensicalTerms.some(nonsense => lowerTerm.includes(nonsense))) {
      return false;
    }
    
    // If the term is very short (less than 3 characters) or just random characters, it's not valid
    if (lowerTerm.length < 3 || /^[^a-zA-Z]*$/.test(lowerTerm) || /^\d+$/.test(lowerTerm)) {
      return false;
    }
    
    // If the term has too many characters that aren't letters, spaces, or numbers
    const nonAlphaNumericRatio = (lowerTerm.match(/[^a-z0-9\s]/g) || []).length / lowerTerm.length;
    if (nonAlphaNumericRatio > 0.3) {
      return false;
    }
    
    // If it has a brand and either a model or colorway, it's very likely a valid sneaker term
    if (hasBrand && (hasModel || hasColorway)) {
      return true;
    }
    
    // If it has a model and a colorway, it might be valid
    if (hasModel && hasColorway) {
      return true;
    }
    
    // If it just has a brand, it might be a valid search but too general
    if (hasBrand) {
      return true;
    }
    
    // If it just has a common model name, it might be valid
    if (hasModel) {
      return true;
    }
    
    // If it's just a colorway, it's too vague but could be valid
    if (hasColorway) {
      return true;
    }
    
    // If none of the above conditions are met, it's likely not a valid sneaker term
    return false;
  };

  // Helper function to process paragraph text
  const processText = (text) => {
    if (!text) return "";
    
    // Remove any leftover formatting characters
    let processed = text.replace(/\(Note:|^\s*\(|\)\s*$|\*|\s{2,}/g, match => {
      if (match.includes('Note:')) return '(Note:'; // Preserve "Note:" but clean up
      if (match === '(' || match === ')') return match; // Keep parentheses
      return ' '; // Replace other matches with a space
    });
    
    // Fix line breaks in the middle of sentences
    processed = processed.replace(/(\w)[\r\n]+(\w)/g, '$1 $2'); // Replace newlines between words with spaces
    processed = processed.replace(/(\w-)[\r\n]+(\w)/g, '$1$2'); // Fix hyphenated words split across lines
    
    // Fix specific common phrases that might be split across lines
    processed = processed.replace(/white\s*[\r\n]*on\s*[\r\n]*white/gi, 'white-on-white');
    processed = processed.replace(/ready\s*[\r\n]*to\s*[\r\n]*wear/gi, 'ready-to-wear');
    processed = processed.replace(/one\s*[\r\n]*of\s*[\r\n]*a\s*[\r\n]*kind/gi, 'one-of-a-kind');
    processed = processed.replace(/limited\s*[\r\n]*edition/gi, 'limited edition');
    
    // Fix price formatting issues
    processed = processed.replace(/\$\s*-\s*\$/g, '$-$'); // Fix "$  -  $" to "$-$"
    processed = processed.replace(/\$(\d+)\s+\$(\d+)/g, '$$$1-$$$2'); // Fix "$100 $200" to "$100-$200"
    processed = processed.replace(/\$(\s*)$/g, ''); // Remove isolated $ at end
    
    // Remove brand section markers
    processed = processed.replace(/(\w+)\s+Section\s*:/gi, '');
    
    // Fix duplicate brand names
    processed = processed.replace(/Brand:\s*(\w+)\1/gi, 'Brand: $1');
    processed = processed.replace(/Brand:\s*(\w+)(\s+\1)+/gi, 'Brand: $1');
    
    // Fix specific brand name duplications
    processed = processed.replace(/Nike\s*Nike/g, 'Nike');
    processed = processed.replace(/Jordan\s*Jordan/g, 'Jordan');
    processed = processed.replace(/Adidas\s*Adidas/g, 'Adidas');
    processed = processed.replace(/Puma\s*Puma/g, 'Puma');
    processed = processed.replace(/Reebok\s*Reebok/g, 'Reebok');
    processed = processed.replace(/Converse\s*Converse/g, 'Converse');
    processed = processed.replace(/Vans\s*Vans/g, 'Vans');
    
    // Fix common formatting issues
    processed = processed.replace(/,\s*,/g, ','); // Remove double commas
    processed = processed.replace(/\.\s*\./g, '.'); // Remove double periods
    processed = processed.replace(/\s+\./g, '.'); // Fix space before period
    processed = processed.replace(/\s+,/g, ','); // Fix space before comma
    processed = processed.replace(/,(?!\s)/g, ', '); // Add space after comma if missing
    processed = processed.replace(/\.(?!\s|$)/g, '. '); // Add space after period if missing
    processed = processed.replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space
    
    return processed.trim();
  };

  return (
    <div className="section-center">
      <Navbar />
      <Container>
        <SearchWrapper>
          <SearchHeader>
            <h1>Sneaker Information Search</h1>
            <p>Enter the name of a sneaker to get detailed information and market analysis.</p>
          </SearchHeader>
          
          <SearchInputWrapper>
            <SearchInput
              type="text"
              placeholder="Example: Nike Air Jordan 1 High Chicago"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <SearchButton onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </SearchButton>
          </SearchInputWrapper>

          {/* Display Results */}
          {error && <MuiError type="error" value={error} />}
          
          {isLoading ? (
            <LoadingMessage>Generating sneaker information. This may take a moment...</LoadingMessage>
          ) : (
            parsedResults && (
              <ResultContainer>
                {parsedResults.error ? (
                  <>
                    <ResultHeader>
                      <h2>Sneaker Information</h2>
                    </ResultHeader>
                    <ErrorMessage>
                      <ErrorIcon>{parsedResults.error === "nonsensical" ? "🔍" : "🔍"}</ErrorIcon>
                      <ErrorTitle>
                        {parsedResults.error === "nonsensical" 
                          ? `"${code}" doesn't appear to be a valid sneaker name` 
                          : `No detailed information found for "${code}"`}
                      </ErrorTitle>
                      
                      {parsedResults.error === "nonsensical" ? (
                        <ErrorDescription>
                          The search term you entered doesn't appear to match any known sneaker model. 
                          Please try searching for a valid sneaker brand and model like "Nike Air Jordan 1" or "Adidas Yeezy".
                        </ErrorDescription>
                      ) : (
                        <ErrorTips>
                          <TipTitle>Try one of these suggestions:</TipTitle>
                          <TipList>
                            <TipItem key="tip-spelling">Check the spelling of your search term</TipItem>
                            <TipItem key="tip-specific">Use a more specific model name (e.g., "Nike Dunk Low Panda" instead of just "Panda")</TipItem>
                            <TipItem key="tip-brand">Include the brand name with the model (e.g., "Nike Air Jordan" instead of just "Jordan")</TipItem>
                          </TipList>
                        </ErrorTips>
                      )}
                      
                      <PopularSearches>
                        <PopularTitle>Popular searches you can try:</PopularTitle>
                        <SearchTags>
                          <SearchTag key="search-panda" onClick={() => {setCode("Nike Dunk Low Panda"); handleSearch();}}>Nike Dunk Low Panda</SearchTag>
                          <SearchTag key="search-zebra" onClick={() => {setCode("Yeezy Boost 350 Zebra"); handleSearch();}}>Yeezy Boost 350 Zebra</SearchTag>
                          <SearchTag key="search-unc" onClick={() => {setCode("Air Jordan 4 University Blue"); handleSearch();}}>Air Jordan 4 UNC</SearchTag>
                          <SearchTag key="search-chicago" onClick={() => {setCode("Nike Air Jordan 1 High Chicago"); handleSearch();}}>Air Jordan 1 Chicago</SearchTag>
                        </SearchTags>
                      </PopularSearches>
                    </ErrorMessage>
                    <DisclaimerSection>
                      <p>
                        <strong>Important Note:</strong> The price information provided is highly variable and depends on several factors, including size, condition (DS - Deadstock, VNDS - Very Near Deadstock, etc.), and market demand. Always check reputable resale platforms for the most up-to-date pricing. Investing in sneakers is speculative and carries risk.
                      </p>
                    </DisclaimerSection>
                  </>
                ) : (
                  <>
                    <ResultHeader>
                      {shoeName ? (
                        <>
                          <h2>
                            {/* Clean up any remaining "Brand:" text that might be in the shoe name */}
                            {shoeName.replace(/,?\s*brand:.*$/i, '').trim()}
                          </h2>
                        </>
                      ) : (
                        <>
                          <h2>Sneaker Information</h2>
                          {code && <SearchedTermTag>{code.replace(/,?\s*brand:.*$/i, '').trim()}</SearchedTermTag>}
                        </>
                      )}
                    </ResultHeader>
                    
                    {/* Show search suggestion if available */}
                    {searchSuggestion && code.toLowerCase() !== searchSuggestion.toLowerCase() && (
                      <SuggestionBanner>
                        Looking for more specific information? Try 
                        <SuggestionButton onClick={() => {setCode(searchSuggestion); handleSearch();}}>
                          {searchSuggestion}
                        </SuggestionButton>
                      </SuggestionBanner>
                    )}
                    
                    <ImageSection>
                      <ProductImage 
                        src={imageError ? getDefaultImage() : getImageForProduct(shoeName)}
                        alt={shoeName || "Sneaker"}
                        onError={handleImageError}
                      />
                    </ImageSection>

                    <SectionGrid>
                      {parsedResults.nameAndBrand && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Sneaker">👟</SectionIcon>
                            <SectionName>Brand Information</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {/* Always show brand first if available */}
                            {brandName && (
                              <ContentItem key="brand-info">
                                <Label>Brand:</Label>
                                <Value>{brandName}</Value>
                              </ContentItem>
                            )}
                            
                            {parsedResults.nameAndBrand.split('-').map((item, index) => {
                              const key = generateUniqueKey('nameAndBrand', item, index);
                              const parts = item.split(':');
                              
                              // Special handling for Brand field
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                let value = parts.slice(1).join(':').trim();
                                
                                // Skip brand field as we already handled it above
                                if (label.toLowerCase() === 'brand') {
                                  return null;
                                }
                                
                                if (label.toLowerCase() === 'shoe name' || label.toLowerCase() === 'name' || label.toLowerCase() === 'model') {
                                  // Make shoe name look nice with proper capitalization and spacing
                                  value = value
                                    .split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(' ');
                                }
                                
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.history && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="History">📚</SectionIcon>
                            <SectionName>Sneaker History</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.history.split('-').map((item, index) => {
                              const key = generateUniqueKey('history', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.launch && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Launch">🚀</SectionIcon>
                            <SectionName>Launch Information</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.launch.split('-').map((item, index) => {
                              const key = generateUniqueKey('launch', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.price && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Price">💰</SectionIcon>
                            <SectionName>Current Market Price</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.price.split('-').map((item, index) => {
                              const key = generateUniqueKey('price', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.trends && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Trends">📉</SectionIcon>
                            <SectionName>Price History & Trends</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.trends.split('-').map((item, index) => {
                              const key = generateUniqueKey('trends', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.prediction && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Prediction">🔮</SectionIcon>
                            <SectionName>Future Price Prediction</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.prediction.split('-').map((item, index) => {
                              const key = generateUniqueKey('prediction', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.features && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Features">✨</SectionIcon>
                            <SectionName>Features & Benefits</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.features.split('-').map((item, index) => {
                              const key = generateUniqueKey('features', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.investment && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Investment">💰</SectionIcon>
                            <SectionName>Investment Value</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {parsedResults.investment.split('-').map((item, index) => {
                              const key = generateUniqueKey('investment', item, index);
                              const parts = item.split(':');
                              if (parts.length > 1) {
                                const label = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                return (
                                  <ContentItem key={key}>
                                    <Label>{label}:</Label>
                                    <Value>{processText(value)}</Value>
                                  </ContentItem>
                                );
                              }
                              return item.trim() ? (
                                <p key={key}>{processText(item.trim())}</p>
                              ) : null;
                            })}
                          </SectionContent>
                        </InfoCard>
                      )}

                      {parsedResults.recommendation && (
                        <InfoCard>
                          <SectionTitle>
                            <SectionIcon role="img" aria-label="Recommendation">🛒</SectionIcon>
                            <SectionName>Buying Recommendations</SectionName>
                          </SectionTitle>
                          <SectionContent>
                            {/* Direct handling of the entire recommendation content for better formatting */}
                            {parsedResults.recommendation.includes("Buy for personal use or investment") ? (
                              <ContentItem key="main-recommendation">
                                <Label>Recommendation:</Label>
                                <Value>{fixRecommendationText(parsedResults.recommendation)}</Value>
                              </ContentItem>
                            ) : (
                              // Fall back to split-based rendering if needed
                              parsedResults.recommendation.split('-').map((item, index) => {
                                const key = generateUniqueKey('recommendation', item, index);
                                const parts = item.split(':');
                                if (parts.length > 1) {
                                  const label = parts[0].trim();
                                  const value = parts.slice(1).join(':').trim();
                                  return (
                                    <ContentItem key={key}>
                                      <Label>{label}:</Label>
                                      <Value>{fixRecommendationText(value)}</Value>
                                    </ContentItem>
                                  );
                                }
                                return item.trim() ? (
                                  <p key={key}>{fixRecommendationText(item.trim())}</p>
                                ) : null;
                              })
                            )}
                          </SectionContent>
                        </InfoCard>
                      )}
                    </SectionGrid>
                    
                    {/* If we couldn't parse the data correctly, show it as raw markdown */}
                    {Object.keys(parsedResults).length === 0 && searchResults && !parsedResults.error && (
                      <div className="raw-results">
                        <h3>Sneaker Information</h3>
                        <ReactMarkdown>{searchResults}</ReactMarkdown>
                      </div>
                    )}

                    <DisclaimerSection>
                      <p>
                        <strong>Important Note:</strong> The price information provided is highly variable and depends on several factors, including size, condition (DS - Deadstock, VNDS - Very Near Deadstock, etc.), and market demand. Always check reputable resale platforms for the most up-to-date pricing. Investing in sneakers is speculative and carries risk.
                      </p>
                    </DisclaimerSection>
                  </>
                )}
              </ResultContainer>
            )
          )}
        </SearchWrapper>
      </Container>
    </div>
  );
};

export default AiSearch;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--clr-mocha);
  }

  p {
    color: #666;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background-color: var(--clr-mocha-2);
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 700px;
  margin-bottom: 2rem;
  position: relative;
  
  ${mobile({ 
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  })}
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  background-color: #fcfaf7;
  
  &:focus {
    border-color: var(--clr-mocha);
    box-shadow: 0 0 0 3px rgba(150, 120, 100, 0.2);
  }
  
  ${mobile({ 
    width: '100%'
  })}
`;

const SearchButton = styled.button`
  background-color: var(--clr-mocha);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  margin-left: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
    z-index: -1;
  }

  &:hover {
    background-color: var(--clr-mocha-2);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    
    &:before {
      left: 100%;
    }
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:before {
      display: none;
    }
  }
  
  ${mobile({ 
    width: '100%',
    marginLeft: 0
  })}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: #666;
  background-color: #f8f5f1;
  border-radius: 8px;
  border: 1px dashed #e6dfd5;
`;

const ResultContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid #e6dfd5;
`;

const ResultHeader = styled.div`
  background-color: var(--clr-mocha);
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    display: inline-block;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: var(--clr-mocha-2);
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 1.8rem;
  padding: 2rem;
  background-color: #fcfaf7;
  
  ${mobile({ 
    gridTemplateColumns: '1fr',
    padding: '1.2rem',
    gap: '1.2rem'
  })}
`;

const InfoCard = styled.div`
  background-color: #f8f5f1; /* Light cream/beige background */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid var(--clr-mocha-2);
  height: fit-content;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.div`
  background-color: var(--clr-mocha); /* Darker mocha color */
  color: white;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
`;

const SectionIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const SectionName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const SectionContent = styled.div`
  padding: 1.2rem;
  background-color: #fcfaf7; /* Very light cream */
  
  p {
    margin: 0.7rem 0;
    line-height: 1.6;
    color: #444;
    font-size: 0.95rem;
    white-space: normal;
    word-wrap: break-word;
    padding-left: 0.1rem;
    
    &:not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }
`;

const ContentItem = styled.div`
  margin-bottom: 0.9rem;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.7rem;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--clr-mocha-2);
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
`;

const Value = styled.span`
  color: #333;
  line-height: 1.6;
  letter-spacing: 0.01em;
  font-size: 0.95rem;
  word-wrap: break-word;
  white-space: normal;
  display: inline-block;
  width: 100%;
  padding-left: 0.1rem;
  margin-bottom: 0.2rem;
`;

const DisclaimerSection = styled.div`
  padding: 1.5rem;
  background-color: #f5f2ed;
  border-top: 1px solid #e6dfd5;
  font-size: 0.9rem;
  color: #666;
  
  p {
    margin: 0;
    line-height: 1.5;
  }
  
  strong {
    color: var(--clr-mocha-2);
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #f8f5f1;
  border-radius: 8px;
  margin: 0 1.5rem 1.5rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--clr-mocha-2);
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--clr-mocha);
  margin-bottom: 1.5rem;
`;

const ErrorTips = styled.div`
  margin-bottom: 2rem;
`;

const TipTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--clr-mocha);
  margin-bottom: 1rem;
`;

const TipList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 500px;
`;

const TipItem = styled.li`
  padding: 0.6rem 1rem;
  margin-bottom: 0.5rem;
  background-color: white;
  border-left: 3px solid var(--clr-mocha-2);
  border-radius: 4px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const PopularSearches = styled.div`
  margin-top: 2rem;
`;

const PopularTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--clr-mocha);
  margin-bottom: 1rem;
`;

const SearchTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 0 auto;
  max-width: 600px;
`;

const SearchTag = styled.div`
  background-color: white;
  color: var(--clr-mocha);
  border: 1px solid var(--clr-mocha-2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: var(--clr-mocha);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  background-color: #f5f2ed;
  border-bottom: 1px solid #e6dfd5;
`;

const ProductImage = styled.img`
  max-width: 350px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${mobile({ 
    maxWidth: '80%'
  })}
`;

const SuggestionBanner = styled.div`
  background-color: #fffbf2;
  border-bottom: 1px solid #e6dfd5;
  padding: 0.75rem 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
`;

const SuggestionButton = styled.button`
  background: none;
  border: none;
  color: var(--clr-mocha);
  font-weight: 600;
  cursor: pointer;
  padding: 0 0.5rem;
  text-decoration: underline;
  transition: all 0.2s;
  
  &:hover {
    color: var(--clr-mocha-2);
  }
`;

const ErrorDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchedTermTag = styled.span`
  background-color: var(--clr-mocha-2);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;
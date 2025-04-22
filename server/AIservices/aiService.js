// Uncomment Google Generative AI import
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

// Import our data cleanup utilities
import { cleanupSneakerData, fixShoeSectionTitle } from '../SimpleAIServices/dataCleanupUtils.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the Google Generative AI with API key
const API_KEY = process.env.GOOGLE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Direct API access as a backup
const fetchGeminiDirect = async (prompt) => {
  try {
    console.log("Attempting direct API access to Gemini using v1 API...");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error("Invalid response format from direct API call");
  } catch (error) {
    console.error("Direct API access failed:", error.message);
    return null;
  }
};

// Create a simple AI service without depending on external APIs
// This version will rely on pre-defined mock data

// Common mappings for search terms
const COMMON_SNEAKER_MAPPINGS = {
  'jordan': 'Nike Air Jordan 1 High Chicago',
  'air jordan': 'Nike Air Jordan 1 High Chicago',
  'chicago': 'Nike Air Jordan 1 High Chicago',
  'aj1': 'Nike Air Jordan 1 High Chicago',
  'jordan 1': 'Nike Air Jordan 1 High Chicago',
  'high chicago': 'Nike Air Jordan 1 High Chicago',
  'air jordan 1 chicago': 'Nike Air Jordan 1 High Chicago',
  'jordan chicago': 'Nike Air Jordan 1 High Chicago',
  'panda': 'Nike Dunk Low Panda',
  'dunk panda': 'Nike Dunk Low Panda',
  'dunk low panda': 'Nike Dunk Low Panda',
  'nike panda': 'Nike Dunk Low Panda',
  'sb dunk': 'Nike SB Dunk Low',
  'nike sb': 'Nike SB Dunk Low',
  'dunk low': 'Nike Dunk Low',
  'dunks': 'Nike Dunk Low',
  'nike dunk': 'Nike Dunk Low',
  'unc': 'Air Jordan 4 University Blue',
  'university blue': 'Air Jordan 4 University Blue',
  'aj4 unc': 'Air Jordan 4 University Blue',
  'jordan 4 unc': 'Air Jordan 4 University Blue',
  'j4 unc': 'Air Jordan 4 University Blue',
  'yeezy': 'Adidas Yeezy Boost 350 V2 Zebra',
  'yeezy zebra': 'Adidas Yeezy Boost 350 V2 Zebra',
  'yeezy 350': 'Adidas Yeezy Boost 350 V2 Zebra',
  'air force': 'Nike Air Force 1',
  'air force 1': 'Nike Air Force 1',
  'af1': 'Nike Air Force 1',
  'air force one': 'Nike Air Force 1',
  'white air force': 'Nike Air Force 1',
  'forces': 'Nike Air Force 1',
  'force 1': 'Nike Air Force 1',
  'forum': 'Adidas Forum Low',
  'adidas forum': 'Adidas Forum Low',
  'air max': 'Nike Air Max 90',
  'airmax': 'Nike Air Max 90',
  'jordan 1 low': 'Nike Air Jordan 1 Low',
  'aj1 low': 'Nike Air Jordan 1 Low',
  'low starfish': 'Nike Air Jordan 1 Low Starfish',
  'jordan low starfish': 'Nike Air Jordan 1 Low Starfish',
  'starfish': 'Nike Air Jordan 1 Low Starfish',
  'bad bunny': 'Adidas Forum Low Bad Bunny',
  'adidas bad bunny': 'Adidas Forum Low Bad Bunny',
  'forum bad bunny': 'Adidas Forum Low Bad Bunny',
  'vomero': 'Nike Zoom Vomero 5',
  'zoom vomero': 'Nike Zoom Vomero 5',
};

// Mockup data for popular sneakers
const MOCKUP_DATA = {
  "Nike Air Force 1": `👟 Shoe Name & Brand
Shoe Name: Nike Air Force 1
Brand: Nike

🕒 Sneaker History
Nike, founded by Phil Knight and Bill Bowerman in 1964, initially operated as Blue Ribbon Sports before becoming Nike, Inc. in 1971. The Air Force 1 was the first basketball shoe to feature Nike Air technology, launching in 1982 and becoming one of the most iconic sneakers in history.

🚀 Launch Information
Launch Date: 1982
Launch Price: $65 (approximate, adjusted for inflation)

💰 Current Market Price
StockX: Varies greatly depending on colorway and condition; prices range from under $100 for basic models to thousands for rare collaborations.
GOAT: Similar pricing to StockX, with fluctuations based on model.
Stadium Goods: Similar pricing to StockX and GOAT.
eBay: Prices vary widely depending on seller and condition; expect a broad range.

📉 Price History & Trends
The Air Force 1 has maintained consistent value and popularity since its introduction, with certain colorways and collaborations seeing significant appreciation. The white-on-white colorway remains a cultural staple and steady seller.

🔮 Future Price Prediction
Predicted price increase: Standard colorways may see modest 5-10% increases annually, while limited editions could appreciate 20-30% or more.
Price expected to reach in: 3 years, standard models should maintain current value with potential modest growth. Limited editions and collaborations will likely continue to appreciate significantly.

✨ Features & Benefits
Main features: Leather upper for durability, Nike Air cushioning for comfort, perforated toe box for ventilation, padded collar for support, rubber outsole for excellent traction, and timeless design that has remained relevant for decades.

📊 Investment Potential
Potential for future value appreciation: Standard colorways offer stable value, while limited editions and collaborations can provide excellent investment returns.

🛒 Buying Recommendations
Buy for personal use or investment: Excellent for personal use due to comfort, durability, and versatile styling. For investment, focus on limited editions, collaborations, and unique colorways rather than standard releases.`,

  "Nike Dunk Low Panda": `👟 Shoe Name & Brand
Shoe Name: Nike Dunk Low Panda
Brand: Nike

🕒 Sneaker History
The Nike Dunk was originally released in 1985 as a basketball shoe. It later gained popularity in the skateboarding community and became a streetwear icon. The "Panda" colorway, with its simple black and white design, has become one of the most popular Dunk releases in recent years.

🚀 Launch Information
Launch Date: The Panda colorway first released in 2021
Launch Price: $100 retail price

💰 Current Market Price
StockX: $130-$220 depending on size
GOAT: $140-$230 depending on size
Stadium Goods: $150-$250 depending on size
eBay: $120-$200 depending on condition and size

📉 Price History & Trends
The Dunk Low Panda saw initial resale prices spike to nearly $300 after its first release. Despite multiple restocks, it has maintained value above retail, demonstrating persistent demand despite increased supply.

🔮 Future Price Prediction
Predicted price increase: Likely to remain $20-$50 above retail price for the foreseeable future, with potential moderate increases if production ceases.
Price expected to reach in: 1-2 years, could potentially reach $250-$300 range if Nike stops production.

✨ Features & Benefits
Main features: Clean black and white colorway, leather upper for durability, padded tongue and collar for comfort, perforated toe box for breathability, and rubber outsole for traction.

📊 Investment Potential
Potential for future value appreciation: Moderate. While not likely to see dramatic price increases due to multiple restocks, the colorway's popularity suggests it will maintain value above retail.

🛒 Buying Recommendations
Buy for personal use or investment: Excellent for personal use due to versatile colorway and classic silhouette. For investment, better options exist with more limited Dunk colorways, though the Panda may appreciate modestly long-term if production ends.`,

  "Air Jordan 4 University Blue": `👟 Shoe Name & Brand
Shoe Name: Air Jordan 4 University Blue
Brand: Jordan

🕒 Sneaker History
The Air Jordan 4, designed by Tinker Hatfield, was first released in 1989 and gained cultural significance when Michael Jordan hit "The Shot" over Craig Ehlo in these shoes. The University Blue colorway pays homage to Michael Jordan's alma mater, the University of North Carolina.

🚀 Launch Information
Launch Date: March 6, 2021
Launch Price: $200 retail price

💰 Current Market Price
StockX: $350-$500 depending on size
GOAT: $370-$520 depending on size
Stadium Goods: $400-$550 depending on size
eBay: $300-$480 depending on condition and size

📉 Price History & Trends
Since its release, the AJ4 University Blue has consistently maintained value well above retail price. After an initial spike to nearly $450, prices stabilized and have shown steady appreciation over time.

🔮 Future Price Prediction
Predicted price increase: Expected to appreciate 10-15% annually as deadstock pairs become scarcer.
Price expected to reach in: 2-3 years, potentially reaching $600-$700 for most sizes.

✨ Features & Benefits
Main features: Suede upper in University Blue colorway, signature Air Jordan 4 mesh panels, visible Air cushioning, "wings" support system, and classic Nike Air branding on the heel.

📊 Investment Potential
Potential for future value appreciation: High. Limited release and connection to Jordan's college colors make this a desirable collector's item with good long-term prospects.

🛒 Buying Recommendations
Buy for personal use or investment: Both. This is a versatile, wearable colorway of an iconic silhouette with strong potential for appreciation over time. An excellent addition to any collection for wear or investment.`,

  "Nike Air Jordan 1 High Chicago": `👟 Shoe Name & Brand
Shoe Name: Nike Air Jordan 1 High Chicago
Brand: Jordan

🕒 Sneaker History
The Air Jordan 1 debuted in 1985 as Michael Jordan's first signature shoe, causing controversy when the NBA initially fined Jordan for wearing them. The Chicago colorway, matching the Bulls team colors, is considered the most iconic version of the shoe and has been rereleased several times to massive demand.

🚀 Launch Information
Launch Date: Original release in 1985, with notable retro releases in 1994, 2013, 2015, and 2022 (as "Lost and Found" version)
Launch Price: $65 in 1985; recent retros priced at $170-$180 retail

💰 Current Market Price
StockX: $1,500-$2,000 for 2015 retro; $350-$450 for 2022 "Lost and Found"
GOAT: $1,600-$2,200 for 2015 retro; $370-$480 for 2022 "Lost and Found"
Stadium Goods: $1,800-$2,500 for 2015 retro; $400-$550 for 2022 "Lost and Found"
eBay: Varies widely based on condition and authenticity

📉 Price History & Trends
The Chicago colorway has consistently ranked among the most valuable Air Jordan releases. The 2015 retro in particular has appreciated steadily, more than tripling in value since release. The 2022 "Lost and Found" version, while more accessible, has also maintained value above retail.

🔮 Future Price Prediction
Predicted price increase: 2015 retro could reach $3,000-$3,500 in 3-5 years; 2022 "Lost and Found" likely to reach $600-$800 in the same timeframe.
Price expected to reach in: Continuing steady appreciation, with potential acceleration as pairs become more scarce.

✨ Features & Benefits
Main features: Full-grain leather upper, iconic red and black Chicago Bulls colorway, Nike Air cushioning, padded collar for comfort, and high-top design for ankle support.

📊 Investment Potential
Potential for future value appreciation: Extremely high. The Chicago colorway has proven to be the most stable long-term investment in the Air Jordan line.

🛒 Buying Recommendations
Buy for personal use or investment: Both. While expensive, this is the definitive Air Jordan colorway with exceptional wearability and investment potential. Consider the "Lost and Found" version for a more accessible entry point.`,

  "Adidas Yeezy Boost 350 V2 Zebra": `👟 Shoe Name & Brand
Shoe Name: Adidas Yeezy Boost 350 V2 Zebra
Brand: Adidas Yeezy

🕒 Sneaker History
The Adidas Yeezy line was created in collaboration with Kanye West, launching in 2015. The Yeezy Boost 350 V2 became one of the most popular silhouettes in the collection, with the Zebra colorway being among the most iconic, featuring a distinctive white/black striped pattern.

🚀 Launch Information
Launch Date: February 25, 2017 (initial release), with several restocks in subsequent years
Launch Price: $220 retail price

💰 Current Market Price
StockX: $220-$320 depending on size
GOAT: $230-$340 depending on size
Stadium Goods: $250-$400 depending on size
eBay: $200-$300 depending on condition and size

📉 Price History & Trends
Initially extremely limited, the Zebra commanded resale prices over $1,000 after its first release. Multiple restocks have brought prices down substantially, but it has maintained value at or above retail despite increased supply, demonstrating enduring demand.

🔮 Future Price Prediction
Predicted price increase: Likely to see modest appreciation of 5-10% annually now that production has slowed.
Price expected to reach in: 2-3 years, could potentially reach $300-$400 consistently across sizes if no further restocks occur.

✨ Features & Benefits
Main features: Primeknit upper in the distinctive zebra pattern, Boost midsole for comfort, unique heel tab, and "SPLY-350" side branding.

📊 Investment Potential
Potential for future value appreciation: Moderate. While early pairs saw tremendous returns, multiple restocks have stabilized prices. Still, the iconic status of the colorway suggests modest long-term appreciation.

🛒 Buying Recommendations
Buy for personal use or investment: Primarily recommended for personal use due to comfort and distinctive design. Investment potential exists but is more limited compared to other Yeezy models with fewer releases.`,

  "Nike Air Jordan 1 Low": `👟 Shoe Name & Brand
Shoe Name: Nike Air Jordan 1 Low
Brand: Jordan

🕒 Sneaker History
The Air Jordan 1 Low is the low-top version of Michael Jordan's first signature shoe. While the high-top version received more attention initially, the low version has gained substantial popularity in recent years for its versatility and comfort.

🚀 Launch Information
Launch Date: The original Air Jordan 1 Low was released in 1985 alongside the High and Mid versions
Launch Price: The original retail price was around $65, with modern releases ranging from $90-$130 depending on the colorway

💰 Current Market Price
StockX: $100-$250 (varies greatly by colorway)
GOAT: $110-$300
Stadium Goods: $120-$350
eBay: $100-$250

📉 Price History & Trends
Air Jordan 1 Lows have seen a significant increase in popularity since 2019, with certain colorways appreciating substantially. The silhouette has gained wider appeal as a more accessible and versatile alternative to the High version.

🔮 Future Price Prediction
Predicted price increase: $20-$50 annually for general releases, with collaborations and special editions potentially appreciating much more.
Price expected to reach in: 3 years, standard colorways could reach $150-$300, with limited editions potentially much higher.

✨ Features & Benefits
Main features: Lower cut ankle for improved mobility, lightweight cushioning, iconic Air Jordan wings logo on heel, Nike Swoosh on sides, padded collar for comfort, and versatile design suitable for everyday wear.

📊 Investment Potential
Potential for future value appreciation: Moderate for standard colorways, High for collaborations and limited editions.

🛒 Buying Recommendations
Buy for personal use or investment: Excellent for personal use due to comfort and versatility. For investment, focus on collaboration releases or limited edition colorways rather than general releases.`,

  "Nike Air Jordan 1 Low Starfish": `👟 Shoe Name & Brand
Shoe Name: Nike Air Jordan 1 Low Starfish
Brand: Jordan

🕒 Sneaker History
The Air Jordan 1 Low Starfish features the iconic orange, black, and white color scheme reminiscent of the original "Shattered Backboard" colorway. This design pays tribute to a legendary moment in 1985 when Michael Jordan shattered a backboard during an exhibition game in Italy.

🚀 Launch Information
Launch Date: July 16, 2021
Launch Price: $90 retail price

💰 Current Market Price
StockX: $120-$180 depending on size
GOAT: $130-$190 depending on size
Stadium Goods: $140-$200 depending on size
eBay: $110-$170 depending on condition and size

📉 Price History & Trends
Since its release, the AJ1 Low Starfish has maintained value above retail. The distinctive orange colorway and connection to the popular "Shattered Backboard" theme have helped sustain demand despite being a general release.

🔮 Future Price Prediction
Predicted price increase: Expected to appreciate gradually by $10-$20 annually.
Price expected to reach in: 2-3 years, likely reaching $150-$220 range across sizes.

✨ Features & Benefits
Main features: Low-top silhouette for improved mobility, leather upper featuring the orange, black, and white color scheme, Nike Air cushioning for comfort, and iconic Wings logo on the heel.

📊 Investment Potential
Potential for future value appreciation: Moderate. While not as limited as some releases, the connection to the Shattered Backboard theme gives it stronger potential than typical general releases.

🛒 Buying Recommendations
Buy for personal use or investment: Primarily recommended for personal use due to its versatile design and comfort. Investment potential exists but is more modest compared to more limited releases.`,

  "Adidas Forum Low Bad Bunny": `👟 Shoe Name & Brand
Shoe Name: Adidas Forum Low Bad Bunny
Brand: Adidas

🕒 Sneaker History
This collaboration between Adidas and Puerto Rican rapper Bad Bunny transformed the classic Adidas Forum Low silhouette. The partnership began in 2021 and has produced several highly sought-after colorways, bringing modern cultural relevance to the retro basketball silhouette.

🚀 Launch Information
Launch Date: Various colorways released since 2021, including "First Café" (March 2021), "Easter Egg" (April 2021), and "Blue Tint" (August 2021)
Launch Price: $160 retail price

💰 Current Market Price
StockX: $200-$400 depending on colorway and size
GOAT: $220-$450 depending on colorway and size
Stadium Goods: $250-$500 depending on colorway and size
eBay: $180-$400 depending on colorway, condition, and size

📉 Price History & Trends
The Bad Bunny Forums immediately sold out at retail and have consistently commanded prices well above retail since launch. The "First Café" brown colorway has shown the strongest performance, with other versions also maintaining solid premiums.

🔮 Future Price Prediction
Predicted price increase: Likely to see steady 10-15% annual appreciation as deadstock pairs become scarcer.
Price expected to reach in: 2-3 years, the most popular colorways could reach $400-$600 range.

✨ Features & Benefits
Main features: Distinctive double tongue design, premium materials, unique "Eye" design on the tongue, padded ankle support, rubber outsole for traction, and special Bad Bunny branding.

📊 Investment Potential
Potential for future value appreciation: High, particularly for earlier releases. Bad Bunny's cultural relevance and the limited nature of the releases support long-term value.

🛒 Buying Recommendations
Buy for personal use or investment: Both. These offer unique styling and collectible appeal with good potential for appreciation, especially if stored in deadstock condition.`,

  "Nike Zoom Vomero 5": `👟 Shoe Name & Brand
Shoe Name: Nike Zoom Vomero 5
Brand: Nike

🕒 Sneaker History
The Nike Zoom Vomero line was originally introduced as a premium cushioned running shoe. The Vomero 5 has experienced a resurgence in popularity in recent years as part of the trend toward technical running shoes becoming fashion statements.

🚀 Launch Information
Launch Date: Originally released in the late 2000s; reintroduced in 2019
Launch Price: $140-$160 retail price for recent releases

💰 Current Market Price
StockX: $120-$220 depending on colorway and size
GOAT: $130-$230 depending on colorway and size
Stadium Goods: $150-$250 depending on colorway and size
eBay: $100-$200 depending on colorway, condition, and size

📉 Price History & Trends
The Zoom Vomero 5 has seen fluctuating demand since its reintroduction. Collaboration versions (like those with A-COLD-WALL*) and limited colorways have performed well, while general releases typically sell close to retail price.

🔮 Future Price Prediction
Predicted price increase: General releases likely to maintain current value with modest increases of 5-10% annually for popular colorways; collaborations could see 15-20% annual increases.
Price expected to reach in: 1-2 years, popular general release colorways might reach $180-$250; collaborations potentially reaching $300-$400.

✨ Features & Benefits
Main features: Extensive Cushlon foam and visible Zoom Air units for cushioning, technical mesh and synthetic upper for breathability and support, reflective elements for visibility, and complex layered design.

📊 Investment Potential
Potential for future value appreciation: Moderate for standard releases; Higher for collaborations and limited colorways.

🛒 Buying Recommendations
Buy for personal use or investment: Excellent for personal use due to comfort and distinctive technical aesthetic. For investment, focus on collaboration versions or limited colorways rather than general releases.`,

  "Nike SB Dunk Low": `👟 Shoe Name & Brand
Shoe Name: Nike SB Dunk Low
Brand: Nike

🕒 Sneaker History
The Nike SB Dunk Low began as a basketball shoe in the 1980s before being adapted for skateboarding in 2002. It became a cultural phenomenon through limited edition releases and collaborations with artists, designers, and skateshops.

🚀 Launch Information
Launch Date: The SB Dunk program began in 2002
Launch Price: Standard releases typically retail for $100-$110, with special editions and collaborations ranging from $120-$150

💰 Current Market Price
StockX: $150-$1000+ depending on colorway (collaborations and limited editions can reach several thousand dollars)
GOAT: $150-$1000+ depending on colorway
Stadium Goods: $170-$1200+ depending on colorway
eBay: Varies widely based on rarity and condition

📉 Price History & Trends
SB Dunks experienced massive growth in popularity and value from 2019-2021, with even general releases commanding significant premiums. While the market has stabilized somewhat, rare and limited editions continue to hold substantial value.

🔮 Future Price Prediction
Predicted price increase: Limited editions and collaborations could see 10-20% annual appreciation; general releases might maintain current values with modest growth.
Price expected to reach in: 2-3 years, popular collaboration models could potentially increase 30-50% from current values.

✨ Features & Benefits
Main features: Zoom Air insole for impact protection, padded tongue and collar for comfort and protection, reinforced materials for durability during skateboarding, and countless unique colorways and designs.

📊 Investment Potential
Potential for future value appreciation: Varies dramatically by release. General releases offer modest potential, while limited collaborations can be exceptional investments.

🛒 Buying Recommendations
Buy for personal use or investment: Both, depending on the specific release. For personal use, current general releases offer good value and durability. For investment, focus on limited collaborations with cultural relevance.`
};

// Format the search query to improve results
const formatSearchQuery = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check if we have an exact match in our mappings
  if (COMMON_SNEAKER_MAPPINGS[lowerQuery]) {
    console.log(`Found exact mapping for "${lowerQuery}" → "${COMMON_SNEAKER_MAPPINGS[lowerQuery]}"`);
    return COMMON_SNEAKER_MAPPINGS[lowerQuery];
  }
  
  // Try to find partial matches
  for (const [key, value] of Object.entries(COMMON_SNEAKER_MAPPINGS)) {
    if (lowerQuery.includes(key)) {
      console.log(`Found partial mapping for "${lowerQuery}" → "${value}" (matched "${key}")`);
      return value;
    }
  }
  
  // Return the original query if no matches found
  console.log(`No mapping found for "${lowerQuery}", using as-is`);
  return query;
};

// Filter out any brand section references
const filterBrandSections = (text) => {
  // First remove any "Nike Section:" or "Adidas Section:" type labels
  let filtered = text.replace(/\w+\s+Section:/g, '')
                    .replace(/\*\*/g, '') // Remove any markdown formatting
                    .trim();
  
  // Apply our advanced data cleanup
  filtered = cleanupSneakerData(filtered);
  
  // Fix the shoe section titles
  filtered = fixShoeSectionTitle(filtered);
  
  return filtered;
};

// Create prompt template for sneaker information
const createSneakerPrompt = (sneakerName) => {
  return `
Please provide detailed information about the sneaker "${sneakerName}" in the following format. 
This system needs to support ALL major sneaker brands including Nike, Adidas, Puma, Reebok, Under Armour, New Balance, ASICS, Converse, Jordan, Vans, Yeezy, Skechers, HOKA, Brooks, Saucony, Mizuno, Fila, K-Swiss, Balenciaga, Alexander McQueen, Margiela, and many others.

If this is a lesser-known model, please still provide as much accurate information as possible based on your knowledge.
Use these exact emoji section headers and structure:

👟 Shoe Name & Brand
Shoe Name: [full name of the sneaker, be very specific about the model]
Brand: [brand name]

🕒 Sneaker History
[brief history of the sneaker, brand history if specific model history is unavailable, and any cultural impact]

🚀 Launch Information
Launch Date: [original release date or estimate]
Launch Price: [retail price at launch or estimate]

💰 Current Market Price
StockX: [current price range on StockX, or "Not commonly found on StockX" if unavailable]
GOAT: [current price range on GOAT, or "Not commonly found on GOAT" if unavailable]
Stadium Goods: [current price range on Stadium Goods, or "Not commonly found on Stadium Goods" if unavailable]
eBay: [approximate price range on eBay or "Prices vary by seller" if uncertain]

📉 Price History & Trends
[describe how the price has changed over time or general market trends for this type of shoe]

🔮 Future Price Prediction
Predicted price increase: [estimate of potential appreciation or "Likely to follow retail pricing trends" for non-collectible models]
Price expected to reach in: [timeframe and price prediction or general assessment]

✨ Features & Benefits
Main features: [describe key features of the sneaker or similar models in the line]

📊 Investment Potential
Potential for future value appreciation: [investment analysis - be honest if it's not likely to be an investment piece]

🛒 Buying Recommendations
Buy for personal use or investment: [recommendation for buyers]

IMPORTANT: 
- Keep all section emojis exactly as shown
- Do not include extra headers or information
- Keep responses concise but informative
- Do not use markdown formatting in your response
- For less popular sneakers, provide the best estimates and information available
- If you're uncertain about specific details, provide general information about the model line or brand
- Do NOT default to popular models if you don't know the specific model requested
- Be honest about limitations in your knowledge but provide the best information you can
`;
};

// Main function to generate content using Gemini
const generateContent = async (prompt) => {
  try {
    // Format the query for better results
    const formattedPrompt = formatSearchQuery(prompt);
    
    // Debug logging
    console.log(`Original prompt: "${prompt}"`);
    console.log(`Formatted prompt: "${formattedPrompt}"`);
    console.log(`Using API key: ${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}`);
    
    // Create a generative model with the correct model name
    console.log("Using gemini-1.5-pro model for API call");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Set a longer timeout for the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout')), 30000); // 30 second timeout
    });
    
    // Generate content using Gemini with timeout
    console.log("Making API call to Gemini...");
    const fullPrompt = createSneakerPrompt(formattedPrompt);
    console.log("Prompt length:", fullPrompt.length);
    
    const generatePromise = model.generateContent(fullPrompt);
    
    // Use Promise.race to implement timeout
    const result = await Promise.race([generatePromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini, first 50 chars:", text.substring(0, 50));
    console.log("Response length:", text.length);
    
    // We no longer check for "ERROR_NONSENSICAL_TERM" since we want information for any sneaker
    
    // Apply our advanced data cleanup
    const cleanedText = cleanupSneakerData(text);
    
    // Fix the shoe section titles
    const finalText = fixShoeSectionTitle(cleanedText);
    
    return finalText;
  } catch (error) {
    console.error("Error in generateContent:", error);
    console.error("Error stack:", error.stack);
    
    // Try the direct API access method before falling back to mockup data
    try {
      console.log("Trying direct API access as fallback...");
      const fullPrompt = createSneakerPrompt(formatSearchQuery(prompt));
      const directResult = await fetchGeminiDirect(fullPrompt);
      
      if (directResult) {
        console.log("Direct API access successful, processing response...");
        // Apply our advanced data cleanup
        const cleanedText = cleanupSneakerData(directResult);
        
        // Fix the shoe section titles
        const finalText = fixShoeSectionTitle(cleanedText);
        
        return finalText;
      }
    } catch (directError) {
      console.error("Direct API access also failed:", directError);
    }
    
    // Handle different types of errors gracefully
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      console.log("API quota or rate limit exceeded, falling back to mockup data");
      return fallbackToMockupData(prompt);
    } 
    
    if (error.message?.includes("timeout") || error.message?.includes("API timeout")) {
      console.log("API call timed out, falling back to mockup data");
      return fallbackToMockupData(prompt);
    } 
    
    // For any other errors
    console.log("Error with Gemini API:", error.message);
    
    // For now, still fall back to mockup data but with a clear error message
    return fallbackToMockupData(prompt);
  }
};

// Function to fall back to mockup data when API fails
const fallbackToMockupData = (prompt) => {
  // Format the query for better matching
  const formattedPrompt = formatSearchQuery(prompt);
  
  // Try to find a matching mockup data
  if (MOCKUP_DATA[formattedPrompt]) {
    console.log(`Using mockup data for "${formattedPrompt}"`);
    return filterBrandSections(MOCKUP_DATA[formattedPrompt]);
  }
  
  // Check for partial matches in common terms
  if (prompt?.toLowerCase().includes('panda') && 
      (prompt?.toLowerCase().includes('dunk') || 
       prompt?.toLowerCase().includes('nike'))) {
    console.log("Falling back to Nike Dunk Low Panda mockup data");
    return filterBrandSections(MOCKUP_DATA["Nike Dunk Low Panda"]);
  }
  
  if (prompt.toLowerCase().includes('air force') || prompt.toLowerCase().includes('force 1')) {
    console.log("Falling back to Nike Air Force 1 mockup data");
    return filterBrandSections(MOCKUP_DATA["Nike Air Force 1"]);
  }
  
  if (prompt.toLowerCase().includes('jordan') && 
      prompt.toLowerCase().includes('chicago')) {
    console.log("Falling back to Air Jordan 1 Chicago mockup data");
    return filterBrandSections(MOCKUP_DATA["Nike Air Jordan 1 High Chicago"]);
  }
  
  // Return an error message instead of defaulting to Nike Air Force 1
  console.log("No match found for this sneaker in mockup data, returning error message");
  return `👟 Shoe Name & Brand
Shoe Name: ${prompt}
Brand: Unable to determine

⚠️ Service Temporarily Limited
We're sorry, but our AI search service is temporarily experiencing technical difficulties connecting to our database. 

Please try your search again later, or try searching for one of these popular models:
- Nike Air Force 1
- Nike Dunk Low Panda
- Air Jordan 1 High Chicago
- Adidas Yeezy Boost 350 V2 Zebra
- Nike SB Dunk Low

We're constantly improving our service to provide information on more sneaker models. Thank you for your patience!`;
};

export default generateContent;

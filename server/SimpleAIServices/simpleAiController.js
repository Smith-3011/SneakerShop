import generateContent from "../AIservices/aiService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';
import { cleanupSneakerData, fixShoeSectionTitle } from '../SimpleAIServices/dataCleanupUtils.js';

dotenv.config();
const API_KEY = process.env.GOOGLE_GEMINI_KEY;

/**
 * Simple AI controller that doesn't use Google Cloud Console
 * Uses the pre-defined mockup data for sneaker information
 */
const getSimpleSneakerInfo = async (req, res) => {
  const code = req.body.code;
  console.log("Received search query:", code);

  if (!code) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    console.log("Processing search query directly:", code);
    console.log("API Key being used (first 6 chars):", API_KEY.substring(0, 6));
    
    // Try direct approach first
    try {
      const directResult = await callGeminiDirectly(code);
      
      if (directResult) {
        console.log("Direct API call successful, returning data");
        return res.json(directResult);
      }
    } catch (directError) {
      console.error("Direct call failed:", directError.message);
    }
    
    // Fall back to the regular service if direct call fails
    const response = await generateContent(code);
    
    console.log("Sneaker information generated successfully");
    
    if (!response) {
      return res.status(500).json({ message: "No information generated for this sneaker" });
    }
    
    res.json(response);
  } catch (error) {
    console.error("Error processing AI request:", error);
    res.status(500).json({ 
      message: "Error processing sneaker information request", 
      error: error.message 
    });
  }
};

// Direct API call to Gemini
const callGeminiDirectly = async (sneakerName) => {
  console.log("Attempting direct API call to Gemini for:", sneakerName);
  
  const prompt = `
Please provide detailed information about the sneaker "${sneakerName}" in the following format. 
This system needs to support ALL major sneaker brands including Nike, Adidas, Puma, Reebok, Under Armour, New Balance, ASICS, Converse, Jordan, Vans, Yeezy, Skechers, HOKA, Brooks, Saucony, Mizuno, Fila, K-Swiss, Balenciaga, Alexander McQueen, Margiela, and many others.

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
`;

  try {
    console.log("Using correct v1 API endpoint for Gemini");
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

    console.log("Direct API response received, status:", response.status);
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = response.data.candidates[0].content.parts[0].text;
      console.log("Received text from Gemini, first 50 chars:", text.substring(0, 50));
      
      // Apply our data cleanup functions
      const cleanedText = cleanupSneakerData(text);
      const finalText = fixShoeSectionTitle(cleanedText);
      
      return finalText;
    }
    
    console.log("Invalid response format:", JSON.stringify(response.data).substring(0, 200));
    return null;
  } catch (error) {
    console.error("Error making direct API call:", error.message);
    throw error;
  }
};

export default getSimpleSneakerInfo; 
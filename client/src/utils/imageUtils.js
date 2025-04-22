// Image utility functions for the application
import yzCore from '../assets/images/Yeezy Slide Core.png';
import yzPure from '../assets/images/Yeezy Slide Pure.png';
import yzOreo from '../assets/images/Yeezy Boost 350 V2 Oreo.png';
import yzBlackRed from '../assets/images/Yeezy Boost 350 V2 Black Red.png';
import yzZebra from '../assets/images/Yeezy Boost 350 V2 Zebra.png';
import yzBeluga from '../assets/images/Yeezy Boost 350 V2 Beluga.png';
import yzNatural from '../assets/images/Yeezy Boost 350 V2 Natural.png';
import yzV2 from '../assets/images/Yeezy Boost 350 V2.png';
import yzInertia from '../assets/images/Yeezy Boost 700 V2 Inertia.png';
import yz450White from '../assets/images/Yeezy 450 Cloud White.png';
import yz450Slate from '../assets/images/Yeezy 450 Dark Slate.png';

import dunkPanda from '../assets/images/Nike Dunk Low Panda.png';
import dunkOffWhite from '../assets/images/Nike Dunk Low Off-White Lot 45.png';
import dunkUNC from '../assets/images/Nike Dunk Low UNC.png';
import dunkMichigan from '../assets/images/Nike Dunk Low Michigan.png';
import nikeVomero from '../assets/images/Nike Zoom Vomero 5.png';

import jordanMid from '../assets/images/Jordan 1 Mid Chicago Black Toe.png';
import jordanHighUnc from '../assets/images/Jordan 1 High UNC Chicago.png';
import jordanLowStar from '../assets/images/Jordan 1 Low Starfish.png';
import jordanLowFragment from '../assets/images/Jordan 1 Low Fragment x Travis Scott.png';
import jordanLowWolf from '../assets/images/Jordan 1 Low Wolf Grey.png';
import jordanLowTravis from '../assets/images/Jordan 1 Retro Low OG SP x Travis Scott.png';
import jordanHighTravis from '../assets/images/Jordan 1 Retro High x Travis Scott.png';
import jordan4UNC from '../assets/images/Jordan 4 Retro UNC.png';
import jordanSbUnc from '../assets/images/Jordan 1 Low SB UNC.png';

import pumaRsxCore from '../assets/images/Puma RS-X Core.png';
import pumaRsDreamer from '../assets/images/Puma RS-Dreamer.png';

// Store frequently used images for better organization
const IMAGES = {
  // Yeezy models
  YEEZY: {
    SLIDE: {
      CORE: yzCore,
      PURE: yzPure
    },
    BOOST350: {
      OREO: yzOreo,
      BLACK_RED: yzBlackRed,
      ZEBRA: yzZebra,
      BELUGA: yzBeluga,
      NATURAL: yzNatural,
      DEFAULT: yzV2
    },
    BOOST700: {
      INERTIA: yzInertia
    },
    Y450: {
      CLOUD_WHITE: yz450White,
      DARK_SLATE: yz450Slate
    }
  },
  // Nike Dunk models
  DUNK: {
    PANDA: dunkPanda,
    OFF_WHITE: dunkOffWhite,
    UNC: dunkUNC,
    MICHIGAN: dunkMichigan
  },
  // Other Nike models
  NIKE: {
    VOMERO: nikeVomero,
    AIR_FORCE_1: dunkPanda // Use Dunk Panda as fallback for Air Force 1
  },
  // Jordan models
  JORDAN: {
    MID: {
      CHICAGO_BLACK_TOE: jordanMid
    },
    HIGH: {
      UNC_CHICAGO: jordanHighUnc,
      TRAVIS_SCOTT: jordanHighTravis
    },
    LOW: {
      STARFISH: jordanLowStar,
      FRAGMENT_TRAVIS: jordanLowFragment,
      WOLF_GREY: jordanLowWolf,
      TRAVIS_SCOTT: jordanLowTravis,
      SB_UNC: jordanSbUnc
    },
    RETRO4: {
      UNC: jordan4UNC
    }
  },
  // Puma models
  PUMA: {
    RSX_CORE: pumaRsxCore,
    RS_DREAMER: pumaRsDreamer
  }
};

// Default images by brand for unknown models
const BRAND_DEFAULTS = {
  'yeezy': IMAGES.YEEZY.BOOST350.DEFAULT,
  'adidas': IMAGES.YEEZY.BOOST350.DEFAULT, // Using Yeezy as Adidas fallback
  'nike': IMAGES.DUNK.PANDA,
  'dunk': IMAGES.DUNK.PANDA,
  'sb': IMAGES.DUNK.PANDA,
  'jordan': IMAGES.JORDAN.LOW.STARFISH,
  'air jordan': IMAGES.JORDAN.LOW.STARFISH,
  'puma': IMAGES.PUMA.RSX_CORE,
  'new balance': IMAGES.NIKE.VOMERO, // Using Nike as fallback
  'converse': IMAGES.DUNK.PANDA, // Using Nike as fallback
  'vans': IMAGES.DUNK.PANDA, // Using Nike as fallback
  'reebok': IMAGES.DUNK.PANDA // Using Nike as fallback
};

// Specific keywords that help identify sneaker types
const KEY_IDENTIFIERS = {
  'travis': IMAGES.JORDAN.HIGH.TRAVIS_SCOTT,
  'travis scott': IMAGES.JORDAN.HIGH.TRAVIS_SCOTT,
  'travis fragment': IMAGES.JORDAN.LOW.FRAGMENT_TRAVIS,
  'fragment': IMAGES.JORDAN.LOW.FRAGMENT_TRAVIS,
  'panda': IMAGES.DUNK.PANDA,
  'chicago': IMAGES.JORDAN.HIGH.UNC_CHICAGO,
  'starfish': IMAGES.JORDAN.LOW.STARFISH,
  'unc': IMAGES.DUNK.UNC,
  'zebra': IMAGES.YEEZY.BOOST350.ZEBRA,
  'beluga': IMAGES.YEEZY.BOOST350.BELUGA,
  'university blue': IMAGES.JORDAN.RETRO4.UNC,
  'off-white': IMAGES.DUNK.OFF_WHITE,
  'wolf grey': IMAGES.JORDAN.LOW.WOLF_GREY,
  'grey': IMAGES.JORDAN.LOW.WOLF_GREY,
  'michigan': IMAGES.DUNK.MICHIGAN,
  'vomero': IMAGES.NIKE.VOMERO,
  'natural': IMAGES.YEEZY.BOOST350.NATURAL,
  'oreo': IMAGES.YEEZY.BOOST350.OREO,
  'black red': IMAGES.YEEZY.BOOST350.BLACK_RED,
  'inertia': IMAGES.YEEZY.BOOST700.INERTIA,
  'slide': IMAGES.YEEZY.SLIDE.CORE,
  '450': IMAGES.YEEZY.Y450.CLOUD_WHITE,
};

// Enhanced image selection system
export const getImageForProduct = (title) => {
  if (!title) return getDefaultImage();
  
  try {
    const titleLower = title.toLowerCase();
    
    // Handle Travis Scott & Fragment collaborations
    if ((titleLower.includes("travis") || titleLower.includes("cactus jack")) && 
        titleLower.includes("fragment")) {
      if (titleLower.includes("jordan 1") || titleLower.includes("aj1")) {
        return IMAGES.JORDAN.LOW.FRAGMENT_TRAVIS;
      }
    }
    
    // Handle Travis Scott collaborations
    if (titleLower.includes("travis scott") || titleLower.includes("cactus jack")) {
      if (titleLower.includes("jordan 1") || titleLower.includes("aj1")) {
        if (titleLower.includes("low")) {
          return IMAGES.JORDAN.LOW.TRAVIS_SCOTT;
        }
        return IMAGES.JORDAN.HIGH.TRAVIS_SCOTT;
      }
      
      // Return a default Travis Scott shoe if specific model not found
      if (titleLower.includes("jordan") || titleLower.includes("dunk")) {
        return IMAGES.JORDAN.HIGH.TRAVIS_SCOTT;
      }
    }
    
    // Normalize title for better matching
    const normalizedTitle = titleLower.trim();
    console.log(`Looking for image match for: "${normalizedTitle}"`);
    
    // Step 0: Special handling for our most common searches to ensure they always work
    if (normalizedTitle.includes('dunk') && normalizedTitle.includes('panda')) {
      console.log("Matching Nike Dunk Low Panda");
      return IMAGES.DUNK.PANDA;
    }
    
    if (normalizedTitle.includes('air jordan 1') && normalizedTitle.includes('chicago')) {
      console.log("Matching Air Jordan 1 Chicago");
      return IMAGES.JORDAN.HIGH.UNC_CHICAGO;
    }
    
    if (normalizedTitle.includes('yeezy') && normalizedTitle.includes('zebra')) {
      console.log("Matching Yeezy Boost 350 Zebra");
      return IMAGES.YEEZY.BOOST350.ZEBRA;
    }
    
    if (normalizedTitle.includes('jordan 4') && 
        (normalizedTitle.includes('university blue') || normalizedTitle.includes('unc'))) {
      console.log("Matching Air Jordan 4 University Blue");
      return IMAGES.JORDAN.RETRO4.UNC;
    }

    // Step 1: Check for exact matches of special products
    if (normalizedTitle === "nike air force 1 low white" || 
        normalizedTitle === "air force 1" || 
        normalizedTitle.includes("air force 1")) {
      console.log("Matching Air Force 1");
      return IMAGES.NIKE.AIR_FORCE_1;
    }
    
    // Step 2: Check for precise matches first (exact model names)
    // Nike Dunk Michigan - Special handling for the yellow/navy model
    if (normalizedTitle.includes("michigan") || 
        (normalizedTitle.includes("dunk") && normalizedTitle.includes("michigan")) ||
        (normalizedTitle.includes("yellow") && normalizedTitle.includes("blue") && normalizedTitle.includes("dunk"))) {
      console.log("Michigan dunk detected, returning Michigan image");
      return IMAGES.DUNK.MICHIGAN;
    }
    
    // Handle specific products by exact match first
    if (normalizedTitle.includes("yeezy slide core") || normalizedTitle === "yeezy slide core") {
      return IMAGES.YEEZY.SLIDE.CORE;
    }
    if (normalizedTitle.includes("yeezy slide pure") || normalizedTitle === "yeezy slide pure") {
      return IMAGES.YEEZY.SLIDE.PURE;
    }
    if (normalizedTitle.includes("yeezy boost 350 v2 oreo") || normalizedTitle === "yeezy boost 350 v2 oreo") {
      return IMAGES.YEEZY.BOOST350.OREO;
    }
    if (normalizedTitle.includes("yeezy boost 350 v2 black red") || normalizedTitle === "yeezy boost 350 v2 black red") {
      return IMAGES.YEEZY.BOOST350.BLACK_RED;
    }
    if (normalizedTitle.includes("yeezy boost 350 v2 zebra") || normalizedTitle === "yeezy boost 350 v2 zebra") {
      return IMAGES.YEEZY.BOOST350.ZEBRA;
    }
    if (normalizedTitle.includes("yeezy boost 350 v2 beluga") || normalizedTitle === "yeezy boost 350 v2 beluga") {
      return IMAGES.YEEZY.BOOST350.BELUGA;
    }
    if (normalizedTitle.includes("yeezy boost 350 v2 natural") || normalizedTitle === "yeezy boost 350 v2 natural") {
      return IMAGES.YEEZY.BOOST350.NATURAL;
    }
    if (normalizedTitle.includes("yeezy boost 700 v2 inertia") || normalizedTitle === "yeezy boost 700 v2 inertia") {
      return IMAGES.YEEZY.BOOST700.INERTIA;
    }
    if (normalizedTitle.includes("yeezy 450 cloud white") || normalizedTitle === "yeezy 450 cloud white") {
      return IMAGES.YEEZY.Y450.CLOUD_WHITE;
    }
    if (normalizedTitle.includes("yeezy 450 dark slate") || normalizedTitle === "yeezy 450 dark slate") {
      return IMAGES.YEEZY.Y450.DARK_SLATE;
    }
    
    // Nike Dunk models
    if (normalizedTitle.includes("nike dunk low panda") || normalizedTitle === "nike dunk low panda") {
      return IMAGES.DUNK.PANDA;
    }
    if (normalizedTitle.includes("nike dunk low off-white lot 45") || normalizedTitle === "nike dunk low off-white lot 45") {
      return IMAGES.DUNK.OFF_WHITE;
    }
    if (normalizedTitle.includes("nike dunk low unc") || normalizedTitle === "nike dunk low unc") {
      return IMAGES.DUNK.UNC;
    }
    if (normalizedTitle.includes("nike dunk low michigan") || normalizedTitle === "nike dunk low michigan") {
      console.log("Exact match for Michigan dunk detected");
      return IMAGES.DUNK.MICHIGAN;
    }
    
    // Other Nike models - prioritizing Vomero over SB Dunk
    if (normalizedTitle.includes("nike zoom vomero") || 
        normalizedTitle.includes("vomero") || 
        normalizedTitle === "nike zoom vomero 5") {
      console.log("Vomero detected, returning Vomero image");
      return IMAGES.NIKE.VOMERO;
    }
    
    // Any StrangeLove or SB will use Vomero image
    if (normalizedTitle.includes("strangelove")) {
      console.log("StrangeLove detected, using Vomero image");
      return IMAGES.NIKE.VOMERO;
    }
    
    // Jordan models
    if (normalizedTitle.includes("jordan 1 mid chicago black toe") || normalizedTitle === "jordan 1 mid chicago black toe") {
      return IMAGES.JORDAN.MID.CHICAGO_BLACK_TOE;
    }
    if (normalizedTitle.includes("jordan 1 high unc chicago") || normalizedTitle === "jordan 1 high unc chicago") {
      return IMAGES.JORDAN.HIGH.UNC_CHICAGO;
    }
    if (normalizedTitle.includes("jordan 1 retro high x travis scott") || normalizedTitle.includes("jordan 1 high travis")) {
      return IMAGES.JORDAN.HIGH.TRAVIS_SCOTT;
    }
    if (normalizedTitle.includes("jordan 1 low starfish") || normalizedTitle === "jordan 1 low starfish") {
      return IMAGES.JORDAN.LOW.STARFISH;
    }
    if (normalizedTitle.includes("jordan 1 low fragment x travis scott") || normalizedTitle.includes("jordan 1 low fragment")) {
      return IMAGES.JORDAN.LOW.FRAGMENT_TRAVIS;
    }
    if (normalizedTitle.includes("jordan 1 low wolf grey") || normalizedTitle === "jordan 1 low wolf grey") {
      return IMAGES.JORDAN.LOW.WOLF_GREY;
    }
    if (normalizedTitle.includes("jordan 1 retro low og sp x travis scott") || normalizedTitle.includes("jordan 1 low travis")) {
      return IMAGES.JORDAN.LOW.TRAVIS_SCOTT;
    }
    if (normalizedTitle.includes("jordan 1 low sb unc") || normalizedTitle.includes("jordan 1 low sb")) {
      return IMAGES.JORDAN.LOW.SB_UNC;
    }
    if (normalizedTitle.includes("jordan 4 retro unc") || normalizedTitle.includes("jordan 4 unc")) {
      return IMAGES.JORDAN.RETRO4.UNC;
    }
    
    // Puma models
    if (normalizedTitle.includes("puma rs-x core") || normalizedTitle === "puma rs-x core") {
      return IMAGES.PUMA.RSX_CORE;
    }
    if (normalizedTitle.includes("puma rs-dreamer") || normalizedTitle === "puma rs-dreamer") {
      return IMAGES.PUMA.RS_DREAMER;
    }
    
    // Step 2: Check for specific keywords that can help identify the sneaker
    for (const [keyword, image] of Object.entries(KEY_IDENTIFIERS)) {
      if (normalizedTitle.includes(keyword)) {
        console.log(`Found key identifier: ${keyword}`);
        return image;
      }
    }
    
    // Step 3: Try to match by brand/type for other products
    if (normalizedTitle.includes("yeezy")) {
      if (normalizedTitle.includes("slide")) {
        return IMAGES.YEEZY.SLIDE.CORE;
      }
      if (normalizedTitle.includes("450")) {
        if (normalizedTitle.includes("white")) {
          return IMAGES.YEEZY.Y450.CLOUD_WHITE;
        }
        return IMAGES.YEEZY.Y450.DARK_SLATE;
      }
      if (normalizedTitle.includes("350")) {
        if (normalizedTitle.includes("oreo")) {
          return IMAGES.YEEZY.BOOST350.OREO;
        }
        if (normalizedTitle.includes("black") || normalizedTitle.includes("red")) {
          return IMAGES.YEEZY.BOOST350.BLACK_RED;
        }
        if (normalizedTitle.includes("zebra")) {
          return IMAGES.YEEZY.BOOST350.ZEBRA;
        }
        if (normalizedTitle.includes("beluga")) {
          return IMAGES.YEEZY.BOOST350.BELUGA;
        }
        if (normalizedTitle.includes("natural")) {
          return IMAGES.YEEZY.BOOST350.NATURAL;
        }
        // Default 350
        return IMAGES.YEEZY.BOOST350.DEFAULT;
      }
      if (normalizedTitle.includes("700")) {
        return IMAGES.YEEZY.BOOST700.INERTIA;
      }
      // Default Yeezy
      return IMAGES.YEEZY.BOOST350.DEFAULT;
    }
    
    if (normalizedTitle.includes("jordan") || normalizedTitle.includes("air jordan")) {
      if (normalizedTitle.includes("4") || normalizedTitle.includes("iv")) {
        return IMAGES.JORDAN.RETRO4.UNC;
      }
      
      if (normalizedTitle.includes("travis scott") || normalizedTitle.includes("fragment")) {
        if (normalizedTitle.includes("high")) {
          return IMAGES.JORDAN.HIGH.TRAVIS_SCOTT;
        }
        if (normalizedTitle.includes("fragment")) {
          return IMAGES.JORDAN.LOW.FRAGMENT_TRAVIS;
        }
        return IMAGES.JORDAN.LOW.TRAVIS_SCOTT;
      }
      
      if (normalizedTitle.includes("low")) {
        if (normalizedTitle.includes("wolf grey")) {
          return IMAGES.JORDAN.LOW.WOLF_GREY;
        }
        if (normalizedTitle.includes("starfish")) {
          return IMAGES.JORDAN.LOW.STARFISH;
        }
        if (normalizedTitle.includes("unc")) {
          return IMAGES.JORDAN.LOW.SB_UNC;
        }
        // Default low
        return IMAGES.JORDAN.LOW.STARFISH;
      }
      
      if (normalizedTitle.includes("mid")) {
        return IMAGES.JORDAN.MID.CHICAGO_BLACK_TOE;
      }
      
      if (normalizedTitle.includes("high") || normalizedTitle.includes("retro high")) {
        if (normalizedTitle.includes("travis") || normalizedTitle.includes("scott")) {
          return IMAGES.JORDAN.HIGH.TRAVIS_SCOTT;
        }
        return IMAGES.JORDAN.HIGH.UNC_CHICAGO;
      }
      
      // Default Jordan
      return IMAGES.JORDAN.LOW.STARFISH;
    }
    
    if (normalizedTitle.includes("dunk") || normalizedTitle.includes("nike dunk")) {
      if (normalizedTitle.includes("off-white") || normalizedTitle.includes("off white")) {
        return IMAGES.DUNK.OFF_WHITE;
      }
      if (normalizedTitle.includes("panda")) {
        return IMAGES.DUNK.PANDA;
      }
      if (normalizedTitle.includes("unc")) {
        return IMAGES.DUNK.UNC;
      }
      if (normalizedTitle.includes("michigan")) {
        return IMAGES.DUNK.MICHIGAN;
      }
      // Default Dunk
      return IMAGES.DUNK.PANDA;
    }
    
    if (normalizedTitle.includes("nike")) {
      if (normalizedTitle.includes("zoom") || normalizedTitle.includes("vomero")) {
        console.log("Nike Zoom/Vomero match in brand section");
        return IMAGES.NIKE.VOMERO;
      }
      // Try dunks as fallback for Nike
      if (normalizedTitle.includes("dunk")) {
        if (normalizedTitle.includes("michigan")) {
          return IMAGES.DUNK.MICHIGAN;
        }
        if (normalizedTitle.includes("panda")) {
          return IMAGES.DUNK.PANDA;
        }
        if (normalizedTitle.includes("unc")) {
          return IMAGES.DUNK.UNC;
        }
        return IMAGES.DUNK.PANDA;
      }
      // Default Nike
      return IMAGES.DUNK.PANDA;
    }
    
    if (normalizedTitle.includes("puma")) {
      if (normalizedTitle.includes("rs-x") || normalizedTitle.includes("rs x")) {
        return IMAGES.PUMA.RSX_CORE;
      }
      if (normalizedTitle.includes("dreamer") || normalizedTitle.includes("rs-dreamer")) {
        return IMAGES.PUMA.RS_DREAMER;
      }
      // Default Puma
      return IMAGES.PUMA.RSX_CORE;
    }
    
    // Step 4: Use brand-based defaults for unknown models
    for (const [brandName, defaultImage] of Object.entries(BRAND_DEFAULTS)) {
      if (normalizedTitle.includes(brandName)) {
        console.log(`Using brand default for ${brandName}`);
        return defaultImage;
      }
    }
    
    // Step 5: Default fallback if no matching logic found
    console.log(`No match found for: "${normalizedTitle}", using default image`);
    return getDefaultImage();
  } catch (error) {
    console.error("Error loading image for product:", title, error);
    return getDefaultImage();
  }
};

// Get default image for when no image is available
export const getDefaultImage = () => {
  console.log("Using default image (Jordan 1 Low Starfish)");
  return IMAGES.JORDAN.LOW.STARFISH;
}; 
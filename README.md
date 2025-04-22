# Sneakers Shop with AI Search

An e-commerce platform for sneaker enthusiasts featuring an AI-powered search system that provides detailed information about any sneaker model.

## Features

- **AI-Powered Sneaker Search**: Get comprehensive details about any sneaker model, including:
  - History and background
  - Launch information
  - Current market prices across platforms (StockX, GOAT, etc.)
  - Price history and trends
  - Future price predictions
  - Features and benefits
  - Investment potential
  - Buying recommendations

- **Dynamic Product Catalog**: Browse through a collection of popular sneakers
- **User Authentication**: Secure registration and login system
- **Shopping Cart**: Add products to cart and manage quantities
- **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Frontend**: React.js, Styled Components
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **AI Integration**: Google Gemini API for sneaker information

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Gemini API key from Google AI Studio

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/sneakers-shop.git
cd sneakers-shop
```

2. Install dependencies:
```
npm install
cd client && npm install
cd ../server && npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT = 5001
MONGO_URL = mongodb://localhost:27017/SneakerShop
JWT_SECRET = YOUR_JWT_SECRET
GOOGLE_GEMINI_KEY = YOUR_GEMINI_API_KEY
GOOGLE_CUSTOM_SEARCH_KEY = YOUR_CUSTOM_SEARCH_KEY
GOOGLE_CUSTOM_SEARCH_CX = YOUR_CUSTOM_SEARCH_CX
```

4. Start the development server:
```
# Start the backend server
npm run server

# In a separate terminal, start the frontend
cd client && npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run server`: Start the backend server with nodemon
- `npm run client`: Start the frontend client
- `npm run build-client`: Build the frontend for production
- `npm run render-postbuild`: Install and build client for deployment

## License

MIT

# Sneakers Shop App
> E-Commerce App built with the MERN stack.

This is a sample application that demonstrates an E-commerce website using the MEAN stack.
The application loads products a MongoDB database and displays them.
Users can add products to their cart, purchase products and even rate them!
Users can choose exactly which product they want with helpful filtering functionality.

Link: https://sneakers-shop.onrender.com/

## Home page
![screenshot](https://github.com/amitshuu/sneakers-shop/blob/master/uploads/home_page.png)

## Products
![screenshot](https://github.com/amitshuu/sneakers-shop/blob/master/uploads/Products.png)

## User cart && orders
![screehnshot](https://github.com/amitshuu/sneakers-shop/blob/master/uploads/cart_orders.png)

## Admin
![screehnshot](https://github.com/amitshuu/sneakers-shop/blob/master/uploads/Admin.png)

## Image Search API Integration

The application now includes a free web image search integration for more accurate sneaker images. The system uses a hybrid approach:

1. First tries to match with the local catalog of sneaker images
2. If no local match is found, searches the web using Google Custom Search API (free)
3. Falls back to a text-based placeholder if no images are found

### Setup

To enable the web image search:

1. Create a free account at [Google Cloud Console](https://console.cloud.google.com/) 
2. Set up a Custom Search Engine at [Programmable Search Engine](https://programmablesearchengine.google.com/about/)
3. Get your API key and Search Engine ID (cx)
4. Add your credentials to both `.env` files:
   ```
   GOOGLE_CUSTOM_SEARCH_KEY=your_api_key_here
   GOOGLE_CUSTOM_SEARCH_CX=your_search_engine_id_here
   ```

### API Usage Limits

- Google Custom Search JSON API: 100 requests/day (free tier)

The application includes caching to minimize API calls for repeat searches.

# Built with

### Client - 
- React.js
- Apollo Client
- React Redux
- Styled Components
- Material UI
### Server - 
- Node.js
- Express
- GraphQL 
- MongoDB

# Features

- Fully responsive for mobiles

### User -
- Sign in \ Register \ Sign out
- User authentication with jsonwebtoken
- Update profile info
- Reset password option
- Update shipping info
- Filter products by price\color\brand\size
- Sort produdcts by top rated\lowest price\highest price
- Display products in grid view or list view
- Add products to cart && Purchase products
- Remove products from the cart
- View shopping history
- Rating products after purchase
- Top picks products are generated depends on user favorite products

### Admin -
- Add new product to shop page
- Edit an exist product

# Usage

Create a .env file in the root and add the following

```
PORT = 5000
MONGO_URL = YOUR MONGODB URL
JWT_SECRET = ANY JWT SECRET CODE
```

### Install Dependencies (client & server)

```
npm install
cd client
npm install
```

### Run
```
Run frontend (:3000) & backend (:5000)
npm run client
npm run server
```


### Dummy Data 
```
Exit server
Navigate to seeder.js
Run in terminal : node seeder.js
Run the server again.
```


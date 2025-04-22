import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { typeDefs } from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";
import connectDB from "./db/connect.js";
import cors from "cors";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Import AI controllers directly
import aiSearch from "./AImiddleWare/aiController.js";
import getSneakerImage from "./AImiddleWare/imageController.js";
import getSimpleSneakerInfo from "./SimpleAIServices/simpleAiController.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5001"], // Allow requests from frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// AI routes - restore original routes
app.post('/AiSearch', aiSearch);
app.post('/api/sneaker-image', getSneakerImage);

// Simplified AI route that doesn't use Google Cloud
app.post('/SimpleAiSearch', getSimpleSneakerInfo);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app, cors: false }); // Disable Apollo's CORS, we've configured it earlier

    // Debugging: Check if MONGO_URL is defined
    console.log("MONGO_URL:", process.env.MONGO_URL);

    // Connect to MongoDB
    await connectDB(process.env.MONGO_URL);
    
    // Start the server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();

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

import aiSearch from "./AImiddleWare/aiController.js";

const app = express();
app.use(express.json());
app.use(cors());
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post('/AiSearch',aiSearch)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });

  // Debugging: Check if MONGO_URL is defined
  console.log("MONGO_URL:", process.env.MONGO_URL);

  try {
    await connectDB(process.env.MONGO_URL); // FIXED: Changed from MONGO_URI to MONGO_URL
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();

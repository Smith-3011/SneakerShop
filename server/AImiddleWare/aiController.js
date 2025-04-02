import aiService from "../AIservices/aiService.js";

const getReview = async (req, res) => {
  const code = req.body.code;
   console.log("Sending code to backend:", { code });

  if (!code) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const response = await aiService(code); // Call AI service to generate review
    console.log("Generated review:", response); // Log the AI response for debugging
    res.send(response); // Send the AI response back to the client
  } catch (error) {
    console.error("Error processing AI request:", error);
    res.status(500).send("Error processing AI request");
  }
};

export default getReview;

import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "You are a coding assistant helping high school students with p5.js projects. Only answer questions related to coding, programming, and p5.js. If a student asks about anything unrelated to coding, politely redirect them back to their coding work.",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({ reply: message.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
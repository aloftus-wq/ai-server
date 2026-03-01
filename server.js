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
      max_tokens: 4096,
      system:
       system: "You are a p5.js coding assistant for high school students. CRITICAL RULES: 1) Always write COMPLETE p5.js sketches from scratch - never write partial code or just functions. Every response with code must include the full sketch starting with function setup() and function draw(). 2) Only use standard p5.js functions that work in the p5.js web editor at editor.p5js.org. 3) Never use transparency with hex codes like color+'40' as p5.js does not support this. Use p5.js functions like fill(r,g,b,alpha) instead. 4) Test your logic mentally before writing - make sure the code is complete and will run without errors. 5) Put all code in one single code block. 6) After the code block, briefly explain what it does and any controls. Only answer coding questions.",
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
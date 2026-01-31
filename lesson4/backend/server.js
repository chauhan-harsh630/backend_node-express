import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 MUST be before routes
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/summarize", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    if (!req.body || !req.body.text) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    const prompt = `
Summarize the following text.

Output format:
Summary:
<3–4 lines>

Key Points:
- 4–6 bullet points

Text:
"""
${req.body.text}
"""
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      result: response.text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

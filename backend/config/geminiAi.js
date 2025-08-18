import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/apiError.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export const generateAISummary = async (report) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(report);
    return result.response.text();
  } catch (error) {
    throw new ApiError(
      "Failed to generate AI summary. Please try again later.",
      500
    );
  }
};

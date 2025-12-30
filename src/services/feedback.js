import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export async function generateAndStoreFeedback(
  interviewId,
  attemptId,
  questionId,
  question,
  userAnswer,
  expectedAnswer,
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "text/plain"
      }
    })


    const prompt = `
      As an AI interview assistant, provide constructive feedback for the following interview question and answer:

      Question: ${question}
      User's Answer: ${userAnswer}
      Expected Answer: ${expectedAnswer}

      Please provide feedback in the following format:
      1. Strengths: What aspects of the answer were good?
      2. Areas for Improvement: What could be improved or added?
      3. Overall Assessment: A brief overall assessment of the answer.

      Keep the feedback concise, constructive, and encouraging.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    // Store the feedback in the database
    const answerRef = doc(db, "interviews", interviewId, "attempts", attemptId, "answers", questionId)
    await updateDoc(answerRef, {
      aiFeedback: feedback,
    })

    return feedback
  } catch (error) {
    console.error("Error generating or storing feedback:", error)
    return "We're sorry, but we couldn't generate feedback at this time. Please review the expected answer for guidance."
  }
}

// Add this line to export the function with the name used in FeedbackPage.jsx
export const generateFeedback = generateAndStoreFeedback


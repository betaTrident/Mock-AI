import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '../config/apiKeys';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateQuestions(interviewData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate 5 technical interview questions for a ${interviewData.role} position.
      The candidate has ${interviewData.experience} years of experience.
      Tech stack: ${interviewData.description}
      Difficulty level: ${interviewData.difficulty}

      Format the response as a JSON array with objects containing:
      - question: the interview question
      - expectedAnswer: detailed expected answer for scoring
      - maxScore: maximum score for this question (1-10)
      - keyPoints: array of key points that should be mentioned for full score

      Ensure the JSON is properly formatted without any control characters or line breaks within strings.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('Raw AI Response:', text);

    text = text.trim();  // Ensure extra whitespace is removed
    text = text.replace(/\\n/g, ' ').replace(/\s+/g, ' ');  // Replace line breaks and multiple spaces

    // Remove non-JSON content using regex to extract the JSON array
    text = text.replace(/^[\s\S]*?(\[[\s\S]*\])[\s\S]*$/, '$1');

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      console.error('Received text:', text);  // Log the response that caused the error
      throw new Error('Failed to generate valid JSON.');
    }

    // Ensure the array contains only the first 5 questions
    if (Array.isArray(questions) && questions.length > 5) {
      questions = questions.slice(0, 5); // Limit to 5 questions
    }

    return questions;

  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}
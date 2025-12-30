import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateQuestions(interviewData) {
  try {
    // 1. UPDATE: Use a currently supported model (e.g., gemini-2.5-flash)
    // 2. UPDATE: Enable 'application/json' to force structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json" 
      }
    });

    console.log("API Key available:", !!import.meta.env.VITE_GEMINI_API_KEY);

    const prompt = `
      Generate 5 technical interview questions for a ${interviewData.role} position.
      The candidate has ${interviewData.experience} years of experience.
      Tech stack: ${interviewData.description}
      Difficulty level: ${interviewData.difficulty}

      Output must be a JSON array with objects containing:
      - question: the interview question
      - expectedAnswer: detailed expected answer for scoring
      - maxScore: maximum score for this question (1-10)
      - keyPoints: array of key points that should be mentioned for full score
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw AI Response:', text);

    // 3. UPDATE: Simplified Parsing
    // Because we used responseMimeType: "application/json", the AI returns clean JSON.
    // We no longer need complex Regex to strip markdown.
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      // Fallback: Use your old regex ONLY if clean parse fails (rare)
      const cleanedText = text.replace(/^[\s\S]*?(\[[\s\S]*\])[\s\S]*$/, '$1');
      questions = JSON.parse(cleanedText);
    }

    // Ensure the array contains only the first 5 questions
    if (Array.isArray(questions) && questions.length > 5) {
      questions = questions.slice(0, 5); 
    }

    return questions;

  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}
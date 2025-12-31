import { doc, setDoc, collection, getDoc } from "firebase/firestore"
import { db } from "../../src/firebase"
import { getAuth } from "firebase/auth"

export async function saveAnswer(interviewId, attemptId, questionIndex, answer, question) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error("User is not authenticated")
  }

  try {
    console.log("Attempting to save answer for interview:", interviewId, "attempt:", attemptId)
    console.log("Current user:", user.uid)

    const interviewRef = doc(db, "interviews", interviewId)
    const interviewDoc = await getDoc(interviewRef)

    if (!interviewDoc.exists()) {
      throw new Error("Interview not found")
    }

    const interviewData = interviewDoc.data()
    console.log("Interview data:", interviewData)

    // Check if the current user is the owner of the interview
    if (interviewData.userId !== user.uid) {
      throw new Error("You do not have permission to save answers for this interview.")
    }

    const answersRef = collection(db, 'interviews', interviewId, 'attempts', attemptId, 'answers');
    await setDoc(doc(answersRef, `question_${questionIndex}`), {
      question: question.question,
      userAnswer: answer,
      expectedAnswer: question.expectedAnswer,
      maxScore: question.maxScore,
      keyPoints: question.keyPoints,
      timestamp: new Date().toISOString(),
    })

    console.log("Answer saved successfully")
  } catch (error) {
    console.error("Error saving answer:", error)
    throw error
  }
}

export function calculateScore(answer, keyPoints) {
  let score = 0
  const answerLower = answer.toLowerCase()

  keyPoints.forEach((point) => {
    const pointLower = point.toLowerCase()
    if (answerLower.includes(pointLower)) {
      score++
    } else {
      // Check for partial matches or synonyms
      const words = pointLower.split(" ")
      const partialMatch = words.some((word) => answerLower.includes(word))
      if (partialMatch) {
        score += 0.5
      }
    }
  })

  return (score / keyPoints.length) * 10
}


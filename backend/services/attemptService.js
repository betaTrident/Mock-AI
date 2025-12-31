import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  writeBatch,
} from "firebase/firestore"
import { db } from "../../src/firebase"
import { getAuth } from "firebase/auth"

export async function createAttempt(interviewId) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error("User is not authenticated")
  }

  try {
    // First, clean up any incomplete attempts
    await cleanupIncompleteAttempts(interviewId)

    const attemptData = {
      interviewId,
      userId: user.uid,
      status: "in-progress",
      startedAt: new Date(),
      questionsAnswered: 0,
      totalQuestions: 5,
      score: 0,
      completedAt: null,
    }

    const attemptsRef = collection(db, "interviews", interviewId, "attempts")
    const attemptDoc = await addDoc(attemptsRef, attemptData)

    return attemptDoc.id
  } catch (error) {
    console.error("Error creating attempt:", error)
    throw error
  }
}

// New function to clean up incomplete attempts
async function cleanupIncompleteAttempts(interviewId) {
  try {
    const attemptsRef = collection(db, "interviews", interviewId, "attempts")
    const q = query(attemptsRef, where("status", "==", "in-progress"))
    const snapshot = await getDocs(q)

    // Delete all incomplete attempts
    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
  } catch (error) {
    console.error("Error cleaning up incomplete attempts:", error)
    throw error
  }
}

// New function to check for existing incomplete attempt
export async function hasIncompleteAttempt(interviewId) {
  try {
    const attemptsRef = collection(db, "interviews", interviewId, "attempts")
    const q = query(attemptsRef, where("status", "==", "in-progress"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error("Error checking incomplete attempts:", error)
    throw error
  }
}

export async function updateAttempt(interviewId, attemptId, data) {
  try {
    const attemptRef = doc(db, "interviews", interviewId, "attempts", attemptId)
    await updateDoc(attemptRef, data)
  } catch (error) {
    console.error("Error updating attempt:", error)
    throw error
  }
}

export async function getAttempts(interviewId) {
  try {
    const attemptsRef = collection(db, "interviews", interviewId, "attempts")
    const q = query(
      attemptsRef,
      where("status", "==", "completed"), // Only get completed attempts
      orderBy("startedAt", "desc"),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Ensure dates are properly converted from Firestore Timestamps
      startedAt: doc.data().startedAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    }))
  } catch (error) {
    console.error("Error fetching attempts:", error)
    throw error
  }
}

export async function completeAttempt(interviewId, attemptId) {
  try {
    const averageScore = await calculateAndUpdateAttemptScore(interviewId, attemptId)
    return averageScore
  } catch (error) {
    console.error("Error completing attempt:", error)
    throw error
  }
}

export async function calculateAndUpdateAttemptScore(interviewId, attemptId) {
  try {
    const answersRef = collection(db, "interviews", interviewId, "attempts", attemptId, "answers")
    const answersSnapshot = await getDocs(answersRef)
    let totalScore = 0
    let questionCount = 0

    answersSnapshot.forEach((doc) => {
      const answer = doc.data()
      if (answer.userAnswer && answer.keyPoints) {
        const score = calculateScore(answer.userAnswer, answer.keyPoints)
        totalScore += score
        questionCount++
      }
    })

    const averageScore = questionCount > 0 ? totalScore / questionCount : 0

    // Update the attempt with the calculated score
    const attemptRef = doc(db, "interviews", interviewId, "attempts", attemptId)
    await updateDoc(attemptRef, {
      score: averageScore,
      status: "completed",
      completedAt: new Date(),
    })

    return averageScore
  } catch (error) {
    console.error("Error calculating and updating attempt score:", error)
    throw error
  }
}

function calculateScore(answer, keyPoints) {
  if (!answer || !keyPoints || keyPoints.length === 0) return 0

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

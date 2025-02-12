
// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { doc, getDoc, collection, getDocs } from "firebase/firestore"
// import { db } from "../firebase"
// import Navbar from "./Navbar"
// import { Loader2, CheckCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
// import confetti from "canvas-confetti"
// import { generateFeedback } from "../services/feedback"
// import { getAttempts } from "../services/attemptService"

// const PASSING_SCORE = 5.0 

// export default function FeedbackPage() {
//   const [feedback, setFeedback] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [openQuestions, setOpenQuestions] = useState({})
//   const [attempts, setAttempts] = useState([])
//   const [selectedAttempt, setSelectedAttempt] = useState(null)
//   const navigate = useNavigate()

//   const fetchFeedback = async (interviewId, attemptId) => {
//     console.log("Fetching feedback for interview:", interviewId, "attempt:", attemptId)
//     try {
//       setIsLoading(true)
//       const interviewDoc = await getDoc(doc(db, "interviews", interviewId))

//       if (!interviewDoc.exists()) {
//         throw new Error("Interview not found")
//       }

//       const interviewData = interviewDoc.data()

//       // Fetch all attempts for this interview
//       const attemptHistory = await getAttempts(interviewId)
//       setAttempts(attemptHistory)

//       // Set the current attempt as selected
//       const currentAttempt = attemptHistory.find((a) => a.id === attemptId)
//       setSelectedAttempt(currentAttempt)

//       let answersSnapshot
//       try {
//         answersSnapshot = await getDocs(collection(db, "interviews", interviewId, "attempts", attemptId, "answers"))
//         console.log("Successfully retrieved answers:", answersSnapshot.size)
//       } catch (error) {
//         console.error("Error fetching answers:", error)
//         throw new Error(`Failed to fetch answers: ${error.message}`)
//       }

//       if (answersSnapshot.empty) {
//         console.warn("No answers found for this attempt")
//         setFeedback({
//           interviewData,
//           answers: [],
//           averageScore: 0,
//         })
//         setIsLoading(false)
//         return
//       }

//       const answersData = answersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))

//       const scoredAnswers = await Promise.all(
//         answersData.map(async (answer) => {
//           const score = calculateScore(answer.userAnswer, answer.keyPoints)
//           let aiFeedback = answer.aiFeedback
//           if (!aiFeedback) {
//             aiFeedback = await generateFeedback(
//               interviewId,
//               attemptId,
//               answer.id,
//               answer.question,
//               answer.userAnswer,
//               answer.expectedAnswer,
//             )
//           }
//           return { ...answer, score, aiFeedback }
//         }),
//       )

//       const totalScore = scoredAnswers.reduce((sum, answer) => sum + answer.score, 0)
//       const averageScore = scoredAnswers.length > 0 ? totalScore / scoredAnswers.length : 0

//       setFeedback({
//         interviewData,
//         answers: scoredAnswers,
//         averageScore,
//       })

//       setIsLoading(false)

//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//       })
//     } catch (error) {
//       console.error("Error fetching feedback:", error)
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     const interviewId = localStorage.getItem("currentInterviewId")
//     const attemptId = localStorage.getItem("currentAttemptId")
//     fetchFeedback(interviewId, attemptId)
//   }, [])

//   const calculateScore = (answer, keyPoints) => {
//     if (!answer || !keyPoints || keyPoints.length === 0) return 0

//     let score = 0
//     const answerLower = answer.toLowerCase()

//     keyPoints.forEach((point) => {
//       const pointLower = point.toLowerCase()
//       if (answerLower.includes(pointLower)) {
//         score++
//       } else {
//         const words = pointLower.split(" ")
//         const partialMatch = words.some((word) => answerLower.includes(word))
//         if (partialMatch) {
//           score += 0.5
//         }
//       }
//     })

//     return (score / keyPoints.length) * 10
//   }

//   const handleBackToDashboard = () => {
//     navigate("/dashboard")
//   }

//   const toggleQuestion = (id) => {
//     setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
//   }

//   const handleAttemptSelect = (attempt) => {
//     setSelectedAttempt(attempt)
//     const interviewId = localStorage.getItem("currentInterviewId")
//     fetchFeedback(interviewId, attempt.id)
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
//           <p className="mt-4 text-gray-600">Preparing your interview feedback...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!feedback) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-xl text-red-600">Failed to load feedback. Please try again later.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//         <button
//           onClick={handleBackToDashboard}
//           className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//         </button>

//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Attempt History</h2>
//           <div className="space-y-2">
//             {attempts.map((attempt, index) => (
//               <button
//                 key={attempt.id}
//                 onClick={() => handleAttemptSelect(attempt)}
//                 className={`w-full text-left p-4 rounded-lg transition-colors ${
//                   selectedAttempt?.id === attempt.id ? "bg-blue-100" : "hover:bg-gray-100"
//                 }`}
//               >
//                 <span className="font-medium">Attempt {attempts.length - index}</span>
//                 <span className="ml-4 text-sm text-gray-600">
//                   {attempt.startedAt instanceof Date
//                     ? attempt.startedAt.toLocaleString()
//                     : new Date(attempt.startedAt).toLocaleString()}
//                 </span>
//                 <span className="ml-4 font-bold">
//                   {typeof attempt.score === "number" ? `${attempt.score.toFixed(2)}/10` : "N/A"}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h1 className="text-3xl font-bold text-center mb-4">Interview Feedback</h1>
//           <div className="flex items-center justify-center mb-4">
//             <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
//             <p className="text-2xl font-semibold">Congratulations on completing your interview!</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xl mb-2">Your overall score:</p>
//             <div className="flex items-center justify-center">
//               <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-blue-600 rounded-full"
//                   style={{ width: `${feedback.averageScore * 10}%` }}
//                 ></div>
//               </div>
//               <span className="ml-4 text-2xl font-bold">{feedback.averageScore.toFixed(2)} / 10</span>
//             </div>
//           </div>
//           <div className="mt-6 text-center">
//             {feedback.averageScore >= PASSING_SCORE ? (
//               <p className="text-xl font-semibold text-green-600">Congratulations! You have passed the interview.</p>
//             ) : (
//               <div>
//                 <p className="text-xl font-semibold text-red-600 mb-2">
//                   Unfortunately, you did not pass the interview.
//                 </p>
//                 <p className="text-gray-700">
//                   We recommend retaking the interview to improve your score. Practice makes perfect!
//                 </p>
//                 <button
//                   onClick={() => navigate("/interview-setup")}
//                   className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Retake Interview
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-4">
//           {feedback.answers.map((answer, index) => (
//             <div key={answer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <button
//                 onClick={() => toggleQuestion(answer.id)}
//                 className="w-full px-4 py-3 text-left text-lg font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
//               >
//                 <span>Question {index + 1}</span>
//                 {openQuestions[answer.id] ? (
//                   <ChevronUp className="h-5 w-5 text-gray-500" />
//                 ) : (
//                   <ChevronDown className="h-5 w-5 text-gray-500" />
//                 )}
//               </button>
//               {openQuestions[answer.id] && (
//                 <div className="px-4 py-3 text-sm text-gray-700">
//                   <h3 className="font-semibold text-lg text-gray-900 mb-2">{answer.question}</h3>
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-700">Your Answer:</h4>
//                     <p className="bg-gray-50 p-3 rounded mt-1">{answer.userAnswer}</p>
//                   </div>
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-700">Expected Answer:</h4>
//                     <p className="bg-gray-50 p-3 rounded mt-1">{answer.expectedAnswer}</p>
//                   </div>
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-700">Score:</h4>
//                     <div className="flex items-center mt-1">
//                       <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden mr-4">
//                         <div
//                           className="h-full bg-blue-600 rounded-full"
//                           style={{ width: `${answer.score * 10}%` }}
//                         ></div>
//                       </div>
//                       <p className="text-lg font-bold">{answer.score.toFixed(2)} / 10</p>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-700">Feedback:</h4>
//                     <div className="bg-blue-50 p-3 rounded mt-1 whitespace-pre-wrap">{answer.aiFeedback}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import Navbar from "./Navbar"
import { Loader2, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import confetti from "canvas-confetti"
import { generateFeedback } from "../services/feedback"
import { getAttempts } from "../services/attemptService"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const PASSING_SCORE = 5.0

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openQuestions, setOpenQuestions] = useState({})
  const [attempts, setAttempts] = useState([])
  const [selectedAttempt, setSelectedAttempt] = useState(null)
  const [improvement, setImprovement] = useState(null)
  const [chartData, setChartData] = useState([])
  const navigate = useNavigate()

  const fetchFeedback = async (interviewId, attemptId) => {
    console.log("Fetching feedback for interview:", interviewId, "attempt:", attemptId)
    try {
      setIsLoading(true)
      const interviewDoc = await getDoc(doc(db, "interviews", interviewId))

      if (!interviewDoc.exists()) {
        throw new Error("Interview not found")
      }

      const interviewData = interviewDoc.data()

      // Fetch all attempts for this interview
      const attemptHistory = await getAttempts(interviewId)
      setAttempts(attemptHistory)

      // Set the current attempt as selected
      const currentAttempt = attemptHistory.find((a) => a.id === attemptId)
      setSelectedAttempt(currentAttempt)

      // Calculate improvement
      if (attemptHistory.length > 1 && currentAttempt && typeof currentAttempt.score === "number") {
        const sortedAttempts = attemptHistory.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
        const currentScore = currentAttempt.score
        const previousScore =
          sortedAttempts[1] && typeof sortedAttempts[1].score === "number" ? sortedAttempts[1].score : null
        if (previousScore !== null) {
          const improvementValue = currentScore - previousScore
          setImprovement(improvementValue)
        } else {
          setImprovement(null)
        }
      } else {
        setImprovement(null)
      }

      // Prepare chart data
      const chartData = attemptHistory
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
        .map((attempt) => ({
          date: new Date(attempt.startedAt).toLocaleDateString(),
          score: attempt.score,
        }))
      setChartData(chartData)

      let answersSnapshot
      try {
        answersSnapshot = await getDocs(collection(db, "interviews", interviewId, "attempts", attemptId, "answers"))
        console.log("Successfully retrieved answers:", answersSnapshot.size)
      } catch (error) {
        console.error("Error fetching answers:", error)
        throw new Error(`Failed to fetch answers: ${error.message}`)
      }

      if (answersSnapshot.empty) {
        console.warn("No answers found for this attempt")
        setFeedback({
          interviewData,
          answers: [],
          averageScore: 0,
        })
        setIsLoading(false)
        return
      }

      const answersData = answersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const scoredAnswers = await Promise.all(
        answersData.map(async (answer) => {
          const score = calculateScore(answer.userAnswer, answer.keyPoints)
          let aiFeedback = answer.aiFeedback
          if (!aiFeedback) {
            aiFeedback = await generateFeedback(
              interviewId,
              attemptId,
              answer.id,
              answer.question,
              answer.userAnswer,
              answer.expectedAnswer,
            )
          }
          return { ...answer, score, aiFeedback }
        }),
      )

      const totalScore = scoredAnswers.reduce((sum, answer) => sum + answer.score, 0)
      const averageScore = scoredAnswers.length > 0 ? totalScore / scoredAnswers.length : 0

      setFeedback({
        interviewData,
        answers: scoredAnswers,
        averageScore,
      })

      setIsLoading(false)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (error) {
      console.error("Error fetching feedback:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const interviewId = localStorage.getItem("currentInterviewId")
    const attemptId = localStorage.getItem("currentAttemptId")
    if (interviewId && attemptId) {
      fetchFeedback(interviewId, attemptId)
    } else {
      console.error("Missing interviewId or attemptId")
      setIsLoading(false)
    }
  }, []) // Removed fetchFeedback from dependencies

  const calculateScore = (answer, keyPoints) => {
    if (!answer || !keyPoints || keyPoints.length === 0) return 0

    let score = 0
    const answerLower = answer.toLowerCase()

    keyPoints.forEach((point) => {
      const pointLower = point.toLowerCase()
      if (answerLower.includes(pointLower)) {
        score++
      } else {
        const words = pointLower.split(" ")
        const partialMatch = words.some((word) => answerLower.includes(word))
        if (partialMatch) {
          score += 0.5
        }
      }
    })

    return (score / keyPoints.length) * 10
  }

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAttemptSelect = (attempt) => {
    if (attempt && attempt.id) {
      setSelectedAttempt(attempt)
      const interviewId = localStorage.getItem("currentInterviewId")
      fetchFeedback(interviewId, attempt.id)
    } else {
      console.error("Invalid attempt selected")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Preparing your interview feedback...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">Failed to load feedback. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Attempt History</h2>
          <div className="space-y-2">
            {attempts
              .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
              .map((attempt, index) => (
                <button
                  key={attempt.id}
                  onClick={() => handleAttemptSelect(attempt)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedAttempt?.id === attempt.id ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">
                    Attempt {attempts.length - index}
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Latest
                      </span>
                    )}
                  </span>
                  <span className="ml-4 text-sm text-gray-600">
                    {attempt.startedAt instanceof Date
                      ? attempt.startedAt.toLocaleString()
                      : new Date(attempt.startedAt).toLocaleString()}
                  </span>
                  <span className="ml-4 font-bold">
                    {attempt && typeof attempt.score === "number" ? `${attempt.score.toFixed(2)}/10` : "N/A"}
                  </span>
                </button>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Interview Feedback</h1>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
            <p className="text-2xl font-semibold">Congratulations on completing your interview!</p>
          </div>
          <div className="text-center">
            <p className="text-xl mb-2">Your overall score:</p>
            <div className="flex items-center justify-center">
              <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${feedback.averageScore * 10}%` }}
                ></div>
              </div>
              <span className="ml-4 text-2xl font-bold">{feedback.averageScore.toFixed(2)} / 10</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            {feedback.averageScore >= PASSING_SCORE ? (
              <p className="text-xl font-semibold text-green-600">Congratulations! You have passed the interview.</p>
            ) : (
              <div>
                <p className="text-xl font-semibold text-red-600 mb-2">
                  Unfortunately, you did not pass the interview.
                </p>
                <p className="text-gray-700">
                  We recommend retaking the interview to improve your score. Practice makes perfect!
                </p>
                <button
                  onClick={() => navigate("/interview-setup")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retake Interview
                </button>
              </div>
            )}
          </div>
          {improvement !== null && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
              {improvement > 0 ? (
                <div className="flex items-center justify-center text-green-600">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <p>Your score has increased by {improvement.toFixed(2)} points!</p>
                </div>
              ) : improvement < 0 ? (
                <div className="flex items-center justify-center text-red-600">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  <p>Your score has decreased by {Math.abs(improvement).toFixed(2)} points. Keep practicing!</p>
                </div>
              ) : (
                <p className="text-gray-600">Your score remains the same as your previous attempt.</p>
              )}
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {feedback.answers.map((answer, index) => (
            <div key={answer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleQuestion(answer.id)}
                className="w-full px-4 py-3 text-left text-lg font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
              >
                <span>Question {index + 1}</span>
                {openQuestions[answer.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openQuestions[answer.id] && (
                <div className="px-4 py-3 text-sm text-gray-700">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{answer.question}</h3>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Your Answer:</h4>
                    <p className="bg-gray-50 p-3 rounded mt-1">{answer.userAnswer}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Expected Answer:</h4>
                    <p className="bg-gray-50 p-3 rounded mt-1">{answer.expectedAnswer}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Score:</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden mr-4">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${answer.score * 10}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-bold">{answer.score.toFixed(2)} / 10</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Feedback:</h4>
                    <div className="bg-blue-50 p-3 rounded mt-1 whitespace-pre-wrap">{answer.aiFeedback}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


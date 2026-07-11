import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'

import type { FeedbackReportData } from '@/components/interview/FeedbackReport'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 8, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 24 },
  score: { fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
  section: { marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 'bold' },
  item: { marginBottom: 4, lineHeight: 1.4 },
  question: { marginTop: 8, padding: 8, backgroundColor: '#f5f5f5' },
})

type FeedbackPdfDocumentProps = {
  report: FeedbackReportData
  role?: string
}

export function FeedbackPdfDocument({ report, role }: FeedbackPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>MockAI Interview Feedback</Text>
        {role ? <Text style={styles.subtitle}>{role}</Text> : null}
        <Text style={styles.score}>{report.percentageScore}%</Text>
        <Text style={styles.subtitle}>
          {report.overallScore} / {report.maxScore} points
        </Text>

        <Text style={styles.section}>Per-Question Scores</Text>
        {report.perQuestionScores.map((q) => (
          <View key={q.questionIndex} style={styles.question}>
            <Text style={styles.item}>
              Q{q.questionIndex + 1}: {q.score}/{q.maxScore} — {q.questionText}
            </Text>
            <Text style={styles.item}>{q.feedback}</Text>
          </View>
        ))}

        <Text style={styles.section}>Strengths</Text>
        {report.strengths.map((item) => (
          <Text key={item} style={styles.item}>
            • {item}
          </Text>
        ))}

        <Text style={styles.section}>Areas for Improvement</Text>
        {report.areasForImprovement.map((item) => (
          <Text key={item} style={styles.item}>
            • {item}
          </Text>
        ))}

        <Text style={styles.section}>Practice Plan</Text>
        <Text style={styles.item}>{report.practicePlan.summary}</Text>
        {report.practicePlan.weeklyGoals.map((goal) => (
          <View key={goal.week}>
            <Text style={styles.item}>
              Week {goal.week}: {goal.goal}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export async function renderFeedbackPdf(
  report: FeedbackReportData,
  role?: string
): Promise<Buffer> {
  return renderToBuffer(<FeedbackPdfDocument report={report} role={role} />)
}

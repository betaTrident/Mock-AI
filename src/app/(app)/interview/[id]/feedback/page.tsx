import { FeedbackPageClient } from "@/components/interview/FeedbackPageClient"

type FeedbackPageProps = {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { id } = await params
  return <FeedbackPageClient attemptId={id} />
}

import { PublicFeedbackPageClient } from "@/components/interview/PublicFeedbackPageClient"

type PublicFeedbackPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PublicFeedbackPage({ params }: PublicFeedbackPageProps) {
  const { slug } = await params
  return <PublicFeedbackPageClient slug={slug} />
}

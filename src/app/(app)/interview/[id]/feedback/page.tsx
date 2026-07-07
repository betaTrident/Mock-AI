type FeedbackPageProps = {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { id } = await params
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Feedback — {id}</h1>
    </main>
  )
}

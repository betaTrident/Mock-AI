type InterviewPageProps = {
  params: Promise<{ id: string }>
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { id } = await params
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Interview {id}</h1>
    </main>
  )
}

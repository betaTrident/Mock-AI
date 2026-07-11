import {
  AgentCoachSection,
  FeedbackReportSection,
  FinalCTA,
  Footer,
  HeroSection,
  HowItWorksSection,
  Navbar,
  PrivacySection,
  ProductShowcase,
  TrustStrip,
  UseCasesSection,
} from "@/components/landing"

export default function HomePage() {
  return (
    <div className="landing-page flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <HowItWorksSection />
        <ProductShowcase />
        <AgentCoachSection />
        <UseCasesSection />
        <FeedbackReportSection />
        <PrivacySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

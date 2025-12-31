"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Brain, Target, TrendingUp, ChevronRight, Zap, Shield, Users, Award, CheckCircle, ArrowRight } from "lucide-react"
import "./Homepage.css"

export default function Homepage() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="homepage-container">
      <div className="animated-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Header with glassmorphism effect */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon-wrapper">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="logo-text">MockAI</h1>
          </div>
          <nav className="nav-buttons">
            <button onClick={() => navigate("/login")} className="btn btn-text">
              Login
            </button>
            <button onClick={() => navigate("/registration")} className="btn btn-primary">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          {/* Badge with animation */}
          <div className="badge-wrapper animate-fade-in">
            <div className="badge">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Interview Practice</span>
            </div>
          </div>

          {/* Main Heading with staggered animation */}
          <div className="heading-wrapper">
            <h2 className="main-heading animate-slide-up">
              Master Your Next <span className="gradient-text">Interview with AI</span>
            </h2>
          </div>

          {/* Subheading */}
          <p className="subheading animate-fade-in-delay">
            Practice real interview scenarios with our AI-powered mock interviews. Get instant feedback and improve your
            skills with personalized insights.
          </p>

          {/* CTA Buttons with hover effects */}
          <div className="cta-buttons">
            <button
              onClick={() => navigate("/registration")}
              className="btn btn-primary btn-lg btn-icon-right animate-slide-up-delay-2"
            >
              <span>Get Started Free</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button onClick={() => navigate("/login")} className="btn btn-secondary btn-lg animate-slide-up-delay-2">
              Sign In
            </button>
          </div>

          {/* Stats Section */}
          <div className="stats-section animate-fade-in-delay">
            <StatItem number="10K+" label="Active Users" />
            <StatItem number="50K+" label="Interviews Completed" />
            <StatItem number="95%" label="Success Rate" />
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-cube"></div>
          <div className="floating-sphere"></div>
          <div className="floating-ring"></div>
          <div className="glow-effect"></div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h3 className="section-title">Why Choose MockAI</h3>
          <p className="section-subtitle">Everything you need to ace your next interview</p>
        </div>
        
        <div className="features-grid">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-indigo-400" />}
            title="AI-Powered Questions"
            description="Get industry-relevant questions tailored to your role and experience level"
            delay="0"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-purple-400" />}
            title="Real-Time Feedback"
            description="Receive instant, constructive feedback on your answers to improve quickly"
            delay="1"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-pink-400" />}
            title="Track Progress"
            description="Monitor your improvement over time with detailed performance analytics"
            delay="2"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-400" />}
            title="Instant Analysis"
            description="Get immediate scoring and detailed breakdowns of your interview performance"
            delay="0"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-green-400" />}
            title="Secure & Private"
            description="Your data is encrypted and never shared. Practice with complete confidence"
            delay="1"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-blue-400" />}
            title="Industry Experts"
            description="Questions crafted by hiring managers and industry professionals"
            delay="2"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h3 className="section-title">How It Works</h3>
          <p className="section-subtitle">Get started in three simple steps</p>
        </div>
        
        <div className="steps-container">
          <StepCard
            number="01"
            title="Create Your Profile"
            description="Sign up and tell us about your role, experience, and interview goals"
            icon={<Users className="h-8 w-8" />}
          />
          <StepCard
            number="02"
            title="Practice Interview"
            description="Answer AI-generated questions tailored to your specific needs"
            icon={<Brain className="h-8 w-8" />}
          />
          <StepCard
            number="03"
            title="Get Feedback"
            description="Review detailed feedback and improve your interview skills instantly"
            icon={<Award className="h-8 w-8" />}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h3 className="cta-title">Ready to Ace Your Interview?</h3>
          <p className="cta-subtitle">Join thousands of successful candidates who improved their skills with MockAI</p>
          <button onClick={() => navigate("/registration")} className="btn btn-primary btn-lg btn-icon-right cta-button">
            <span>Start Practicing Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="cta-features">
          <CTAFeature icon={<CheckCircle className="h-5 w-5" />} text="No credit card required" />
          <CTAFeature icon={<CheckCircle className="h-5 w-5" />} text="Free trial included" />
          <CTAFeature icon={<CheckCircle className="h-5 w-5" />} text="Cancel anytime" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 MockAI. Ace your interviews with confidence.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`feature-card animate-slide-up-delay-${delay}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-8px) rotateX(5deg)" : "translateY(0)",
      }}
    >
      <div className="card-glow"></div>
      <div className="card-content">
        <div className="icon-wrapper">{icon}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  )
}

function StatItem({ number, label }) {
  return (
    <div className="stat-item">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="step-card">
      <div className="step-number-wrapper">
        <div className="step-number">{number}</div>
      </div>
      <div className="step-icon">{icon}</div>
      <h4 className="step-title">{title}</h4>
      <p className="step-description">{description}</p>
    </div>
  )
}

function CTAFeature({ icon, text }) {
  return (
    <div className="cta-feature">
      {icon}
      <span>{text}</span>
    </div>
  )
}

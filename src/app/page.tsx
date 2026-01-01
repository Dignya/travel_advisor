import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AIChatPanel from '@/components/AIChatPanel'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AIChatPanel />
    </div>
  )
}
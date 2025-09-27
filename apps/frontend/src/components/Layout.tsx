import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import AnimatedBackground from './AnimatedBackground'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

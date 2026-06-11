import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Trust from './components/Trust'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Benefits from './components/Benefits'
import Testimonials from './components/Testimonials'
import Impact from './components/Impact'
import CTA from './components/CTA'
import Footer from './components/Footer'
import AssessmentDemo from './components/AssessmentDemo'
import LoanApplicationForm from './components/LoanApplicationForm'


function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <HowItWorks />
      <Features />
      <Benefits />
      <Testimonials />
      <Impact />
      <CTA />
    </>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/apply" element={<LoanApplicationForm />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

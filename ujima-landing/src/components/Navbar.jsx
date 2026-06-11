import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppLogo from './AppLogo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'How It Works', hash: '#how-it-works' },
    { label: 'Features', hash: '#features' },
    { label: 'Impact', hash: '#impact' },
  ]

  const scrollToHash = (hash) => {
    window.setTimeout(() => {
      const target = document.getElementById(hash.replace('#', ''))
      if (!target) return

      const navOffset = 88
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top, behavior: 'smooth' })
    }, 80)
  }

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      scrollToHash(location.hash)
    } else if (location.pathname === '/') {
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
    }
  }, [location.pathname, location.hash])

  const handleHomeClick = () => {
    setIsOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSectionClick = (hash) => (event) => {
    event.preventDefault()
    setIsOpen(false)

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash })
      return
    }

    navigate({ hash })
    scrollToHash(hash)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed z-50 w-full bg-white bg-opacity-95 shadow-lg backdrop-blur-md"
    >
      <div className="section-container">
        <div className="flex h-20 items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <Link to="/" className="flex items-center" aria-label="Ujima Loan Pride home">
              <AppLogo />
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) =>
              item.to ? (
                <motion.div key={item.label} whileHover={{ scale: 1.1 }}>
                  <Link
                    to={item.to}
                    onClick={handleHomeClick}
                    className="font-medium text-darkSlate transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={handleSectionClick(item.hash)}
                  whileHover={{ scale: 1.1, color: '#D4AF37' }}
                  className="bg-transparent font-medium text-darkSlate transition-colors hover:text-gold"
                >
                  {item.label}
                </motion.button>
              )
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/apply"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold tracking-wide text-forestGreen transition-colors hover:bg-forestGreen hover:text-white"
              >
                APPLY LOAN
              </Link>
            </motion.div>
          </div>

          <button className="text-forestGreen md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pb-4 md:hidden"
          >
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block font-medium text-darkSlate hover:text-gold"
                  onClick={handleHomeClick}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="block bg-transparent text-left font-medium text-darkSlate hover:text-gold"
                  onClick={handleSectionClick(item.hash)}
                >
                  {item.label}
                </button>
              )
            )}
            <Link
              to="/apply"
              className="block w-fit rounded-lg bg-gold px-5 py-2.5 text-sm font-bold tracking-wide text-forestGreen transition-colors hover:bg-forestGreen hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              APPLY LOAN
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

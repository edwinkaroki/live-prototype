import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  const floatingCards = [
    { text: '✓ Loan Approved', delay: 0, icon: '📋' },
    { text: '✓ AI Analysis Complete', delay: 0.3, icon: '🤖' },
    { text: '✓ Financial Insights', delay: 0.6, icon: '💡' },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-forestGreen via-forestGreen to-darkSlate pt-20 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-10 w-64 h-64 bg-gold bg-opacity-5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-cream bg-opacity-5 rounded-full blur-3xl"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Access Fair Loans <span className="text-gold">Without Leaving</span> Anyone Behind
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-cream mb-8 leading-relaxed"
            >
              Ujima Loan Pride uses intelligent AI agents to help SACCOs assess loan applications fairly for farmers, market vendors, and small business owners across Kenya.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center gap-2 group"
                onClick={() => navigate('/apply')}
              >

                Apply for a Loan
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-white border-white hover:bg-white hover:text-forestGreen"
              >
                Explore Dashboard
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Floating Cards */}
          <div className="relative h-full flex items-center justify-center">
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: card.delay }}
                className="absolute glass p-6 rounded-xl text-white font-semibold backdrop-blur-xl"
                style={{
                  width: '250px',
                  top: `${20 + index * 25}%`,
                  right: `${10 + index * 15}%`,
                }}
              >
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex items-center gap-3"
                >
                  <span className="text-3xl">{card.icon}</span>
                  <span>{card.text}</span>
                </motion.div>
              </motion.div>
            ))}

            {/* Illustration Placeholder */}
            <motion.div
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="w-full h-64 bg-gradient-to-b from-gold to-transparent rounded-3xl opacity-10 blur-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

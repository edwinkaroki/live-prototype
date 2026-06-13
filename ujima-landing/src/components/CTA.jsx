import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, TrendingUp, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CTA() {
  const navigate = useNavigate()

  const floatingIcons = [
    { icon: DollarSign, top: '10%', left: '5%', delay: 0 },
    { icon: TrendingUp, top: '60%', left: '10%', delay: 1 },
    { icon: Shield, top: '20%', right: '8%', delay: 0.5 },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-forestGreen via-darkSlate to-forestGreen">
        {/* Floating Icons Background */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={index}
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute opacity-10"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
              }}
            >
              <Icon size={80} className="text-gold" />
            </motion.div>
          )
        })}

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-20 w-72 h-72 bg-gold rounded-full blur-3xl opacity-5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 right-20 w-96 h-96 bg-cream rounded-full blur-3xl opacity-5"
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Empowering Every Hustle with Fair Access to Credit
          </h2>
          <p className="text-xl text-cream max-w-2xl mx-auto mb-8">
            Join thousands of SACCO members and officers who are already experiencing fair, transparent, and intelligent loan decisions.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <motion.button

              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gold text-forestGreen rounded-xl font-bold text-lg flex items-center gap-3 group hover:shadow-2xl transition-all"
              onClick={() => navigate('/apply')}
            >

              Start Loan Application
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </motion.button>


          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-cream text-cream rounded-xl font-bold text-lg hover:bg-cream hover:text-forestGreen transition-all"
          >
            Request SACCO Demo
          </motion.button>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: '⚡',
              title: 'Fast Decisions',
              desc: 'Loan approvals in minutes, not weeks',
            },
            {
              icon: '✅',
              title: 'Fair Treatment',
              desc: 'AI removes unconscious bias from lending',
            },
            {
              icon: '📱',
              title: 'Easy Access',
              desc: 'Mobile-first design for all Kenyans',
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="glass rounded-2xl p-6 text-center text-white backdrop-blur-xl"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
              <p className="text-cream text-opacity-90">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

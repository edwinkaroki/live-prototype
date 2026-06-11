import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, MapPin } from 'lucide-react'

const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const increment = end / (duration * 60)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function Trust() {
  const stats = [
    { icon: TrendingUp, label: 'Applications Processed', value: 5000, suffix: '+' },
    { icon: DollarSign, label: 'Loans Facilitated', value: 12, suffix: 'M KES' },
    { icon: Users, label: 'Fair Assessment Accuracy', value: 92, suffix: '%' },
    { icon: MapPin, label: 'Counties Served', value: 47, suffix: '' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Trusted by SACCOs & Communities
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            Real impact across Kenya with transparent, fair lending
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(20, 83, 45, 0.1)' }}
                className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl border border-gold border-opacity-20 text-center cursor-pointer transition-all"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4"
                >
                  <Icon className="text-gold" size={40} />
                </motion.div>
                <div className="mb-2">
                  <div className="text-4xl md:text-5xl font-bold text-forestGreen">
                    <AnimatedCounter end={stat.value} />
                    <span className="text-gold">{stat.suffix}</span>
                  </div>
                </div>
                <p className="text-darkSlate font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

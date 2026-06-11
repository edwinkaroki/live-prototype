import { motion } from 'framer-motion'
import { MapPin, Users, Briefcase, Heart } from 'lucide-react'

export default function Impact() {
  const impactStats = [
    {
      icon: MapPin,
      number: '47',
      label: 'Counties Reached',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Heart,
      number: '12K+',
      label: 'Families Supported',
      color: 'from-red-400 to-red-600',
    },
    {
      icon: Briefcase,
      number: '8K+',
      label: 'Businesses Empowered',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Users,
      number: '15K+',
      label: 'Members Impacted',
      color: 'from-purple-400 to-purple-600',
    },
  ]

  return (
    <section id="impact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Map Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 w-96 h-96 bg-forestGreen rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Our Impact Across Kenya
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            Transforming lives through fair, accessible lending across the nation
          </p>
        </motion.div>

        {/* Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -15 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-cream to-white rounded-2xl p-8 border border-gold border-opacity-30 text-center h-full hover:shadow-xl transition-all">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:shadow-lg transition-all`}
                  >
                    <Icon size={32} />
                  </motion.div>

                  <h3 className="text-4xl font-bold text-forestGreen mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-darkSlate text-opacity-70 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Map-inspired visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-forestGreen via-darkSlate to-forestGreen rounded-3xl p-12 text-center text-white overflow-hidden relative"
        >
          {/* Animated dots representing counties */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 20, -20, 0],
                  y: [0, -20, 20, 0],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-3 h-3 bg-gold rounded-full opacity-30"
                style={{
                  left: `${(i * 15) % 90}%`,
                  top: `${(i * 13) % 90}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Expanding Across Kenya</h3>
            <p className="text-xl text-cream mb-6 max-w-2xl mx-auto">
              From Mombasa to Western Kenya, from Northern pastoralists to Southern farmers – Ujima Loan Pride brings fair lending to every corner of the nation.
            </p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-gold font-semibold text-lg"
            >
              ✨ Reaching new communities every month ✨
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

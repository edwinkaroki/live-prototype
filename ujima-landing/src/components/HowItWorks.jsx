import { motion } from 'framer-motion'
import { Compass, Shield, Target, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const agents = [
    {
      icon: Compass,
      title: 'Scout Agent',
      description: 'Analyzes income patterns, harvest cycles, and financial literacy needs to build a comprehensive member profile.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Shield,
      title: 'Guardian Agent',
      description: 'Applies fair loan assessment rules while preventing bias against informal workers and agricultural sectors.',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      icon: Target,
      title: 'Hunter Agent',
      description: 'Prepares human officers with concise review briefs for complex applications requiring expert judgment.',
      color: 'from-amber-400 to-amber-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            How Our AI Agents Work Together
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            A coordinated team of intelligent agents ensures fair, accurate, and transparent loan assessments
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -15,
                  boxShadow: '0 30px 60px rgba(20, 83, 45, 0.15)',
                }}
                className="relative bg-white rounded-2xl p-8 border border-gold border-opacity-20 overflow-hidden group cursor-pointer transition-all"
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 rounded-full -mr-10 -mt-10 transition-all duration-300`} />

                {/* Content */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative z-10"
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center text-white mb-6`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Icon size={32} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-forestGreen mb-3">
                    {agent.title}
                  </h3>
                  <p className="text-darkSlate leading-relaxed mb-4">
                    {agent.description}
                  </p>

                  {/* Connection Line */}
                  {index < agents.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <ArrowRight className="text-gold" size={32} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Number */}
                <div className="absolute top-4 right-4 text-4xl font-bold text-gold opacity-20">
                  {index + 1}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Process Flow Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-forestGreen to-darkSlate rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-3">Seamless Integration</h3>
          <p className="text-lg text-cream">
            Our agents work in perfect harmony, each contributing their expertise to deliver fair, accurate loan decisions in minutes, not weeks.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

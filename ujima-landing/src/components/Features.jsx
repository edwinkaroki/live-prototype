import { motion } from 'framer-motion'
import { Zap, Scale, BookOpen, Users, BarChart3, TrendingUp } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'AI Loan Assessment',
      description: 'Advanced algorithms analyze applicant data in seconds for rapid decisions',
    },
    {
      icon: Scale,
      title: 'Fair Lending Decisions',
      description: 'Eliminates bias and ensures every applicant is treated equitably',
    },
    {
      icon: BookOpen,
      title: 'Financial Literacy Coaching',
      description: 'Personalized guidance to help members improve financial health',
    },
    {
      icon: Users,
      title: 'Human Review Support',
      description: 'Officers get intelligent briefs for informed manual reviews',
    },
    {
      icon: BarChart3,
      title: 'SACCO Analytics Dashboard',
      description: 'Real-time insights into loan portfolio and member trends',
    },
    {
      icon: TrendingUp,
      title: 'Revenue & Loan Tracking',
      description: 'Monitor performance metrics and optimize lending strategies',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Powerful Features Built for You
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            Everything you need to make fair lending decisions and support your members
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px rgba(20, 83, 45, 0.1)',
                }}
                className="bg-gradient-to-br from-cream to-white rounded-2xl p-8 border border-gold border-opacity-30 transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-14 h-14 bg-gradient-to-br from-forestGreen to-darkSlate rounded-xl flex items-center justify-center text-white mb-6 group-hover:shadow-lg transition-all"
                >
                  <Icon size={28} />
                </motion.div>

                <h3 className="text-xl font-bold text-forestGreen mb-3">
                  {feature.title}
                </h3>
                <p className="text-darkSlate text-opacity-70">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-1 bg-gradient-to-r from-gold to-transparent rounded-full mt-6"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

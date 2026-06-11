import { motion } from 'framer-motion'
import { CheckCircle, Clock, Eye, Smartphone, FileText, TrendingUp } from 'lucide-react'

export default function Benefits() {
  const memberBenefits = [
    { icon: Clock, text: 'Faster decisions' },
    { icon: Eye, text: 'Transparent assessments' },
    { icon: CheckCircle, text: 'Fair treatment' },
    { icon: Smartphone, text: 'Mobile accessibility' },
  ]

  const officerBenefits = [
    { icon: FileText, text: 'Reduced paperwork' },
    { icon: Eye, text: 'Better decision support' },
    { icon: TrendingUp, text: 'Increased efficiency' },
    { icon: CheckCircle, text: 'Better loan monitoring' },
  ]

  const BenefitCard = ({ icon: Icon, text }) => (
    <motion.div
      whileHover={{ x: 10 }}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gold hover:bg-opacity-10 transition-all group"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        className="w-12 h-12 bg-gradient-to-br from-gold to-cream rounded-lg flex items-center justify-center text-forestGreen flex-shrink-0 group-hover:shadow-lg transition-all"
      >
        <Icon size={24} />
      </motion.div>
      <span className="text-lg font-semibold text-darkSlate">{text}</span>
    </motion.div>
  )

  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Benefits For Everyone
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            Whether you're a SACCO member or officer, Ujima makes lending fair and efficient
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Members */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-forestGreen mb-3 flex items-center gap-3">
                <span className="text-4xl">👥</span>
                For SACCO Members
              </h3>
              <p className="text-darkSlate text-opacity-70">
                Get faster, fairer loan decisions that respect your situation
              </p>
            </div>

            <div className="space-y-3">
              {memberBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BenefitCard {...benefit} />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full mt-8"
            >
              Apply as a Member
            </motion.button>
          </motion.div>

          {/* For Officers */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-forestGreen mb-3 flex items-center gap-3">
                <span className="text-4xl">👔</span>
                For SACCO Officers
              </h3>
              <p className="text-darkSlate text-opacity-70">
                Work smarter with intelligent decision support and analytics
              </p>
            </div>

            <div className="space-y-3">
              {officerBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BenefitCard {...benefit} />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary w-full mt-8"
            >
              Request Demo
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

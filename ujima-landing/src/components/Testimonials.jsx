import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Jane Kipchoge',
      role: 'Maize Farmer, Kakamega',
      content: 'Ujima approved my loan in 3 days without any bias against farming. The process was transparent and fair. I was able to buy better seeds and doubled my harvest this season.',
      avatar: '👩‍🌾',
      rating: 5,
    },
    {
      name: 'Peter Mwangi',
      role: 'Market Vendor, Nairobi',
      content: 'As an informal worker, banks always rejected me. Ujima understood my income patterns and gave me a fair chance. My business has grown 40% since getting the loan.',
      avatar: '👨‍💼',
      rating: 5,
    },
    {
      name: 'Grace Omondi',
      role: 'Trader, Busia',
      content: 'The AI agents were incredibly thorough. They looked at my actual business cycles, not just paper numbers. I finally got the credit I deserved.',
      avatar: '👩‍💼',
      rating: 5,
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Stories of Success
          </h2>
          <p className="text-xl text-darkSlate max-w-2xl mx-auto">
            Real people from Kenya sharing their Ujima Loan Pride journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: '0 30px 60px rgba(20, 83, 45, 0.1)',
              }}
              className="bg-white rounded-2xl p-8 border border-gold border-opacity-20 hover:border-opacity-100 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="fill-gold text-gold" size={18} />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <p className="text-darkSlate text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="text-5xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-forestGreen text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-darkSlate text-opacity-60 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-gold to-transparent rounded-full mt-6"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

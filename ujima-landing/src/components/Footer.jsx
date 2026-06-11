import { motion } from 'framer-motion'
import { Facebook, Linkedin, MessageCircle, Twitter } from 'lucide-react'
import AppLogo from './AppLogo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Dashboard', 'API Docs'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Guides', 'FAQ', 'Support'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'],
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  ]

  return (
    <footer id="contact" className="relative overflow-hidden bg-forestGreen text-cream">
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold blur-3xl"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="mb-12 grid grid-cols-1 gap-12 py-16 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="mb-4">
              <AppLogo size={44} light />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-cream text-opacity-80">
              Fair AI-Powered Lending for Kenya's Hustlers, Farmers, and Traders
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gold bg-opacity-20 text-gold transition-all hover:bg-opacity-40"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="md:col-span-1"
            >
              <h4 className="mb-6 text-lg font-bold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: '#D4AF37' }}
                      className="text-sm text-cream text-opacity-80 transition-colors hover:text-gold"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 h-px bg-gradient-to-r from-gold to-transparent"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-between py-8 text-sm text-cream text-opacity-70 md:flex-row"
        >
          <p>© {currentYear} Ujima Loan Pride. All Rights Reserved.</p>
          <p className="mt-4 text-center md:mt-0 md:text-right">Empowering Fair Lending Across Kenya</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 rounded-2xl border border-gold border-opacity-20 bg-gold bg-opacity-10 p-8 text-center"
        >
          <h3 className="mb-3 text-2xl font-bold text-white">Stay Updated</h3>
          <p className="mb-6 text-cream text-opacity-90">Get the latest updates on fair lending and financial inclusion</p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-gold border-opacity-30 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-cream placeholder-opacity-60 transition-all focus:border-gold focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-gold px-6 py-3 font-bold text-forestGreen transition-all hover:shadow-lg"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

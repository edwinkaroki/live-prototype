import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader, CheckCircle, AlertCircle, Copy } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AssessmentDemo() {
  // Legacy demo page (kept for reference). Main flow is now /apply.

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef(null)

  // Frontend must not request or store API keys. Server provides API key from its .env.

  const handleAssess = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Assessment failed')
      }

      setResults(data)
      setShowResults(true)

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setError(err.message || 'Failed to connect to API server')
      console.error('Assessment error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white py-20">
      <div className="section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-forestGreen mb-4">
            Live Loan Assessment Demo
          </h1>
          <p className="text-xl text-darkSlate">
            Watch Ujima's AI agents assess loan applications in real-time
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 border border-gold border-opacity-30 shadow-lg mb-8"
        >
          <form onSubmit={handleAssess} className="space-y-6">
            <div>
              <p className="text-sm text-darkSlate text-opacity-80">
                This demo uses the server-side API key configured in the backend (.env). No
                API key is requested or stored in your browser.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Running Assessment...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Run Assessment on 3 Profiles
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-8 flex gap-4 items-start"
            >
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-800 mb-1">Assessment Failed</h3>
                <p className="text-red-700">{error}</p>
                {error.includes('API') && (
                  <p className="text-sm text-red-600 mt-2">
                    Make sure the Flask API server is running on port 5000.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && results && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-forestGreen to-darkSlate rounded-2xl p-8 text-white text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="text-gold" size={32} />
                  <h2 className="text-3xl font-bold">Assessment Complete</h2>
                </div>
                <p className="text-cream text-lg">
                  {results.summary.total_processed} applications processed successfully
                </p>
                <p className="text-cream text-opacity-80 text-sm mt-2">
                  {new Date(results.summary.timestamp).toLocaleString()}
                </p>
              </motion.div>

              {/* Results Cards */}
              <div className="space-y-6">
                {results.results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-2xl border border-gold border-opacity-20 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-forestGreen to-darkSlate p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {result.member_profile?.name || `Applicant ${index + 1}`}
                      </h3>
                      <p className="text-cream mb-3">
                        {result.member_profile?.occupation} • KES {result.member_profile?.loan_amount_kes?.toLocaleString()} requested
                      </p>
                      <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                        result.decision === 'APPROVED' ? 'bg-green-400 text-green-900' :
                        result.decision === 'DENIED' ? 'bg-red-400 text-red-900' :
                        'bg-yellow-400 text-yellow-900'
                      }`}>
                        Decision: {result.decision || 'PENDING'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Scout Analysis */}
                      {result.scout_json && (
                        <div>
                          <h4 className="text-lg font-bold text-forestGreen mb-3 flex items-center gap-2">
                            <span className="text-2xl">🧭</span>
                            Scout Analysis
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(result.scout_json).map(([key, value]) => (
                              <div key={key} className="bg-cream rounded-lg p-4">
                                <p className="text-sm text-darkSlate text-opacity-70 font-medium capitalize">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-forestGreen font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Guardian Decision */}
                      {result.guardian_json && (
                        <div>
                          <h4 className="text-lg font-bold text-forestGreen mb-3 flex items-center gap-2">
                            <span className="text-2xl">🛡️</span>
                            Guardian Decision
                          </h4>
                          <div className="bg-gradient-to-br from-cream to-white border border-gold border-opacity-30 rounded-lg p-4">
                            {Object.entries(result.guardian_json).map(([key, value]) => (
                              <div key={key} className="mb-2 last:mb-0">
                                <span className="font-semibold text-forestGreen capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>
                                <span className="ml-2 text-darkSlate">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hunter Output */}
                      {result.hunter_output && (
                        <div>
                          <h4 className="text-lg font-bold text-forestGreen mb-3 flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            Hunter Briefing
                          </h4>
                          <div className="bg-cream rounded-lg p-4 max-h-64 overflow-y-auto">
                            <p className="text-darkSlate whitespace-pre-wrap text-sm">
                              {result.hunter_output}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error State */}
                      {result.error && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                          <p className="text-red-700 font-semibold">Error: {result.error}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Copy Results Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Copy size={20} />
                Copy Full Results as JSON
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!showResults && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-darkSlate text-opacity-60 text-lg">
              Click "Run Assessment" to see AI agents in action
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function About() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Avatar animé */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg cursor-pointer"
      >
        <img
          src="/sary.png"
          alt="Sylvano Albertin"
          className="w-full h-full rounded-full border-2 border-white object-cover"
        />
      </motion.div>

      {/* Carte d'infos */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-20 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  <img
                    src="/sary.png"
                    alt="Sylvano"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('about.name')}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">{t('about.title')}</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {t('about.description')}
              </p>

              <div className="flex gap-2">
                <a
                  href="https://noalbertin.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('about.portfolio')}
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('about.close')}
                </button>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

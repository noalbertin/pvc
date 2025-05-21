'use client'

import { IoLanguage } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion"

const languages = ['fr', 'en']
const languageLabels: Record<string, string> = {
  fr: 'Français',
  en: 'English'
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  const currentLang = i18n.language

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-2 rounded-lg
          md:px-3 md:py-2 md:rounded-md md:border md:border-gray-300
          md:dark:border-gray-700 md:bg-slate-100 md:dark:bg-gray-800
          text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800
          md:hover:text-indigo-500 md:dark:hover:text-indigo-500
          transition-colors"
        aria-label="Change language"
      >
        <IoLanguage className="text-lg" />
        <span className="hidden md:inline ml-2">
          {languageLabels[currentLang]}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-md mt-2 p-2 text-sm w-32"
          >
            {languages.map((lng) => (
              <li
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`
                  cursor-pointer px-3 py-1 rounded
                  dark:text-gray-100 text-slate-800
                  hover:text-indigo-500 dark:hover:text-indigo-500
                  transition-colors
                  ${currentLang === lng ? 'font-semibold' : ''}
                `}
              >
                {languageLabels[lng]}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

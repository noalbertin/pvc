import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { useTranslation } from 'react-i18next'

export default function CardExpliquer() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const icons = [
    {
      icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
      key: "cities",
    },
    {
      icon: "M12 2L3 21h18L12 2zm0 4.5l5.66 9.5H6.34L12 6.5z",
      key: "optimal",
    },
    {
      icon: "M13 2v2h5.25L4 21.25 5.27 22 22 5.25V9h2V2H13zm-3 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
      key: "complexity",
    },
    {
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15l1.17 1.17c.39.39 1.02.39 1.41 0l2.83-2.83 1.41 1.41-3.54 3.54c-.39.39-1.02.39-1.41 0L10 14.17l-1.09 1.09C10.14 16.54 12 18 12 18v1.93z",
      key: "heuristics",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {t('Header.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('description')}
        </p>
        
        <motion.div 
          whileHover={{ x: 5 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
        >
          <span className="font-medium"> {t('learn_more')}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6l6 6-6 6"/>
          </svg>
        </motion.div>
        
      </motion.div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-3xl w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {t('Header.title')}
            </Dialog.Title>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
             {t('dialog.intro')}
            </p>
            {/* Reutilisation du contenu de Tspcard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {icons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {t(`dialog.features.${item.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t(`dialog.features.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                 {t('dialog.close')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

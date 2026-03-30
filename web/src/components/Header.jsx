import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed w-full z-50 glass-effect bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center relative z-50">
              <span className="font-bold text-2xl text-brand-accent-blue font-sans tracking-tight">
                Обои<span className="text-brand-accent-graphite">67</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#services" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Услуги</a>
              <a href="#calculator" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Калькулятор</a>
              <a href="#portfolio" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Работы</a>
              <a href="#contact" className="px-5 py-2.5 rounded-full bg-brand-accent-blue text-white text-sm font-medium hover:bg-blue-900 transition-all shadow-md hover:shadow-lg">Обсудить проект</a>
            </div>

            {/* Mobile Burger Button */}
            <div className="md:hidden flex items-center relative z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-accent-blue focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center space-y-8 w-full px-6">
              <a onClick={closeMenu} href="#services" className="text-2xl font-bold text-brand-accent-graphite min-h-[44px] flex items-center justify-center w-full">Услуги</a>
              <a onClick={closeMenu} href="#calculator" className="text-2xl font-bold text-brand-accent-graphite min-h-[44px] flex items-center justify-center w-full">Калькулятор</a>
              <a onClick={closeMenu} href="#portfolio" className="text-2xl font-bold text-brand-accent-graphite min-h-[44px] flex items-center justify-center w-full">Работы</a>
              <a onClick={closeMenu} href="#contact" className="px-8 py-4 w-full text-center rounded-full bg-brand-accent-blue text-white text-xl font-bold min-h-[44px] mt-4 shadow-xl shadow-blue-900/20 active:scale-95 transition-transform">
                Обсудить проект
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React from 'react'
import Hero from './components/Hero'
import Services from './components/Services'
import Calculator from './components/Calculator'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'

function App() {
  return (
    <div className="min-h-screen bg-brand-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-brand-accent-blue font-sans tracking-tight">Юрий<span className="text-brand-accent-graphite">.Обои</span></span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Услуги</a>
              <a href="#calculator" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Калькулятор</a>
              <a href="#portfolio" className="text-sm font-medium text-gray-700 hover:text-brand-accent-blue transition-colors">Работы</a>
              <a href="#contact" className="px-5 py-2.5 rounded-full bg-brand-accent-blue text-white text-sm font-medium hover:bg-blue-900 transition-all shadow-md hover:shadow-lg">Обсудить проект</a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Services />
        <Calculator />
        <Portfolio />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-brand-gray-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
           &copy; {new Date().getFullYear()} Профессиональная поклейка обоев. Смоленск. Все права защищены.
        </div>
      </footer>
    </div>
  )
}

export default App

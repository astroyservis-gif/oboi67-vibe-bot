import React from 'react'
import Hero from './components/Hero'
import Services from './components/Services'
import Calculator from './components/Calculator'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-brand-white">
      <Header />

      <main>
        <Hero />
        <Services />
        <Calculator />
        <Portfolio />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-brand-gray-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-700 text-sm">
          &copy; {new Date().getFullYear()} Профессиональная поклейка обоев. Смоленск. Все права защищены.
        </div>
      </footer>
    </div>
  )
}

export default App

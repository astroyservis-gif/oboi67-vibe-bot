import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';

const projects = [
  {
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80",
    realityImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80",
    title: "Дизайнерские обои с подгоном",
    desc: "Спальня, 45 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80",
    realityImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
    title: "Бесшовные флизелиновые",
    desc: "Гостиная, 60 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80",
    realityImage: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80",
    title: "Геометрический паттерн",
    desc: "Детская, 20 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80",
    realityImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    title: "Эксклюзивные текстильные",
    desc: "Кабинет, 30 м²"
  }
];

const PortfolioCard = ({ project, index }) => {
  const [showReality, setShowReality] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden bg-brand-gray aspect-[4/3] block shadow-sm hover:shadow-xl transition-shadow"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={showReality ? 'reality' : 'design'}
          src={showReality ? (project.realityImage || project.image) : project.image}
          alt={project.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-brand-accent-graphite/90 via-transparent to-transparent opacity-80 transition-opacity duration-300 pointer-events-none"></div>

      <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded z-10 pointer-events-none">
        <span className="text-white text-[10px] md:text-xs font-bold tracking-wider uppercase">
          {showReality ? 'РЕАЛЬНОСТЬ (Работа Юры)' : 'ВИЗУАЛИЗАЦИЯ (AI-дизайн)'}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 p-6 md:p-8 transform translate-y-0 transition-transform duration-300 w-full pointer-events-none pb-20 md:pb-24">
        <p className="text-white/80 text-sm mb-2">{project.desc}</p>
        <h3 className="text-xl md:text-2xl font-bold text-white">{project.title}</h3>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-max">
        <button
          onClick={() => setShowReality(!showReality)}
          className="flex items-center gap-2 bg-white/95 hover:bg-white text-brand-accent-graphite px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-xl transition-all active:scale-95"
        >
          <Eye className="w-4 h-4 md:w-5 md:h-5" />
          {showReality ? 'Посмотреть дизайн' : 'Посмотреть реальность'}
        </button>
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-accent-graphite mb-4">
              Галерея работ
            </h2>
            <p className="text-lg text-gray-600">
              Посмотрите на примеры наших реальных проектов. Идеальные стыки, сложные паттерны и безупречная чистота линий.
            </p>
          </div>
          <a href="https://www.instagram.com/yuriy_29041985/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-brand-accent-blue font-semibold hover:text-blue-800 active:scale-95 transition-all">
            Больше работ в Instagram →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <PortfolioCard key={index} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

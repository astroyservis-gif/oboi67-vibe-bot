import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80",
    title: "Дизайнерские обои с подгоном",
    desc: "Спальня, 45 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80",
    title: "Бесшовные флизелиновые",
    desc: "Гостиная, 60 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80",
    title: "Геометрический паттерн",
    desc: "Детская, 20 м²"
  },
  {
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80",
    title: "Эксклюзивные текстильные",
    desc: "Кабинет, 30 м²"
  }
];

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
          <a href="https://www.instagram.com/yuriy_29041985/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-brand-accent-blue font-semibold hover:text-blue-800 transition-colors">
            Больше работ в Instagram →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-brand-gray aspect-[4/3] block shadow-sm hover:shadow-xl transition-shadow"
            >
              <img
                src={project.image}
                alt={project.title}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-accent-graphite/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="absolute bottom-0 left-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white/80 text-sm mb-2">{project.desc}</p>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

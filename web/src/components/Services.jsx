import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Droplets, Maximize, Target } from 'lucide-react';

const standards = [
  {
    icon: <Maximize className="w-6 h-6 text-brand-accent-blue" />,
    title: "Идеальные стыки",
    description: "Используем технологию «невидимого шва». Обои выглядят как единое полотно без изъянов.",
  },
  {
    icon: <Target className="w-6 h-6 text-brand-accent-blue" />,
    title: "Лазерная разметка",
    description: "Применяем профессиональные лазерные уровни для абсолютной геометрической точности оклейки.",
  },
  {
    icon: <Droplets className="w-6 h-6 text-brand-accent-blue" />,
    title: "Чистота после работы",
    description: "Работаем с промышленными пылесосами FESTOOL. Оставляем объект полностью готовым к жизни.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-brand-accent-blue" />,
    title: "Точный расчет материала",
    description: "Помогаем оптимизировать закупку обоев с учетом подгона рисунка, экономя ваш бюджет.",
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-accent-graphite mb-4">
            Стандарты качества
          </h2>
          <p className="text-lg text-gray-600">
            Мы не просто клеим обои, мы создаем эстетику вашего пространства с помощью премиального подхода и оборудования.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((standard, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-accent-blue group-hover:text-white transition-colors">
                {React.cloneElement(standard.icon, { className: 'w-6 h-6 text-brand-accent-blue group-hover:text-white transition-colors' })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{standard.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {standard.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

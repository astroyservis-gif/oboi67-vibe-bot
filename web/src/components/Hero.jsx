import React from 'react';
import { motion } from 'framer-motion';
import Ruler from 'lucide-react/dist/esm/icons/ruler';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-white">
      {/* Abstract Background Element for Light Theme */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-50 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-gray-100 to-gray-50 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gray-dark text-brand-accent-graphite text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-brand-accent-blue" />
              <span>Частный мастер</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-accent-graphite leading-tight mb-6 tracking-tight">
              Поклейка обоев в Смоленске <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent-blue to-gray-600">
                без стыков и лишних хлопот
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              Профессиональный подход к отделке стен. Использую профессиональный инструмент для идеального результата и абсолютной чистоты.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#calculator" className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-brand-accent-blue text-white font-medium hover:bg-blue-900 active:scale-95 transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5">
                Рассчитать стоимость
              </a>
              <a href="#portfolio" className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-brand-gray hover:bg-brand-gray-dark active:scale-95 text-brand-accent-graphite font-medium transition-all shadow-sm">
                Смотреть работы
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Гарантия 1 год</p>
                  <p className="text-xs text-gray-600">По договору</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-brand-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Точно в срок</p>
                  <p className="text-xs text-gray-600">Без задержек</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-brand-gray aspect-[4/3] border border-gray-100">
              <img
                src="https://cdn.oboi67.ru/optimized/phote_about_me.webp"
                srcSet="https://cdn.oboi67.ru/optimized/phote_about_me-400w.webp 400w, https://cdn.oboi67.ru/optimized/phote_about_me.webp 700w"
                sizes="(max-width: 600px) 400px, 700px"
                alt="Идеально поклеенные обои"
                className="object-cover w-full h-full"
                fetchpriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 glass-effect flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-accent-blue/10 flex items-center justify-center text-brand-accent-blue font-bold text-xl">
                10+
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Лет опыта</p>
                <p className="text-xs text-gray-600">сотни довольных клиентов</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

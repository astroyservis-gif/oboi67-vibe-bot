import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator as CalcIcon, Info, CheckCircle2, ChevronRight } from 'lucide-react';

const BASE_PRICE = 300;

export default function Calculator() {
  // --- Refs & View Tracking ---
  const sectionRef = useRef(null);

  // --- State ---
  const [area, setArea] = useState(20);
  const [dismantle, setDismantle] = useState(false);
  const [complexPattern, setComplexPattern] = useState(false);
  const [paper, setPaper] = useState(false);
  const [primer, setPrimer] = useState(false);

  const [radiatorsDismantle, setRadiatorsDismantle] = useState(false);
  const [radiatorsCount, setRadiatorsCount] = useState(1);
  const [ceilingInsert, setCeilingInsert] = useState(false);
  const [ceilingMeters, setCeilingMeters] = useState(1);
  const [complexElectrical, setComplexElectrical] = useState(false);
  const [complexElectricalCount, setComplexElectricalCount] = useState(1);

  const [showSticky, setShowSticky] = useState(false);
  const hasInteracted =
    area !== 20 || paper || dismantle || primer || complexPattern || radiatorsDismantle || ceilingInsert || complexElectrical;

  // --- Calculations ---
  const total = useMemo(() => {
    let costPerSqm = BASE_PRICE;
    if (complexPattern) costPerSqm += 100;
    if (paper) costPerSqm += 100;
    if (primer) costPerSqm += 70;

    let baseTotal = area * costPerSqm;
    if (dismantle) baseTotal += (area * 150);
    if (radiatorsDismantle) baseTotal += (radiatorsCount * 500);
    if (ceilingInsert) baseTotal += (ceilingMeters * 100);
    if (complexElectrical) baseTotal += (complexElectricalCount * 300);

    return baseTotal;
  }, [area, dismantle, complexPattern, paper, primer, radiatorsDismantle, radiatorsCount, ceilingInsert, ceilingMeters, complexElectrical, complexElectricalCount]);

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => {
      // Футер появляется если мы проскроллили 2800px И находимся в зоне калькулятора
      const scrollPosition = window.scrollY;
      setShowSticky(scrollPosition > 2800 && scrollPosition < 3800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="calculator"
      className="py-16 md:py-24 bg-slate-50/50 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-200 relative z-10"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-14">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0 rotate-3">
                <CalcIcon className="text-white w-7 h-7 -rotate-3" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Цена на поклейку обоев в Смоленске</h2>
                <p className="text-slate-500 text-sm md:text-base font-medium">Рассчитайте стоимость за 1 минуту</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Актуальные цены на 2026
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* LEFT COLUMN: Inputs */}
            <div className="lg:col-span-7 space-y-10">

              {/* Area Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Параметры стен</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-600">{area}</span>
                    <span className="text-lg font-bold text-slate-400">м²</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="15"
                  max="300"
                  step="1"
                  value={area}
                  onInput={(e) => setArea(Number(e.target.value))}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 transition-all hover:bg-slate-300 select-none"
                />
              </div>

              {/* Main Toggles */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'paper', label: 'Бумажные обои', desc: 'Узкое полотно 0.5м, требует опыта', state: paper, setter: setPaper },
                  { id: 'dismantle', label: 'Демонтаж старых обоев', desc: 'Снятие слоев и базовая очистка', state: dismantle, setter: setDismantle },
                  { id: 'pattern', label: 'Сложный подбор рисунка', desc: 'Раппорт, смещение и подгонка', state: complexPattern, setter: setComplexPattern },
                  { id: 'primer', label: 'Грунтовка стен', desc: 'Подготовка стен', state: primer, setter: setPrimer }
                ].map((item) => (
                  <motion.label
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${item.state ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                  >
                    <div className="flex-1">
                      <span className="block font-bold text-slate-900">{item.label}</span>
                      <span className="block text-xs text-slate-500 font-medium">{item.desc}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.state ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      }`}>
                      {item.state && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={item.state} onChange={(e) => item.setter(e.target.checked)} />
                  </motion.label>
                ))}
              </div>

              {/* Engineering Works Section */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Инженерные работы</h3>
                <div className="space-y-4">

                  {/* Radiators Toggle */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${radiatorsDismantle ? 'border-blue-600' : 'border-slate-100'}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-slate-900 text-sm md:text-base">Радиаторы отопления</span>
                      <input type="checkbox" checked={radiatorsDismantle} onChange={(e) => setRadiatorsDismantle(e.target.checked)} className="w-5 h-5 accent-blue-600" />
                    </label>
                    <AnimatePresence>
                      {radiatorsDismantle && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Количество:</span>
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button onClick={() => setRadiatorsCount(Math.max(1, radiatorsCount - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all">-</button>
                              <span className="w-8 text-center font-bold">{radiatorsCount}</span>
                              <button onClick={() => setRadiatorsCount(radiatorsCount + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all">+</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Потолочная вставка */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${ceilingInsert ? 'border-blue-600' : 'border-slate-100'}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-slate-900 text-sm md:text-base">Потолочная вставка</span>
                      <input
                        type="checkbox"
                        checked={ceilingInsert}
                        onChange={(e) => setCeilingInsert(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                    </label>
                    <AnimatePresence>
                      {ceilingInsert && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Метров погонных:</span>
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() => setCeilingMeters(Math.max(1, ceilingMeters - 1))}
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold">{ceilingMeters}</span>
                              <button
                                onClick={() => setCeilingMeters(ceilingMeters + 1)}
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Блок Электроприборы */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${complexElectrical ? 'border-blue-600' : 'border-slate-100'}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-slate-900 text-sm md:text-base">Электроприборы</span>
                      <input
                        type="checkbox"
                        checked={complexElectrical}
                        onChange={(e) => setComplexElectrical(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                    </label>
                    <AnimatePresence>
                      {complexElectrical && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Количество:</span>
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() => setComplexElectricalCount(Math.max(1, complexElectricalCount - 1))}
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold">{complexElectricalCount}</span>
                              <button
                                onClick={() => setComplexElectricalCount(complexElectricalCount + 1)}
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Result Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-6">
                <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                  <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">Итоговая цена за работу</span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <motion.span
                      key={total}
                      initial={{ scale: 1.1, color: "#60a5fa" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      className="text-5xl md:text-6xl font-black"
                    >
                      {total.toLocaleString('ru-RU')}
                    </motion.span>
                    <span className="text-2xl font-bold text-slate-400">₽</span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Цена является предварительной. Точная смета составляется после бесплатного замера.
                        В калькуляторе указана средняя цена за квадратный метр поклейки обоев в Смоленске на 2026 год
                      </p>
                    </div>
                  </div>

                  {/* Benefit list */}
                  <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-xl">🛡️</span> Честная цена "Под ключ"
                    </h4>
                    <ul className="space-y-3">
                      {['Сложные углы — без доплат', 'Вырезы под розетки — 0 ₽'].map((text) => (
                        <li key={text} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="#contact"
                    className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-center flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20"
                  >
                    Получить точную смету
                    <ChevronRight className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* STICKY MOBILE FOOTER */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-50 p-5 pb-8 border-t border-slate-100 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Оценка</span>
              <motion.div
                key={total}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-black text-slate-900 flex items-baseline gap-1"
              >
                {!hasInteracted && <span className="text-sm font-bold text-slate-400">от</span>}
                {total.toLocaleString('ru-RU')}
                <span className="text-lg font-bold text-slate-400 font-black">₽</span>
              </motion.div>
            </div>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors"
            >
              Обсудить проект
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Info } from 'lucide-react';

const BASE_PRICE = 300; // базовый тариф за м² (пример)

export default function Calculator() {
  const [area, setArea] = useState(20);
  const [primer, setPrimer] = useState(false);
  const [dismantle, setDismantle] = useState(false);
  const [complexPattern, setComplexPattern] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let costPerSqm = BASE_PRICE;
    if (primer) costPerSqm += 50;
    if (complexPattern) costPerSqm += 100;
    
    let baseTotal = area * costPerSqm;
    if (dismantle) baseTotal += (area * 150); // Фиксированная надбавка за демонтаж или за м2

    setTotal(baseTotal);
  }, [area, primer, dismantle, complexPattern]);

  return (
    <section id="calculator" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-accent-blue rounded-full flex items-center justify-center">
              <CalcIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-brand-accent-graphite">Калькулятор проекта</h2>
              <p className="text-gray-500 text-sm mt-1">Примерный расчет стоимости работ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Inputs */}
            <div className="space-y-8">
              {/* Area Slider */}
              <div>
                <label className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Площадь стен, м²</span>
                  <span className="text-2xl font-bold text-brand-accent-blue">{area}</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent-blue"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <span className="block font-medium text-gray-900">Нужна грунтовка</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Обязательно для надежного сцепления</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={primer}
                    onChange={(e) => setPrimer(e.target.checked)}
                    className="w-5 h-5 text-brand-accent-blue border-gray-300 rounded focus:ring-brand-accent-blue"
                  />
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <span className="block font-medium text-gray-900">Демонтаж старых обоев</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Снятие старого покрытия и подготовка</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={dismantle}
                    onChange={(e) => setDismantle(e.target.checked)}
                    className="w-5 h-5 text-brand-accent-blue border-gray-300 rounded focus:ring-brand-accent-blue"
                  />
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <span className="block font-medium text-gray-900">Сложный подбор рисунка</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Обои с раппортом и смещением</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={complexPattern}
                    onChange={(e) => setComplexPattern(e.target.checked)}
                    className="w-5 h-5 text-brand-accent-blue border-gray-300 rounded focus:ring-brand-accent-blue"
                  />
                </label>
              </div>
            </div>

            {/* Total Display */}
            <div className="bg-brand-gray p-8 rounded-2xl flex flex-col justify-center h-full">
              <div className="text-gray-500 text-sm mb-2 uppercase tracking-wide font-semibold">Итоговая оценка</div>
              <div className="text-5xl font-extrabold text-brand-accent-graphite mb-2">
                {total.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-gray-500 mb-8 flex items-start gap-2">
                 <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                 <span>Итоговая цена может измениться после осмотра стен и точного замера помещения.</span>
              </p>
              
              <a href="#contact" className="w-full text-center py-4 px-6 bg-brand-accent-blue text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-lg">
                Получить точную смету
              </a>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}

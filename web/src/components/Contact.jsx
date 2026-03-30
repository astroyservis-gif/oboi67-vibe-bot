import React, { useState } from 'react';
import { Send, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="pt-24 pb-[80px] md:pb-24 bg-brand-gray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="bg-brand-accent-blue rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">

          {/* Info Side */}
          <div className="lg:w-5/12 p-10 lg:p-16 text-white flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay object-cover"></div>

            <div className="relative z-10 mb-12 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Обсудим ваш проект?</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Оставьте заявку на бесплатную консультацию и точный замер. Я свяжусь с вами в течение 30 минут.
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Телефон для связи</p>
                  <a href="tel:+7517137766" className="text-xl font-bold hover:text-blue-100 transition-colors">
                    +7 (951) 713-77-66
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-7/12 bg-white p-10 lg:p-16">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue transition-all outline-none bg-brand-gray"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue transition-all outline-none bg-brand-gray"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Детали проекта (опционально)</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue transition-all outline-none bg-brand-gray resize-none"
                  placeholder="Где находится объект? Сколько комнат?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-4 px-6 rounded-xl bg-brand-accent-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span>Отправка...</span>
                ) : status === 'success' ? (
                  <span>Успешно отправлено!</span>
                ) : (
                  <>
                    <span>Получить консультацию</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Нажимая на кнопку, вы даете согласие на обработку персональных данных.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

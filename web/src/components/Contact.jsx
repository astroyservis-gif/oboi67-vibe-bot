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
  
    // 1. Формируем текст сообщения для Юрия
    const messageText = `Привет, Юрий! 👋\n\nМеня зовут ${formData.name}.\nМой номер: ${formData.phone}\n\nДетали проекта: ${formData.message || 'Хочу обсудить замер'}`;
    
    // 2. Кодируем текст для ссылки
    const telegramUrl = `https://t.me/Yura_Oboi67?text=${encodeURIComponent(messageText)}`;
  
    try {
      // 3. Отправляем данные на твой бэкенд (чтобы сработал бот-оповещатель)
      const response = await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setStatus('success');
        // 4. Открываем Telegram в новой вкладке
        window.open(telegramUrl, '_blank');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus('error');
      // Даже если бэкенд упал, всё равно даем пользователю написать в ТГ
      window.open(telegramUrl, '_blank');
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
                Оставьте заявку на консультацию. Если я на объекте, то могу не услышать звонок, но я обязательно перезвоню вам в течение 30 минут. Ваше время и ваш ремонт для меня в приоритете.
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Телефон для связи</p>
                  <a href="tel:+7517137766" className="text-xl font-bold hover:text-blue-100 active:scale-95 inline-block transition-transform">
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
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
                      let formatted = '+7';
                      if (val.length > 0) formatted += ` (${val.substring(0, 3)}`;
                      if (val.length >= 4) formatted += `) ${val.substring(3, 6)}`;
                      if (val.length >= 7) formatted += `-${val.substring(6, 8)}`;
                      if (val.length >= 9) formatted += `-${val.substring(8, 10)}`;
                      if (e.target.value === '') formatted = '';
                      setFormData({ ...formData, phone: formatted });
                    }}
                    maxLength={18}
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
                className="w-full py-4 px-6 rounded-xl bg-brand-accent-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
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

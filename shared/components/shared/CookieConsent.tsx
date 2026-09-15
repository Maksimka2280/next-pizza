'use client'

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('cookiesAccepted') === 'true';
      if (!accepted) {
        setVisible(true);
        setTimeout(() => setEntered(true), 20);
      }
    } catch (e) {
    }
  }, []);

  function accept() {
    setEntered(false);
    setTimeout(() => {
      try {
        localStorage.setItem('cookiesAccepted', 'true');
      } catch (e) {
      }
      setVisible(false);
    }, 250);
  }

  if (!visible) return null;

  return (
    <>
      <div
        aria-hidden={!entered}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div
        role="dialog"
        aria-label="Cookie consent"
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-250 ease-out ${entered ? 'translate-y-0' : 'translate-y-8'
          } w-full bg-white border-t border-[#EDEDED] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 md:py-8">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">

            <div className="flex-1">
              <p className="text-[18px] md:text-[20px] leading-[1.5] text-[#333333] max-w-[1000px]">
                Этот сайт использует cookies для улучшения работы сайта,
                персонализации контента и анализа посещаемости. Файлы cookie
                помогают нам обеспечивать корректную работу всех функций сайта,
                запоминать ваши настройки и делать использование сайта более
                удобным.
              </p>

              <p className="mt-3 text-[16px] md:text-[18px] leading-[1.5] text-[#666666] max-w-[1000px]">
                Продолжая пользоваться сайтом, вы соглашаетесь на использование
                cookies. Вы можете ознакомиться с подробной информацией об их
                использовании и настройках конфиденциальности.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
              <Button
                onClick={accept}
                aria-label="Принять куки"
                className="w-full sm:w-[160px] h-[50px] font-bold"
              >
                Принять
              </Button>

              <a
                href="/privacy"
                className="w-full sm:w-[160px] h-[50px] flex items-center justify-center text-[16px] rounded-lg border border-[#EDEDED] text-[#4B5563] hover:bg-[#F8F8F8] transition-colors"
              >
                Подробнее
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

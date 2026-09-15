'use client'

import Link from 'next/link'


export default function PrivacyPage() {
  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-[900px] py-[40px] px-4">
        <h1 className="text-[36px] font-black pb-[20px]">Политика конфиденциальности и использование куки</h1>

        <section className="mb-6">
          <p className="text-sm text-[#333]">
            На этой странице объясняется, какие данные мы собираем, как мы используем куки и как вы
            можете управлять настройками конфиденциальности при использовании этого сайта.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Что такое куки?</h2>
          <p className="text-sm text-[#333]">Куки — это небольшие текстовые файлы, которые сохраняются в вашем браузере и помогают улучшать работу сайта.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Как мы используем куки</h2>
          <ul className="list-disc pl-5 text-sm text-[#333]">
            <li>Улучшение работы сайта (сохранение настроек).</li>
            <li>Аналитика и статистика использования для оптимизации сервиса.</li>
            <li>Функциональные куки, необходимые для работы корзины и авторизации.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Сторонние сервисы</h2>
          <p className="text-sm text-[#333]">Мы можем использовать сторонние сервисы (например, аналитику), которые также могут устанавливать куки. Пожалуйста, ознакомьтесь с политиками конфиденциальности этих сервисов для получения подробной информации.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Управление куки</h2>
          <p className="text-sm text-[#333]">Вы можете отключить или удалить куки в настройках вашего браузера. Обратите внимание, что отключение некоторых куки может повлиять на функциональность сайта.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Сбор и использование данных</h2>
          <p className="text-sm text-[#333]">Мы используем собранные данные исключительно для предоставления и улучшения сервисов, обработки заказов и аналитики. Мы не передаём ваши персональные данные третьим лицам без вашего согласия, если иное не предусмотрено законом.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Безопасность</h2>
          <p className="text-sm text-[#333]">Мы принимаем разумные технические и организационные меры для защиты данных. Однако полная безопасность в интернете не может быть гарантирована.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Изменения в политике</h2>
          <p className="text-sm text-[#333]">Мы можем периодически обновлять эту страницу. Рекомендуем периодически проверять актуальные условия.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Контакты</h2>
          <p className="text-sm text-[#333]">Если у вас есть вопросы по политике конфиденциальности, свяжитесь с нами через контактную форму на сайте или отправьте письмо на support@yourdomain.com.</p>
        </section>

        <div className="mt-6">
          <Link href="/" className="text-sm text-[#FE5F00] font-medium">Вернуться на главную</Link>
        </div>
      </div>
    </main>
  )
}

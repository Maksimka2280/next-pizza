'use client'

import Link from 'next/link'


export default function PrivacyPage() {
  return (
    <main className="flex w-full justify-center px-3 sm:px-5">
      <div className="w-full min-w-0 max-w-[900px] py-6 sm:py-10">
        <h1 className="break-words pb-5 text-3xl font-black sm:text-[36px]">Политика конфиденциальности и использование cookie</h1>

        <section className="mb-6">
          <p className="text-sm text-[#333]">
            На этой странице объясняется, какие данные мы собираем, как мы используем cookie и как вы
            можете управлять настройками конфиденциальности при использовании этого сайта.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Что такое cookie?</h2>
          <p className="text-sm text-[#333]">Cookie — это небольшие текстовые файлы, которые сохраняются в вашем браузере и помогают улучшать работу сайта.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Как мы используем cookie</h2>
          <ul className="list-disc pl-5 text-sm text-[#333]">
            <li>Улучшение работы сайта (сохранение настроек).</li>
            <li>Аналитика и статистика использования для оптимизации сервиса.</li>
            <li>Функциональные cookie, необходимые для работы корзины и авторизации.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Сторонние сервисы</h2>
          <p className="text-sm text-[#333]">Мы можем использовать сторонние сервисы (например, аналитику), которые также могут устанавливать cookie. Пожалуйста, ознакомьтесь с политиками конфиденциальности этих сервисов для получения подробной информации.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Управление cookie</h2>
          <p className="text-sm text-[#333]">Вы можете отключить или удалить cookie в настройках вашего браузера. Обратите внимание, что отключение некоторых cookie может повлиять на функциональность сайта.</p>
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

# Моё резюме

Сайт-резюме Ильи Терновского — повар и frontend-разработчик.

🔗 [Открыть резюме](https://ilyaternovsky.github.io/resume-result.school/)

## Стек
- HTML5 + CSS3 (тёмная тема, glassmorphism, анимации)
- Vanilla JS (canvas-сетка, custom cursor, magnetic buttons, scroll-reveal, typed-эффект, 3D-tilt)
- [Formspree](https://formspree.io/) — отправка сообщений из формы на email

## Подключение формы (Formspree)

Форма уже подключена в `index.html` через `action="https://formspree.io/f/FORMSPREE_ENDPOINT"`.
Нужно только заменить `FORMSPREE_ENDPOINT` на свой form ID.

### Шаги

1. **Регистрация**
   Перейди на https://formspree.io/ и зарегистрируйся
   (бесплатный план — 50 писем/мес, больше не нужно).

2. **Подтверди email получателя**
   В личном кабинете добавь и подтверди `ilya.ter1@yandex.ru`
   (или другой ящик, на который хочешь получать сообщения).

3. **Создай форму**
   - New Form → назови "Resume Contact"
   - Email получателя: `ilya.ter1@yandex.ru`
   - Formspree даст endpoint вида `xyzabcde` и URL:
     `https://formspree.io/f/xyzabcde`

4. **Вставь endpoint в код**
   Открой `index.html`, найди строку:
   ```html
   <form action="https://formspree.io/f/FORMSPREE_ENDPOINT" ...>
   ```
   Замени `FORMSPREE_ENDPOINT` на свой ID:
   ```html
   <form action="https://formspree.io/f/xyzabcde" ...>
   ```

5. **Проверь**
   Открой `index.html` в браузере, заполни форму, отправь.
   Письмо должно прийти на `ilya.ter1@yandex.ru`.
   Если не пришло — проверь папку "Спам".

6. **Деплой**
   Закоммить и запушь изменения на GitHub Pages.

## Локальный запуск

Просто открой `index.html` в браузере. Никаких сборок и зависимостей.

## Структура

```
resume-result.school/
├── index.html      # разметка
├── style.css       # стили + анимации
├── script.js       # эффекты + обработка формы
├── imgs/
│   └── avatar.jpg
└── README.md
```

# Руководство по деплою ARG-HIVE

Это руководство описывает различные способы развертывания приложения ARG-HIVE.

## Содержание

- [Предварительные требования](#предварительные-требования)
- [Локальный запуск](#локальный-запуск)
- [Деплой на Vercel](#деплой-на-vercel)
- [Деплой на Netlify](#деплой-на-netlify)
- [Деплой через Docker](#деплой-через-docker)
- [Деплой через Docker Compose](#деплой-через-docker-compose)
- [GitHub Actions CI/CD](#github-actions-cicd)

---

## Предварительные требования

### Для всех методов деплоя:
- Gemini API Key (получить можно здесь: https://aistudio.google.com/app/apikey)

### Для локального запуска и CI/CD:
- Node.js 20 или выше
- npm или yarn

### Для Docker деплоя:
- Docker
- Docker Compose (опционально)

---

## Локальный запуск

### 1. Установите зависимости:
```bash
npm install
```

### 2. Настройте переменные окружения:
Создайте файл `.env.local` и добавьте ваш Gemini API ключ:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Запустите приложение в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 4. Сборка для продакшена:
```bash
npm run build
npm run preview
```

---

## Деплой на Vercel

Vercel - это самый простой способ развертывания Vite/React приложений.

### Способ 1: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Войдите в аккаунт Vercel:
```bash
vercel login
```

3. Разверните проект:
```bash
vercel
```

4. Добавьте переменную окружения в Vercel Dashboard:
   - Перейдите в настройки проекта
   - Settings → Environment Variables
   - Добавьте: `GEMINI_API_KEY` = ваш ключ

### Способ 2: Через GitHub интеграцию

1. Зарегистрируйтесь на [Vercel](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий
4. Vercel автоматически определит настройки через `vercel.json`
5. Добавьте переменную окружения `GEMINI_API_KEY` в настройках проекта
6. Нажмите "Deploy"

**Автоматический деплой:** Каждый push в main ветку будет автоматически разворачивать новую версию!

---

## Деплой на Netlify

### Способ 1: Через Netlify CLI

1. Установите Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Войдите в аккаунт:
```bash
netlify login
```

3. Инициализируйте проект:
```bash
netlify init
```

4. Разверните:
```bash
netlify deploy --prod
```

5. Добавьте переменную окружения:
```bash
netlify env:set GEMINI_API_KEY your_gemini_api_key_here
```

### Способ 2: Через Netlify Dashboard

1. Зарегистрируйтесь на [Netlify](https://netlify.com)
2. Нажмите "Add new site" → "Import an existing project"
3. Подключите GitHub репозиторий
4. Настройки будут автоматически загружены из `netlify.toml`
5. Добавьте переменную окружения:
   - Site settings → Environment variables
   - Добавьте: `GEMINI_API_KEY`
6. Нажмите "Deploy site"

---

## Деплой через Docker

### Сборка образа:
```bash
docker build -t arg-hive:latest .
```

### Запуск контейнера:
```bash
docker run -d \
  -p 80:80 \
  --name arg-hive-app \
  arg-hive:latest
```

Приложение будет доступно по адресу: http://localhost

### Остановка контейнера:
```bash
docker stop arg-hive-app
docker rm arg-hive-app
```

### Публикация в Docker Hub:

1. Войдите в Docker Hub:
```bash
docker login
```

2. Пометьте образ:
```bash
docker tag arg-hive:latest your-username/arg-hive:latest
```

3. Отправьте в Docker Hub:
```bash
docker push your-username/arg-hive:latest
```

---

## Деплой через Docker Compose

Docker Compose упрощает управление контейнерами.

### Запуск:
```bash
docker-compose up -d
```

### Остановка:
```bash
docker-compose down
```

### Просмотр логов:
```bash
docker-compose logs -f
```

### Перезапуск после изменений:
```bash
docker-compose up -d --build
```

---

## GitHub Actions CI/CD

Проект настроен с автоматическим CI/CD через GitHub Actions.

### Настройка секретов GitHub:

1. Перейдите в настройки репозитория: Settings → Secrets and variables → Actions
2. Добавьте следующие секреты:
   - `GEMINI_API_KEY` - ваш Gemini API ключ
   - `DOCKER_USERNAME` - имя пользователя Docker Hub (опционально)
   - `DOCKER_PASSWORD` - пароль или токен Docker Hub (опционально)

### Workflows:

#### CI Workflow (`.github/workflows/ci.yml`)
Запускается при каждом push и pull request:
- Проверка типов TypeScript
- Сборка приложения

#### Deploy Workflow (`.github/workflows/deploy.yml`)
Запускается при push в main/master ветку:
- Сборка и тестирование
- Создание артефактов
- Сборка и публикация Docker образа в Docker Hub

### Ручной запуск:
Вы можете запустить workflow вручную через GitHub Actions → Deploy Application → Run workflow

---

## Переменные окружения

### Обязательные:
- `GEMINI_API_KEY` - API ключ для Google Gemini

### Получение Gemini API ключа:
1. Перейдите на https://aistudio.google.com/app/apikey
2. Создайте новый API ключ
3. Скопируйте ключ и используйте в настройках

---

## Рекомендации по безопасности

1. **Никогда не коммитьте** `.env.local` файл в Git
2. **Используйте переменные окружения** для чувствительных данных
3. **Ротируйте API ключи** регулярно
4. **Ограничьте доступ** к API ключам по IP или домену в Google Cloud Console
5. **Используйте HTTPS** для продакшен развертываний

---

## Мониторинг и логи

### Vercel:
- Логи доступны в Vercel Dashboard → вашприложение → Deployments → Logs

### Netlify:
- Логи доступны в Netlify Dashboard → Site → Deploys → Deploy log

### Docker:
```bash
# Просмотр логов контейнера
docker logs arg-hive-app

# Следить за логами в реальном времени
docker logs -f arg-hive-app
```

### Docker Compose:
```bash
# Просмотр логов всех сервисов
docker-compose logs

# Следить за логами в реальном времени
docker-compose logs -f
```

---

## Решение проблем

### Проблема: Приложение не запускается локально
**Решение:**
- Проверьте, что установлены все зависимости: `npm install`
- Убедитесь, что `.env.local` содержит корректный `GEMINI_API_KEY`
- Проверьте, что используется Node.js 20+: `node --version`

### Проблема: Ошибка сборки в Docker
**Решение:**
- Очистите Docker кеш: `docker system prune -a`
- Пересоберите образ: `docker build --no-cache -t arg-hive:latest .`

### Проблема: API ключ не работает
**Решение:**
- Проверьте правильность ключа в Google AI Studio
- Убедитесь, что API включен в вашем Google Cloud проекте
- Проверьте лимиты использования API

---

## Дополнительные ресурсы

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)
- [Vite Documentation](https://vitejs.dev)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

---

## Поддержка

Если у вас возникли вопросы или проблемы с деплоем:
1. Проверьте раздел "Решение проблем" выше
2. Создайте issue в GitHub репозитории
3. Обратитесь к документации соответствующей платформы деплоя

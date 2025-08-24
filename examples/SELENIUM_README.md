# Selenium WebDriver в FingerprintJS

Этот проект включает примеры использования Selenium WebDriver для автоматизации веб-браузера и тестирования FingerprintJS.

## 📋 Содержание

- [Установка зависимостей](#установка-зависимостей)
- [Примеры](#примеры)
- [Запуск примеров](#запуск-примеров)
- [Настройка окружения](#настройка-окружения)
- [Возможные проблемы](#возможные-проблемы)

## 🚀 Установка зависимостей

### 1. Установка npm пакетов

```bash
yarn install
```

### 2. Установка драйверов браузеров

#### Chrome WebDriver
```bash
# Автоматически устанавливается через chromedriver пакет
# Или вручную:
wget https://chromedriver.storage.googleapis.com/LATEST_RELEASE
wget https://chromedriver.storage.googleapis.com/$(cat LATEST_RELEASE)/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver
```

#### Firefox WebDriver (GeckoDriver)
```bash
# Автоматически устанавливается через geckodriver пакет
# Или вручную:
wget https://github.com/mozilla/geckodriver/releases/latest/download/geckodriver-v0.33.0-linux64.tar.gz
tar -xzf geckodriver-v0.33.0-linux64.tar.gz
sudo mv geckodriver /usr/local/bin/
sudo chmod +x /usr/local/bin/geckodriver
```

## 📚 Примеры

### 1. Базовый пример (`selenium-basic.ts`)

Демонстрирует основные возможности Selenium WebDriver:
- Инициализация драйвера Chrome
- Открытие веб-страниц
- Поиск элементов
- Клики и ввод текста
- Создание скриншотов
- Обработка ошибок

**Запуск:**
```bash
yarn selenium:basic
```

### 2. Пример с FingerprintJS (`selenium-fingerprint.ts`)

Специализированный пример для тестирования FingerprintJS:
- Создание тестовой HTML страницы
- Генерация отпечатков браузера
- Тестирование стабильности отпечатков
- Сбор информации о браузере
- Анализ компонентов отпечатка

**Запуск:**
```bash
yarn selenium:fingerprint
```

### 3. Безголовый режим (`selenium-headless.ts`)

Пример для автоматизации без графического интерфейса:
- Запуск браузера в фоновом режиме
- Тестирование производительности
- Выполнение JavaScript
- Тестирование сетевых запросов
- Идеально для CI/CD и серверов

**Запуск:**
```bash
yarn selenium:headless
```

### 4. Упрощенный пример (`selenium-simple.ts`)

Простой и надежный пример для начала работы:
- Создание локальной HTML страницы
- Работа с формами
- Автоматическое заполнение полей
- Создание скриншотов
- Идеально для обучения и тестирования

**Запуск:**
```bash
yarn selenium:simple
```

## 🎯 Запуск примеров

### Все примеры сразу
```bash
yarn selenium:basic
yarn selenium:fingerprint
yarn selenium:headless
yarn selenium:simple
```

### Отдельные примеры
```bash
# Базовый функционал
yarn selenium:basic

# Тестирование FingerprintJS
yarn selenium:fingerprint

# Безголовый режим
yarn selenium:headless

# Упрощенный пример (рекомендуется для начала)
yarn selenium:simple
```

## ⚙️ Настройка окружения

### Переменные окружения

```bash
# Путь к Chrome WebDriver (если не установлен глобально)
export CHROME_DRIVER_PATH=/path/to/chromedriver

# Путь к Firefox WebDriver (если не установлен глобально)
export GECKO_DRIVER_PATH=/path/to/geckodriver

# Настройки Chrome
export CHROME_HEADLESS=true  # Запуск в безголовом режиме
export CHROME_NO_SANDBOX=true  # Отключение sandbox
export CHROME_DISABLE_GPU=true  # Отключение GPU
```

### Конфигурация TypeScript

Убедитесь, что в `tsconfig.json` включены следующие настройки:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 🔧 Кастомизация

### Настройка Chrome опций

```typescript
import { Options } from 'selenium-webdriver/chrome';

const chromeOptions = new Options();

// Производительность
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--disable-dev-shm-usage');
chromeOptions.addArguments('--disable-gpu');

// Безголовый режим
chromeOptions.addArguments('--headless');

// Размер окна
chromeOptions.addArguments('--window-size=1920,1080');

// Дополнительные настройки
chromeOptions.addArguments('--disable-extensions');
chromeOptions.addArguments('--disable-plugins');
```

### Настройка Firefox опций

```typescript
import { Options } from 'selenium-webdriver/firefox';

const firefoxOptions = new Options();

// Безголовый режим
firefoxOptions.headless();

// Настройки профиля
firefoxOptions.setPreference('dom.webdriver.enabled', false);
firefoxOptions.setPreference('useAutomationExtension', false);
```

## 🐛 Возможные проблемы

### 1. Ошибка "ChromeDriver executable needs to be in PATH"

**Решение:**
```bash
# Установить ChromeDriver глобально
sudo apt-get install chromium-chromedriver

# Или добавить в PATH
export PATH=$PATH:/path/to/chromedriver
```

### 2. Ошибка "session not created: This version of ChromeDriver only supports Chrome version X"

**Решение:**
```bash
# Обновить Chrome до последней версии
sudo apt-get update
sudo apt-get install google-chrome-stable

# Или использовать совместимую версию ChromeDriver
```

### 3. Ошибка "DevToolsActivePort file doesn't exist"

**Решение:**
```typescript
chromeOptions.addArguments('--remote-debugging-port=9222');
chromeOptions.addArguments('--disable-dev-shm-usage');
```

### 4. Проблемы с правами доступа

**Решение:**
```bash
# Дать права на выполнение
sudo chmod +x /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/geckodriver

# Проверить владельца
sudo chown $USER:$USER /usr/local/bin/chromedriver
```

## 📊 Мониторинг и логирование

### Включение подробного логирования

```typescript
import { logging } from 'selenium-webdriver';

// Настройка логирования
logging.installConsoleHandler();
logging.getLogger('webdriver.http').setLevel(logging.Level.ALL);
```

### Создание отчетов

```typescript
// Сохранение логов в файл
const fs = require('fs');
const logs = await this.driver.manage().logs().get('browser');
fs.writeFileSync('browser-logs.json', JSON.stringify(logs, null, 2));
```

## 🚀 Интеграция с CI/CD

### GitHub Actions

```yaml
name: Selenium Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Install Chrome
        run: |
          sudo apt-get update
          sudo apt-get install -y google-chrome-stable
      - name: Run Selenium tests
        run: yarn selenium:headless
```

### Docker

```dockerfile
FROM node:18

# Установка Chrome
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "selenium:headless"]
```

## 📚 Дополнительные ресурсы

- [Selenium WebDriver Documentation](https://selenium.dev/documentation/webdriver/)
- [ChromeDriver Documentation](https://chromedriver.chromium.org/)
- [GeckoDriver Documentation](https://firefox-source-docs.mozilla.org/testing/geckodriver/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Поддержка

Если у вас возникли проблемы или вопросы:

1. Проверьте [Issues](https://github.com/fingerprintjs/fingerprintjs/issues)
2. Создайте новый Issue с подробным описанием проблемы
3. Укажите версии браузеров и драйверов
4. Приложите логи ошибок

---

**Примечание:** Убедитесь, что у вас установлены совместимые версии Chrome/ChromeDriver или Firefox/GeckoDriver перед запуском примеров.
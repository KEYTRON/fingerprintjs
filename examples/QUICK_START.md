# 🚀 Быстрый старт с Selenium WebDriver

## ⚡ За 5 минут

### 1. Установка зависимостей

```bash
yarn install
```

### 2. Запуск рабочего примера

```bash
yarn selenium:simple
```

**Готово!** 🎉

---

## 📚 Что происходит

1. **Создается** локальная HTML страница с формой
2. **Открывается** браузер Chrome автоматически
3. **Заполняется** форма данными
4. **Отправляется** форма
5. **Создается** скриншот результата
6. **Браузер** закрывается автоматически

## 🔍 Результат

-   ✅ HTML файл: `examples/selenium-test.html`
-   ✅ Скриншот: `selenium-test-results.png`
-   ✅ Логи в консоли с подробной информацией

## 🛠️ Настройка

### Chrome/Chromium

```bash
# Установка браузера
sudo apt-get install chromium-browser

# Проверка версии
chromium-browser --version
```

### ChromeDriver

Автоматически устанавливается через npm пакет `chromedriver`

## 🚨 Возможные проблемы

### "ChromeDriver executable needs to be in PATH"

```bash
# Решение: переустановить зависимости
yarn install
```

### "session not created: This version of ChromeDriver only supports Chrome version X"

```bash
# Решение: обновить ChromeDriver в package.json
# Текущая версия: 139.0.0
```

### "Chrome не найден"

```bash
# Решение: установить Chromium
sudo apt-get install chromium-browser
```

## 📖 Следующие шаги

1. **Изучите код** `examples/selenium-simple.ts`
2. **Попробуйте** другие примеры
3. **Адаптируйте** под ваши задачи
4. **Используйте** в автоматизации

---

**Вопросы?** Смотрите `SELENIUM_README.md` для подробной документации.

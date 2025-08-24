import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

/**
 * Упрощенный пример использования Selenium WebDriver
 * Работает с локальными HTML файлами для демонстрации
 */
class SeleniumSimpleExample {
  private driver: WebDriver | null;

  constructor() {
    this.driver = null;
  }

  /**
   * Инициализация драйвера Chrome
   */
  async initializeDriver(): Promise<void> {
    try {
      const chromeOptions = new Options();
      
      // Настройки для лучшей производительности
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-gpu');
      chromeOptions.addArguments('--disable-extensions');
      chromeOptions.addArguments('--disable-plugins');
      
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();

      console.log('✅ Драйвер Chrome успешно инициализирован');
    } catch (error) {
      console.error('❌ Ошибка инициализации драйвера:', error);
      throw error;
    }
  }

  /**
   * Создание простой HTML страницы для тестирования
   */
  async createTestPage(): Promise<string> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Selenium Test Page</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  margin: 40px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  min-height: 100vh;
              }
              .container { 
                  max-width: 800px; 
                  margin: 0 auto; 
                  background: rgba(255, 255, 255, 0.1);
                  padding: 30px;
                  border-radius: 15px;
                  backdrop-filter: blur(10px);
              }
              .form-group { 
                  margin: 20px 0; 
              }
              label { 
                  display: block; 
                  margin-bottom: 5px; 
                  font-weight: bold;
              }
              input, textarea, select { 
                  width: 100%; 
                  padding: 10px; 
                  border: none; 
                  border-radius: 5px; 
                  font-size: 16px;
                  background: rgba(255, 255, 255, 0.9);
                  color: #333;
              }
              button { 
                  background: #4CAF50; 
                  color: white; 
                  padding: 12px 24px; 
                  border: none; 
                  border-radius: 5px; 
                  cursor: pointer; 
                  font-size: 16px;
                  margin: 10px 5px;
                  transition: background 0.3s;
              }
              button:hover { 
                  background: #45a049; 
              }
              .result { 
                  background: rgba(255, 255, 255, 0.2); 
                  padding: 20px; 
                  margin: 20px 0; 
                  border-radius: 10px; 
                  border-left: 4px solid #4CAF50;
              }
              .hidden { 
                  display: none; 
              }
              .success { 
                  color: #4CAF50; 
                  font-weight: bold; 
              }
              .error { 
                  color: #f44336; 
                  font-weight: bold; 
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🧪 Selenium Test Page</h1>
              <p>Эта страница создана для демонстрации возможностей Selenium WebDriver.</p>
              
              <div class="form-group">
                  <label for="name">Имя:</label>
                  <input type="text" id="name" name="name" placeholder="Введите ваше имя">
              </div>
              
              <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" placeholder="Введите ваш email">
              </div>
              
              <div class="form-group">
                  <label for="message">Сообщение:</label>
                  <textarea id="message" name="message" rows="4" placeholder="Введите ваше сообщение"></textarea>
              </div>
              
              <div class="form-group">
                  <label for="country">Страна:</label>
                  <select id="country" name="country">
                      <option value="">Выберите страну</option>
                      <option value="russia">Россия</option>
                      <option value="usa">США</option>
                      <option value="germany">Германия</option>
                      <option value="france">Франция</option>
                      <option value="japan">Япония</option>
                  </select>
              </div>
              
              <div class="form-group">
                  <button id="submitBtn" onclick="submitForm()">Отправить</button>
                  <button id="clearBtn" onclick="clearForm()">Очистить</button>
                  <button id="showInfoBtn" onclick="showBrowserInfo()">Информация о браузере</button>
              </div>
              
              <div id="result" class="result hidden"></div>
              
              <div id="browserInfo" class="result hidden"></div>
          </div>
          
          <script>
              function submitForm() {
                  const name = document.getElementById('name').value;
                  const email = document.getElementById('email').value;
                  const message = document.getElementById('message').value;
                  const country = document.getElementById('country').value;
                  
                  if (!name || !email || !message || !country) {
                      showResult('Пожалуйста, заполните все поля!', 'error');
                      return;
                  }
                  
                  const result = \`Форма успешно отправлена!\\n\\nИмя: \${name}\\nEmail: \${email}\\nСтрана: \${country}\\nСообщение: \${message}\`;
                  showResult(result, 'success');
              }
              
              function clearForm() {
                  document.getElementById('name').value = '';
                  document.getElementById('email').value = '';
                  document.getElementById('message').value = '';
                  document.getElementById('country').value = '';
                  document.getElementById('result').classList.add('hidden');
                  document.getElementById('browserInfo').classList.add('hidden');
              }
              
              function showBrowserInfo() {
                  const info = {
                      userAgent: navigator.userAgent,
                      language: navigator.language,
                      platform: navigator.platform,
                      cookieEnabled: navigator.cookieEnabled,
                      onLine: navigator.onLine,
                      screen: {
                          width: screen.width,
                          height: screen.height,
                          availWidth: screen.availWidth,
                          availHeight: screen.availHeight
                      },
                      window: {
                          innerWidth: window.innerWidth,
                          innerHeight: window.innerHeight,
                          outerWidth: window.outerWidth,
                          outerHeight: window.outerHeight
                      },
                      timestamp: new Date().toISOString()
                  };
                  
                  const infoDiv = document.getElementById('browserInfo');
                  infoDiv.innerHTML = \`
                      <h3>🌐 Информация о браузере:</h3>
                      <pre>\${JSON.stringify(info, null, 2)}</pre>
                  \`;
                  infoDiv.classList.remove('hidden');
              }
              
              function showResult(message, type) {
                  const resultDiv = document.getElementById('result');
                  resultDiv.innerHTML = \`<span class="\${type}">\${message}</span>\`;
                  resultDiv.classList.remove('hidden');
              }
              
              // Автоматическое заполнение формы для демонстрации
              window.addEventListener('load', function() {
                  setTimeout(() => {
                      document.getElementById('name').value = 'Иван Иванов';
                      document.getElementById('email').value = 'ivan@example.com';
                      document.getElementById('message').value = 'Это тестовое сообщение для демонстрации Selenium!';
                      document.getElementById('country').value = 'russia';
                  }, 1000);
              });
          </script>
      </body>
      </html>
    `;

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'selenium-test.html');
    fs.writeFileSync(filePath, html);
    
    console.log('✅ Тестовая страница создана:', filePath);
    return filePath;
  }

  /**
   * Открытие тестовой страницы
   */
  async openTestPage(filePath: string): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      const fileUrl = `file://${filePath}`;
      await this.driver.get(fileUrl);
      console.log('✅ Тестовая страница открыта');
      
      // Ждем загрузки страницы
      await this.driver.wait(until.titleContains('Selenium Test Page'), 10000);
    } catch (error) {
      console.error('❌ Ошибка открытия тестовой страницы:', error);
      throw error;
    }
  }

  /**
   * Заполнение формы
   */
  async fillForm(): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      console.log('📝 Заполнение формы...');
      
      // Очистка и заполнение полей
      await this.driver.findElement(By.id('name')).clear();
      await this.driver.findElement(By.id('name')).sendKeys('Тестовый Пользователь');
      
      await this.driver.findElement(By.id('email')).clear();
      await this.driver.findElement(By.id('email')).sendKeys('test@example.com');
      
      await this.driver.findElement(By.id('message')).clear();
      await this.driver.findElement(By.id('message')).sendKeys('Это автоматически заполненное сообщение от Selenium!');
      
      // Выбор страны
      const countrySelect = await this.driver.findElement(By.id('country'));
      await countrySelect.click();
      await this.driver.findElement(By.css('option[value="germany"]')).click();
      
      console.log('✅ Форма заполнена');
    } catch (error) {
      console.error('❌ Ошибка заполнения формы:', error);
      throw error;
    }
  }

  /**
   * Отправка формы
   */
  async submitForm(): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      console.log('📤 Отправка формы...');
      
      // Клик по кнопке отправки
      await this.driver.findElement(By.id('submitBtn')).click();
      
      // Ожидание результата
      await this.driver.wait(until.elementLocated(By.id('result')), 5000);
      
      // Получение результата
      const resultElement = await this.driver.findElement(By.id('result'));
      const resultText = await resultElement.getText();
      
      console.log('✅ Форма отправлена. Результат:', resultText);
    } catch (error) {
      console.error('❌ Ошибка отправки формы:', error);
      throw error;
    }
  }

  /**
   * Получение информации о браузере
   */
  async getBrowserInfo(): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      console.log('🌐 Получение информации о браузере...');
      
      // Клик по кнопке информации
      await this.driver.findElement(By.id('showInfoBtn')).click();
      
      // Ожидание загрузки информации
      await this.driver.wait(until.elementLocated(By.id('browserInfo')), 5000);
      
      // Получение информации
      const infoElement = await this.driver.findElement(By.id('browserInfo'));
      const infoText = await infoElement.getText();
      
      console.log('✅ Информация о браузере получена');
      console.log(infoText);
    } catch (error) {
      console.error('❌ Ошибка получения информации о браузере:', error);
      throw error;
    }
  }

  /**
   * Создание скриншота
   */
  async takeScreenshot(filename: string): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      const screenshot = await this.driver.takeScreenshot();
      const fs = require('fs');
      fs.writeFileSync(filename, screenshot, 'base64');
      console.log(`✅ Скриншот сохранен в файл ${filename}`);
    } catch (error) {
      console.error('❌ Ошибка создания скриншота:', error);
      throw error;
    }
  }

  /**
   * Закрытие браузера
   */
  async closeBrowser(): Promise<void> {
    try {
      if (this.driver) {
        await this.driver.quit();
        console.log('✅ Браузер закрыт');
      }
    } catch (error) {
      console.error('❌ Ошибка закрытия браузера:', error);
      throw error;
    }
  }

  /**
   * Основной метод демонстрации
   */
  async run(): Promise<void> {
    try {
      console.log('🚀 Запуск упрощенного примера Selenium...');
      
      // Инициализация драйвера
      await this.initializeDriver();
      
      // Создание тестовой страницы
      const testPagePath = await this.createTestPage();
      
      // Открытие тестовой страницы
      await this.openTestPage(testPagePath);
      
      // Пауза для загрузки автоматического заполнения
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Заполнение формы
      await this.fillForm();
      
      // Отправка формы
      await this.submitForm();
      
      // Получение информации о браузере
      await this.getBrowserInfo();
      
      // Создание скриншота
      await this.takeScreenshot('selenium-test-results.png');
      
      console.log('✅ Упрощенный пример Selenium успешно выполнен!');
      
    } catch (error) {
      console.error('❌ Ошибка выполнения примера:', error);
    } finally {
      // Закрытие браузера
      await this.closeBrowser();
    }
  }
}

// Запуск примера
if (require.main === module) {
  const example = new SeleniumSimpleExample();
  example.run().catch(console.error);
}

export default SeleniumSimpleExample;
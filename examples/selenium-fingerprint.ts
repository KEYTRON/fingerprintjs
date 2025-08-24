import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

/**
 * Пример использования Selenium для тестирования FingerprintJS
 * Демонстрирует автоматизацию браузера для сбора отпечатков
 */
class SeleniumFingerprintExample {
  private driver: WebDriver;

  constructor() {
    this.driver = null;
  }

  /**
   * Инициализация драйвера Chrome с настройками для FingerprintJS
   */
  async initializeDriver(): Promise<void> {
    try {
      const chromeOptions = new Options();
      
      // Настройки для лучшей производительности
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-gpu');
      
      // Настройки для более стабильного отпечатка
      chromeOptions.addArguments('--disable-extensions');
      chromeOptions.addArguments('--disable-plugins');
      chromeOptions.addArguments('--disable-images');
      chromeOptions.addArguments('--disable-javascript-harmony-shipping');
      
      // Установка фиксированного размера окна для консистентности
      chromeOptions.addArguments('--window-size=1920,1080');
      
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();

      console.log('✅ Драйвер Chrome для FingerprintJS успешно инициализирован');
    } catch (error) {
      console.error('❌ Ошибка инициализации драйвера:', error);
      throw error;
    }
  }

  /**
   * Создание HTML страницы с FingerprintJS для тестирования
   */
  async createTestPage(): Promise<string> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FingerprintJS Test Page</title>
          <script src="https://openfpcdn.io/fingerprintjs/v4"></script>
          <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .result { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .fingerprint { font-family: monospace; word-break: break-all; }
              button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
              .loading { color: #666; }
          </style>
      </head>
      <body>
          <h1>FingerprintJS Test Page</h1>
          <p>Эта страница демонстрирует работу FingerprintJS в автоматизированном браузере.</p>
          
          <button id="generateFingerprint">Сгенерировать отпечаток</button>
          <button id="getBrowserInfo">Информация о браузере</button>
          
          <div id="results"></div>
          
          <script>
              const resultsDiv = document.getElementById('results');
              
              // Генерация отпечатка
              document.getElementById('generateFingerprint').addEventListener('click', async () => {
                  resultsDiv.innerHTML = '<div class="loading">Генерация отпечатка...</div>';
                  
                  try {
                      const fp = await FingerprintJS.load();
                      const result = await fp.get();
                      
                      const html = \`
                          <div class="result">
                              <h3>Отпечаток браузера:</h3>
                              <div class="fingerprint">\${result.visitorId}</div>
                              <h4>Компоненты:</h4>
                              <ul>
                                  \${Object.entries(result.components).map(([key, value]) => 
                                      \`<li><strong>\${key}:</strong> \${JSON.stringify(value.value)}</li>\`
                                  ).join('')}
                              </ul>
                          </div>
                      \`;
                      
                      resultsDiv.innerHTML = html;
                  } catch (error) {
                      resultsDiv.innerHTML = \`<div class="result" style="color: red;">Ошибка: \${error.message}</div>\`;
                  }
              });
              
              // Информация о браузере
              document.getElementById('getBrowserInfo').addEventListener('click', () => {
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
                      }
                  };
                  
                  const html = \`
                      <div class="result">
                          <h3>Информация о браузере:</h3>
                          <pre>\${JSON.stringify(info, null, 2)}</pre>
                      </div>
                  \`;
                  
                  resultsDiv.innerHTML = html;
              });
          </script>
      </body>
      </html>
    `;

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'fingerprint-test.html');
    fs.writeFileSync(filePath, html);
    
    console.log('✅ Тестовая страница создана:', filePath);
    return filePath;
  }

  /**
   * Открытие тестовой страницы
   */
  async openTestPage(filePath: string): Promise<void> {
    try {
      const fileUrl = `file://${filePath}`;
      await this.driver.get(fileUrl);
      console.log('✅ Тестовая страница открыта');
      
      // Ждем загрузки страницы
      await this.driver.wait(until.titleContains('FingerprintJS Test Page'), 10000);
    } catch (error) {
      console.error('❌ Ошибка открытия тестовой страницы:', error);
      throw error;
    }
  }

  /**
   * Генерация отпечатка браузера
   */
  async generateFingerprint(): Promise<string> {
    try {
      // Клик по кнопке генерации отпечатка
      const button = await this.driver.findElement(By.id('generateFingerprint'));
      await button.click();
      
      // Ожидание результата
      await this.driver.wait(until.elementLocated(By.className('fingerprint')), 10000);
      
      // Получение отпечатка
      const fingerprintElement = await this.driver.findElement(By.className('fingerprint'));
      const fingerprint = await fingerprintElement.getText();
      
      console.log('✅ Отпечаток браузера получен:', fingerprint);
      return fingerprint;
    } catch (error) {
      console.error('❌ Ошибка генерации отпечатка:', error);
      throw error;
    }
  }

  /**
   * Получение информации о браузере
   */
  async getBrowserInfo(): Promise<void> {
    try {
      // Клик по кнопке получения информации
      const button = await this.driver.findElement(By.id('getBrowserInfo'));
      await button.click();
      
      // Ожидание результата
      await this.driver.wait(until.elementLocated(By.tagName('pre')), 5000);
      
      // Получение информации
      const infoElement = await this.driver.findElement(By.tagName('pre'));
      const info = await infoElement.getText();
      
      console.log('✅ Информация о браузере получена:');
      console.log(info);
    } catch (error) {
      console.error('❌ Ошибка получения информации о браузере:', error);
      throw error;
    }
  }

  /**
   * Создание скриншота с результатами
   */
  async takeFingerprintScreenshot(filename: string): Promise<void> {
    try {
      const screenshot = await this.driver.takeScreenshot();
      const fs = require('fs');
      fs.writeFileSync(filename, screenshot, 'base64');
      console.log(`✅ Скриншот результатов сохранен в файл ${filename}`);
    } catch (error) {
      console.error('❌ Ошибка создания скриншота:', error);
      throw error;
    }
  }

  /**
   * Тестирование стабильности отпечатка
   */
  async testFingerprintStability(iterations: number = 3): Promise<void> {
    try {
      console.log(`🔄 Тестирование стабильности отпечатка (${iterations} итераций)...`);
      
      const fingerprints: string[] = [];
      
      for (let i = 0; i < iterations; i++) {
        console.log(`\n--- Итерация ${i + 1}/${iterations} ---`);
        
        // Обновление страницы
        await this.driver.navigate().refresh();
        await this.driver.wait(until.titleContains('FingerprintJS Test Page'), 10000);
        
        // Генерация отпечатка
        const fingerprint = await this.generateFingerprint();
        fingerprints.push(fingerprint);
        
        // Пауза между итерациями
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Анализ результатов
      console.log('\n📊 Результаты тестирования стабильности:');
      fingerprints.forEach((fp, index) => {
        console.log(`   Итерация ${index + 1}: ${fp}`);
      });
      
      const uniqueFingerprints = new Set(fingerprints);
      const stability = uniqueFingerprints.size === 1 ? 'Стабилен' : 'Нестабилен';
      
      console.log(`\n🎯 Стабильность: ${stability}`);
      console.log(`   Уникальных отпечатков: ${uniqueFingerprints.size}`);
      console.log(`   Всего итераций: ${fingerprints.length}`);
      
    } catch (error) {
      console.error('❌ Ошибка тестирования стабильности:', error);
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
      console.log('🚀 Запуск примера Selenium с FingerprintJS...');
      
      // Инициализация драйвера
      await this.initializeDriver();
      
      // Создание тестовой страницы
      const testPagePath = await this.createTestPage();
      
      // Открытие тестовой страницы
      await this.openTestPage(testPagePath);
      
      // Получение информации о браузере
      await this.getBrowserInfo();
      
      // Генерация отпечатка
      const fingerprint = await this.generateFingerprint();
      
      // Тестирование стабильности
      await this.testFingerprintStability(3);
      
      // Создание скриншота
      await this.takeFingerprintScreenshot('fingerprint-results.png');
      
      console.log('✅ Пример Selenium с FingerprintJS успешно выполнен!');
      
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
  const example = new SeleniumFingerprintExample();
  example.run().catch(console.error);
}

export default SeleniumFingerprintExample;
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { ServiceBuilder } from 'selenium-webdriver/chrome';

/**
 * Пример использования Selenium в безголовом режиме
 * Демонстрирует автоматизацию браузера без графического интерфейса
 */
class SeleniumHeadlessExample {
  private driver: WebDriver;

  constructor() {
    this.driver = null;
  }

  /**
   * Инициализация драйвера Chrome в безголовом режиме
   */
  async initializeDriver(): Promise<void> {
    try {
      const chromeOptions = new Options();
      
      // Включение безголового режима
      chromeOptions.addArguments('--headless');
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-gpu');
      
      // Настройки для серверной среды
      chromeOptions.addArguments('--disable-extensions');
      chromeOptions.addArguments('--disable-plugins');
      chromeOptions.addArguments('--disable-images');
      chromeOptions.addArguments('--disable-javascript-harmony-shipping');
      
      // Установка размера окна (важно для безголового режима)
      chromeOptions.addArguments('--window-size=1920,1080');
      
      // Дополнительные настройки для стабильности
      chromeOptions.addArguments('--disable-web-security');
      chromeOptions.addArguments('--allow-running-insecure-content');
      chromeOptions.addArguments('--disable-features=VizDisplayCompositor');
      
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();

      console.log('✅ Драйвер Chrome в безголовом режиме успешно инициализирован');
    } catch (error) {
      console.error('❌ Ошибка инициализации драйвера:', error);
      throw error;
    }
  }

  /**
   * Тестирование различных веб-сайтов
   */
  async testWebsites(): Promise<void> {
    const websites = [
      { name: 'Google', url: 'https://www.google.com', selector: 'input[name="q"]' },
      { name: 'GitHub', url: 'https://github.com', selector: '.header-search-input' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', selector: '.s-input' }
    ];

    for (const site of websites) {
      try {
        console.log(`\n🌐 Тестирование сайта: ${site.name}`);
        
        // Открытие сайта
        await this.driver.get(site.url);
        await this.driver.wait(until.titleContains(''), 10000);
        
        // Получение информации о странице
        const title = await this.driver.getTitle();
        const url = await this.driver.getCurrentUrl();
        
        console.log(`   Заголовок: ${title}`);
        console.log(`   URL: ${url}`);
        
        // Поиск основного элемента
        try {
          const element = await this.driver.findElement(By.css(site.selector));
          const isDisplayed = await element.isDisplayed();
          console.log(`   Основной элемент найден: ${isDisplayed ? 'Да' : 'Нет'}`);
        } catch (error) {
          console.log(`   Основной элемент не найден: ${site.selector}`);
        }
        
        // Создание скриншота
        const screenshotName = `${site.name.toLowerCase()}-screenshot.png`;
        await this.takeScreenshot(screenshotName);
        
        // Пауза между сайтами
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`   ❌ Ошибка тестирования ${site.name}:`, error.message);
      }
    }
  }

  /**
   * Тестирование производительности
   */
  async testPerformance(): Promise<void> {
    try {
      console.log('\n⚡ Тестирование производительности...');
      
      const startTime = Date.now();
      
      // Открытие нескольких вкладок
      for (let i = 0; i < 3; i++) {
        await this.driver.executeScript(`window.open('https://www.google.com', '_blank');`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Переключение между вкладками
      const handles = await this.driver.getAllWindowHandles();
      for (const handle of handles) {
        await this.driver.switchTo().window(handle);
        const title = await this.driver.getTitle();
        console.log(`   Вкладка: ${title}`);
      }
      
      // Закрытие дополнительных вкладок
      for (let i = 1; i < handles.length; i++) {
        await this.driver.switchTo().window(handles[i]);
        await this.driver.close();
      }
      
      // Возврат к основной вкладке
      await this.driver.switchTo().window(handles[0]);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`   Время выполнения: ${duration}ms`);
      
    } catch (error) {
      console.error('❌ Ошибка тестирования производительности:', error);
    }
  }

  /**
   * Тестирование JavaScript выполнения
   */
  async testJavaScriptExecution(): Promise<void> {
    try {
      console.log('\n🔧 Тестирование выполнения JavaScript...');
      
      // Открытие простой страницы
      await this.driver.get('data:text/html,<html><body><div id="test">Hello World</div></body></html>');
      
      // Выполнение JavaScript
      const result = await this.driver.executeScript(`
        const element = document.getElementById('test');
        return {
          text: element.textContent,
          tagName: element.tagName,
          id: element.id,
          timestamp: Date.now()
        };
      `);
      
      console.log('   Результат выполнения JavaScript:');
      console.log(`     Текст: ${result.text}`);
      console.log(`     Тег: ${result.tagName}`);
      console.log(`     ID: ${result.id}`);
      console.log(`     Время: ${new Date(result.timestamp).toISOString()}`);
      
    } catch (error) {
      console.error('❌ Ошибка тестирования JavaScript:', error);
    }
  }

  /**
   * Тестирование сетевых запросов
   */
  async testNetworkRequests(): Promise<void> {
    try {
      console.log('\n🌐 Тестирование сетевых запросов...');
      
      // Открытие страницы с API
      await this.driver.get('https://httpbin.org/get');
      
      // Получение содержимого страницы
      const body = await this.driver.findElement(By.tagName('body'));
      const text = await body.getText();
      
      // Парсинг JSON ответа
      try {
        const jsonResponse = JSON.parse(text);
        console.log('   Ответ API получен:');
        console.log(`     URL: ${jsonResponse.url}`);
        console.log(`     User-Agent: ${jsonResponse.headers['User-Agent']}`);
        console.log(`     Accept: ${jsonResponse.headers['Accept']}`);
      } catch (parseError) {
        console.log('   Ответ не является валидным JSON');
      }
      
    } catch (error) {
      console.error('❌ Ошибка тестирования сетевых запросов:', error);
    }
  }

  /**
   * Создание скриншота
   */
  async takeScreenshot(filename: string): Promise<void> {
    try {
      const screenshot = await this.driver.takeScreenshot();
      const fs = require('fs');
      fs.writeFileSync(filename, screenshot, 'base64');
      console.log(`   ✅ Скриншот сохранен: ${filename}`);
    } catch (error) {
      console.error(`   ❌ Ошибка создания скриншота ${filename}:`, error);
    }
  }

  /**
   * Получение информации о браузере
   */
  async getBrowserInfo(): Promise<void> {
    try {
      console.log('\n📊 Информация о браузере:');
      
      // Выполнение JavaScript для получения информации
      const info = await this.driver.executeScript(`
        return {
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
      `);
      
      console.log(`   User-Agent: ${info.userAgent}`);
      console.log(`   Язык: ${info.language}`);
      console.log(`   Платформа: ${info.platform}`);
      console.log(`   Размер экрана: ${info.screen.width}x${info.screen.height}`);
      console.log(`   Размер окна: ${info.window.innerWidth}x${info.window.innerHeight}`);
      
    } catch (error) {
      console.error('❌ Ошибка получения информации о браузере:', error);
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
      console.log('🚀 Запуск примера Selenium в безголовом режиме...');
      
      // Инициализация драйвера
      await this.initializeDriver();
      
      // Получение информации о браузере
      await this.getBrowserInfo();
      
      // Тестирование JavaScript
      await this.testJavaScriptExecution();
      
      // Тестирование сетевых запросов
      await this.testNetworkRequests();
      
      // Тестирование веб-сайтов
      await this.testWebsites();
      
      // Тестирование производительности
      await this.testPerformance();
      
      console.log('\n✅ Пример Selenium в безголовом режиме успешно выполнен!');
      
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
  const example = new SeleniumHeadlessExample();
  example.run().catch(console.error);
}

export default SeleniumHeadlessExample;
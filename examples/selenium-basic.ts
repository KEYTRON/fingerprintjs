import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

/**
 * Базовый пример использования Selenium WebDriver
 * Демонстрирует основные возможности автоматизации браузера
 */
class SeleniumBasicExample {
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
   * Открытие веб-страницы
   */
  async openPage(url: string): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      await this.driver.get(url);
      console.log(`✅ Страница ${url} успешно открыта`);
      
      // Ждем загрузки страницы
      await this.driver.wait(until.titleContains(''), 10000);
    } catch (error) {
      console.error('❌ Ошибка открытия страницы:', error);
      throw error;
    }
  }

  /**
   * Поиск элемента на странице
   */
  async findElement(selector: string, timeout: number = 5000): Promise<any> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      const element = await this.driver.wait(
        until.elementLocated(By.css(selector)),
        timeout
      );
      console.log(`✅ Элемент ${selector} найден`);
      return element;
    } catch (error) {
      console.error(`❌ Элемент ${selector} не найден:`, error);
      throw error;
    }
  }

  /**
   * Клик по элементу
   */
  async clickElement(selector: string): Promise<void> {
    try {
      const element = await this.findElement(selector);
      await element.click();
      console.log(`✅ Клик по элементу ${selector} выполнен`);
    } catch (error) {
      console.error(`❌ Ошибка клика по элементу ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Ввод текста в поле
   */
  async typeText(selector: string, text: string): Promise<void> {
    try {
      const element = await this.findElement(selector);
      await element.clear();
      await element.sendKeys(text);
      console.log(`✅ Текст "${text}" введен в поле ${selector}`);
    } catch (error) {
      console.error(`❌ Ошибка ввода текста в поле ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Получение текста элемента
   */
  async getElementText(selector: string): Promise<string> {
    try {
      const element = await this.findElement(selector);
      const text = await element.getText();
      console.log(`✅ Текст элемента ${selector}: "${text}"`);
      return text;
    } catch (error) {
      console.error(`❌ Ошибка получения текста элемента ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Сделать скриншот страницы
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
   * Получение информации о странице
   */
  async getPageInfo(): Promise<void> {
    try {
      if (!this.driver) throw new Error('Драйвер не инициализирован');
      
      const title = await this.driver.getTitle();
      const url = await this.driver.getCurrentUrl();
      
      console.log('📄 Информация о странице:');
      console.log(`   Заголовок: ${title}`);
      console.log(`   URL: ${url}`);
    } catch (error) {
      console.error('❌ Ошибка получения информации о странице:', error);
      throw error;
    }
  }

  /**
   * Ожидание загрузки страницы
   */
  async waitForPageLoad(): Promise<void> {
    try {
      if (!this.driver) return;
      
      await this.driver.wait(
        async () => {
          const readyState = await this.driver!.executeScript('return document.readyState');
          return readyState === 'complete';
        },
        10000
      );
      console.log('✅ Страница полностью загружена');
    } catch (error) {
      console.error('❌ Ошибка ожидания загрузки страницы:', error);
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
      console.log('🚀 Запуск базового примера Selenium...');
      
      // Инициализация драйвера
      await this.initializeDriver();
      
      // Открытие Google
      await this.openPage('https://www.google.com');
      await this.waitForPageLoad();
      
      // Получение информации о странице
      await this.getPageInfo();
      
      // Ввод текста для поиска
      await this.typeText('input[name="q"]', 'Selenium WebDriver');
      
      // Ожидание и клик по кнопке поиска
      await this.clickElement('input[name="btnK"]');
      
      // Ожидание результатов поиска
      if (this.driver) {
        await this.driver.wait(until.elementLocated(By.id('search')), 5000);
      }
      
      // Получение заголовка первого результата
      await this.getElementText('#search h3');
      
      // Создание скриншота
      await this.takeScreenshot('google-search-results.png');
      
      console.log('✅ Базовый пример Selenium успешно выполнен!');
      
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
  const example = new SeleniumBasicExample();
  example.run().catch(console.error);
}

export default SeleniumBasicExample;
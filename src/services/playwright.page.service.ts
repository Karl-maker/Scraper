import { Page } from 'playwright';
import { NavigatablePage } from '../interfaces/services/i.navigatable.page.service';
import { ClickablePage } from '../interfaces/services/i.clickable.page.service';
import { ReadablePage } from '../interfaces/services/i.readabe.page.service';
import { WritablePage } from '../interfaces/services/i.writable.page.service';
import { TableReadablePage } from '../interfaces/services/i.table.readable.page.service';
import { WaitablePage } from '../interfaces/services/i.waitable.page.service';
import { TrackablePage } from '../interfaces/services/i.trackable.page.service';

export class PlayWrightPageService implements 
  NavigatablePage,
  ClickablePage,
  ReadablePage,
  WritablePage,
  TableReadablePage,
  WaitablePage,
  TrackablePage
{
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) : Promise<void> {
    await this.page.goto(url)
  };

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForNavigation(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.waitForNavigation(options);
  }

  async clickById(id: string): Promise<void> {
    await this.page.click(`#${id}`);
  }

  async clickByClass(className: string): Promise<void> {
    await this.page.click(`.${className}`);
  }

  async clickBySelector(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async clickByText(text: string): Promise<void> {
    await this.page.click(`text=${text}`);
  }

  async getTextById(id: string): Promise<string> {
    return await this.page.textContent(`#${id}`) ?? '';
  }

  async getTextByClass(className: string): Promise<string> {
    return await this.page.textContent(`.${className}`) ?? '';
  }

  async getTextBySelector(selector: string): Promise<string> {
    return await this.page.textContent(selector) ?? '';
  }

  async getAttributeBySelector(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  async getInnerHTMLBySelector(selector: string): Promise<string> {
    return await this.page.innerHTML(selector);
  }

  async getOuterHTMLBySelector(selector: string): Promise<string> {
    return await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? element.outerHTML : '';
    }, selector);
  }

  async typeById(id: string, text: string): Promise<void> {
    await this.page.fill(`#${id}`, text);
  }

  async typeByClass(className: string, text: string): Promise<void> {
    await this.page.fill(`.${className}`, text);
  }

  async typeBySelector(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async clearById(id: string): Promise<void> {
    await this.page.fill(`#${id}`, '');
  }

  async clearByClass(className: string): Promise<void> {
    await this.page.fill(`.${className}`, '');
  }

  async clearBySelector(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  async selectOptionById(id: string, value: string): Promise<void> {
    await this.page.selectOption(`#${id}`, value);
  }

  async selectOptionBySelector(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async checkCheckboxById(id: string): Promise<void> {
    await this.page.check(`#${id}`);
  }

  async checkCheckboxBySelector(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  async uncheckCheckboxById(id: string): Promise<void> {
    await this.page.uncheck(`#${id}`);
  }

  async uncheckCheckboxBySelector(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  async getTableDataById(id: string): Promise<string[][]> {
    return this.getTableDataBySelector(`#${id}`);
  }

  async getTableDataBySelector(selector: string, skipCount: number = 0): Promise<string[][]> {
    return await this.page.evaluate(
      ({ selector, skipCount }: { selector: string; skipCount: number }) => {
        const tables = Array.from(document.querySelectorAll(selector));
  
        // Skip the first `skipCount` tables
        const tablesToProcess = tables.slice(skipCount);
  
        const allData: string[][] = [];
  
        tablesToProcess.forEach((table) => {
          const rows = Array.from(table.querySelectorAll('tr'));
  
          // Extract data from the rows
          const tableData = rows.map((row) => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map((cell) => cell.textContent?.trim() || '');
          });
  
          // Filter out empty rows (rows with no cells or all empty cells)
          const filteredTableData = tableData.filter((row) =>
            row.some((cell) => cell.length > 0)
          );
  
          // Add the filtered data to the final result
          allData.push(...filteredTableData);
        });
  
        return allData; // Return combined data from the tables processed
      },
      { selector, skipCount } // Pass arguments as a single object
    );
  }

  async getTableByFirstTrTagSelector(selector: string): Promise<string[][]> {
    return await this.page.evaluate((selector) => {
      const firstTr = document.querySelector(selector);
      if (!firstTr) return []; // If the first tr element is not found, return an empty array

      // Start from the next sibling of the first tr element
      let currentRow = firstTr.nextElementSibling;
      const allData: string[][] = [];

      // Loop through each subsequent tr element
      while (currentRow) {
        const cells = Array.from(currentRow.querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || '');
        allData.push(cells);
        currentRow = currentRow.nextElementSibling; // Move to the next tr element
      }

      return allData; // Return the array of data
    }, selector);
  }

  async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForText(text: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForFunction(
      (text) => document.body.innerText.includes(text),
      text,
      { timeout }
    );
  }

  async waitForUrl(url: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToPosition(x: number, y: number): Promise<void> {
    await this.page.evaluate(([x, y]) => window.scrollTo(x, y), [x, y]);
  }

  async scrollIntoViewIfNeeded(selector: string): Promise<void> {
    const element = await this.page.$(selector);
    if (element) {
      await element.scrollIntoViewIfNeeded();
    }
  }
}

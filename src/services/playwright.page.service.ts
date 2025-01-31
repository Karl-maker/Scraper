import { Page } from 'playwright';
import { PageService } from '../interfaces/services/i.page.service';

export class PlayWrightPageService implements PageService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async clickById(id: string): Promise<void> {
    await this.page.click(`#${id}`);
  }

  async clickByClass(className: string): Promise<void> {
    await this.page.click(`.${className}`);
  }

  async readTableData(tableClass: string, rowIndex: number, colIndex: number): Promise<string> {
    try {
      // Locate the cell using the table class, row index, and column index
      const cell = this.page.locator(`.${tableClass} tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1})`);
  
      // Ensure the cell is in the viewport
      await cell.scrollIntoViewIfNeeded();
  
      // Wait for the cell to be visible
      await cell.waitFor({ state: 'visible' });
  
      // Return the text content of the cell
      return await cell.textContent() ?? "";
    } catch (error) {
      throw new Error(`Failed to read table data at row ${rowIndex}, column ${colIndex}: ${error}`);
    }
  }

  async clickTableCell(tableClass: string, rowIndex: number, colIndex: number): Promise<void> {
    await this.page.click(`.${tableClass} tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1})`);
  }

  async clickTableRow(rowIndex: number): Promise<void> {
    await this.page.click(`table tr:nth-child(${rowIndex + 1})`);
  }

  async readText(selector: string): Promise<string> {
    const element = await this.page.locator(selector);
    return await element.textContent() ?? "";
  }

  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  async typeIntoField(selector: string, text: string, timeout: number = 30000): Promise<void> {
    // Wait for the element to be visible before interacting with it
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    // Fill the input field
    await this.page.fill(selector, text);
  }

  async selectFromDropdown(selector: string, optionText: string, timeout: number = 30000): Promise<void> {
    // Wait for the dropdown to be visible before interacting with it
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    await this.page.selectOption(selector, { label: optionText });
  }

  async submitForm(selector: string): Promise<void> {
    await this.page.click(`${selector} button[type="submit"]`);
  }

  async getElementAttribute(selector: string, attribute: string): Promise<string> {
    const element = await this.page.locator(selector);
    return await element.getAttribute(attribute) ?? "";
  }

  async enterTextByClassName(className: string, text: string, timeout: number = 30000): Promise<void> {
    const inputSelector = `.${className}`;
    // Wait for the input element to be visible before filling it
    await this.page.waitForSelector(inputSelector, { state: 'visible', timeout });
    await this.page.fill(inputSelector, text);
  }

  async countTableRows(tableClass: string): Promise<number> {
    const rows = await this.page.locator(`.${tableClass} tr`);
    return await rows.count();
  }

  async scrollToBottomSlowly(scrollStep: number = 100, scrollDelay: number = 200): Promise<void> {
    await this.page.evaluate(async (step) => {
      // Scroll down incrementally
      const scrollHeight = document.documentElement.scrollHeight;
      let currentScroll = 0;

      const scrollInterval = setInterval(() => {
        // Scroll down by the step size
        window.scrollBy(0, step);
        currentScroll += step;

        // Stop scrolling if we've reached the bottom
        if (currentScroll >= scrollHeight) {
          clearInterval(scrollInterval);
        }
      });
    }, scrollStep);

    // Wait for the page to settle after scrolling
    await this.page.waitForTimeout(scrollDelay * 2);
  }
}

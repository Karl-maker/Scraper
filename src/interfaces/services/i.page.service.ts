export interface PageService {
    /**
     * Clicks a button, link, or element by its selector (id, class, or CSS selector).
     * @param selector CSS selector of the element to click.
     * @returns Promise<void>
     */
    click(selector: string): Promise<void>;
  
    /**
     * Clicks a button or link by its ID.
     * @param id The ID of the element to click.
     * @returns Promise<void>
     */
    clickById(id: string): Promise<void>;
  
    /**
     * Clicks an element by its class name.
     * @param className The class name of the element to click.
     * @returns Promise<void>
     */
    clickByClass(className: string): Promise<void>;
  
    /**
     * Reads data from a table cell based on the row and column index.
     * @param rowIndex The index of the row (0-based).
     * @param colIndex The index of the column (0-based).
     * @returns Promise<string> The text content of the cell.
     */
    readTableData(tableClass: string, rowIndex: number, colIndex: number): Promise<string>;
  
    /**
     * Clicks a specific row and column in a table.
     * @param rowIndex The index of the row (0-based).
     * @param colIndex The index of the column (0-based).
     * @returns Promise<void>
     */
    clickTableCell(tableClass: string, rowIndex: number, colIndex: number): Promise<void>;
  
    /**
     * Clicks a specific table row.
     * @param rowIndex The index of the row to click (0-based).
     * @returns Promise<void>
     */
    clickTableRow(rowIndex: number): Promise<void>;
  
    /**
     * Reads text from an element (could be a header, paragraph, etc.) by its selector.
     * @param selector The CSS selector for the element.
     * @returns Promise<string> The text content of the element.
     */
    readText(selector: string): Promise<string>;
  
    /**
     * Waits for an element to be visible or interactable before performing an action.
     * @param selector The CSS selector for the element.
     * @returns Promise<void>
     */
    waitForElement(selector: string): Promise<void>;
  
    /**
     * Types text into an input field or text area.
     * @param selector The CSS selector for the input field.
     * @param text The text to type into the field.
     * @returns Promise<void>
     */
    typeIntoField(selector: string, text: string): Promise<void>;
  
    /**
     * Selects an option from a dropdown by the option text.
     * @param selector The CSS selector for the dropdown.
     * @param optionText The text of the option to select.
     * @returns Promise<void>
     */
    selectFromDropdown(selector: string, optionText: string): Promise<void>;
  
    /**
     * Submits a form by its CSS selector.
     * @param selector The CSS selector for the form.
     * @returns Promise<void>
     */
    submitForm(selector: string): Promise<void>;
  
    /**
     * Retrieves the value of an input field or element attribute.
     * @param selector The CSS selector of the element.
     * @param attribute The attribute to retrieve (e.g., 'value', 'href').
     * @returns Promise<string> The value of the attribute.
     */
    getElementAttribute(selector: string, attribute: string): Promise<string>;

    /**
     * Enters text into an input field by its class name.
     * @param className The class name of the input field.
     * @param text The text to enter into the input field.
     * @returns Promise<void>
     */
    enterTextByClassName(className: string, text: string): Promise<void>;

    countTableRows(tableClass: string): Promise<number>;
    scrollToBottomSlowly(scrollStep: number, scrollDelay: number): Promise<void>;
  }
  
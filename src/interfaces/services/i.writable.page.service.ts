export interface WritablePage {
    typeById(id: string, text: string): Promise<void>;
    typeByClass(className: string, text: string): Promise<void>;
    typeBySelector(selector: string, text: string): Promise<void>;
    clearById(id: string): Promise<void>;
    clearByClass(className: string): Promise<void>;
    clearBySelector(selector: string): Promise<void>;
    selectOptionById(id: string, value: string): Promise<void>;
    selectOptionBySelector(selector: string, value: string): Promise<void>;
    checkCheckboxById(id: string): Promise<void>;
    checkCheckboxBySelector(selector: string): Promise<void>;
    uncheckCheckboxById(id: string): Promise<void>;
    uncheckCheckboxBySelector(selector: string): Promise<void>;
}
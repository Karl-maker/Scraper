export interface ReadablePage {
    getTextById(id: string): Promise<string>;
    getTextByClass(className: string): Promise<string>;
    getTextBySelector(selector: string): Promise<string>;
    getAttributeBySelector(selector: string, attribute: string): Promise<string | null>;
    getInnerHTMLBySelector(selector: string): Promise<string>;
    getOuterHTMLBySelector(selector: string): Promise<string>;
}
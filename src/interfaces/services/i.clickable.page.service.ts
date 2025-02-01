export interface ClickablePage {
    clickById: (id: string) => Promise<void>;
    clickByClass: (className: string) => Promise<void>;
    clickBySelector: (selector: string) => Promise<void>;
    clickByText: (text: string) => Promise<void>;
}
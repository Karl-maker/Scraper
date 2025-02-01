export interface NavigatablePage {
    navigate: (url: string) => Promise<void>;
    goBack: () => Promise<void>;
    goForward: () => Promise<void>;
    refresh: () => Promise<void>;
    getCurrentUrl: () => Promise<string>;
    waitForNavigation: (options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) => Promise<void>;
}

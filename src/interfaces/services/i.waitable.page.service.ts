export interface WaitablePage {
    waitForSelector(selector: string, timeout?: number): Promise<void>;
    waitForText(text: string, timeout?: number): Promise<void>;
    waitForUrl(url: string, timeout?: number): Promise<void>;
    waitForNetworkIdle(timeout?: number): Promise<void>;
    waitForTimeout(milliseconds: number): Promise<void>;
}
  
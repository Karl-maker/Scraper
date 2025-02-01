export interface TrackablePage {
    scrollToElement(selector: string): Promise<void>;
    scrollToBottom(): Promise<void>;
    scrollToTop(): Promise<void>;
    scrollToPosition(x: number, y: number): Promise<void>;
    scrollIntoViewIfNeeded(selector: string): Promise<void>;
}
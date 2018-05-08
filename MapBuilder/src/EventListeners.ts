module MapBuilder {
    export interface ClickEventListener {
        (this: HTMLElement, ev: MouseEvent): any;
    }
}    
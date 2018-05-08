/// <reference path="IControlCollection.ts" />

module MapBuilder.Controls {
    export interface IControl {
        hashCode: number;
        element: HTMLElement;

        invalidate(): void;
    }
}
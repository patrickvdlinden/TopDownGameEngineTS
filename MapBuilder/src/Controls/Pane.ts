/// <reference path="ControlContainer.ts" />

module MapBuilder.Controls {
    export class Pane extends ControlContainer {
        private _titleBarElement: HTMLElement;
        private _titleElement: HTMLElement;
        private _bodyElement: HTMLElement;

        private _title: string;
        private _top: number;
        private _left: number;
        private _width: number;
        private _height: number;

        public constructor(title?: string) {
            super();

            this._title = title;
        }

        public get bodyElement(): HTMLElement {
            return this._bodyElement;
        }

        public get title(): string {
            return this._title;
        }

        public set title(title: string) {
            this._title = title;

            this.invalidate();
        }

        protected get titleBarElement(): HTMLElement {
            return this._titleBarElement;
        }

        protected get titleElement(): HTMLElement {
            return this._titleElement;
        }

        protected onInvalidate(): void {
            if (this.title) {
                if (!this._titleBarElement) {
                    this._titleBarElement = this.createTitleBarElement(this.element);
                }

                if (!this.element.classList.contains("pane--hasTitle")) {
                    this.element.classList.add("pane--hasTitle");
                }

                this._titleElement.innerText = this.title;
            } else {
                if (this._titleBarElement) {
                    this._titleBarElement.remove();
                }

                if (this.element.classList.contains("pane--hasTitle")) {
                    this.element.classList.remove("pane--hasTitle");
                }
                
                this._titleBarElement = null;
            }

            if (!this._bodyElement) {
                this._bodyElement = this.createBodyElement(this.element);
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("pane");

            if (this.title) {
                this._titleBarElement = this.createTitleBarElement(element);
            }

            this._bodyElement = this.createBodyElement(element);

            return element;
        }

        protected createTitleBarElement(parentElement: HTMLElement): HTMLElement {
            const titleBarElement = document.createElement("div");
            titleBarElement.classList.add("pane__titleBar");

            this._titleElement = this.createTitleElement(titleBarElement);

            parentElement.appendChild(titleBarElement);

            return titleBarElement;
        }

        protected createTitleElement(parentElement: HTMLElement): HTMLElement {
            const titleElement = document.createElement("h3");
            titleElement.classList.add("pane__title");

            parentElement.appendChild(titleElement);

            return titleElement;
        }

        protected createBodyElement(parentElement: HTMLElement): HTMLElement {
            const bodyElement = document.createElement("div");
            bodyElement.classList.add("pane__body");

            parentElement.appendChild(bodyElement);

            return bodyElement;
        }

        protected createControlsCollection(): ControlsCollection {
            return new ControlsCollection(this, this._bodyElement);
        }
    }
}
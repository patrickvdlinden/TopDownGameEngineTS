/// <reference path="Control.ts" />

module MapBuilder.Controls {
    export class Modal extends Control {
        private _windowElement: HTMLElement;
        private _closeWindowButtonElement: HTMLElement;
        private _titleElement: HTMLElement;
        private _bodyElement: HTMLElement;
        private _title: string;
        private _body: string;
        private _closeListener: Function;

        public constructor(title: string) {
            super();

            this._title = title;
            this.isVisible = false;
        }

        public get title(): string {
            return this._title;
        }

        public set title(title: string) {
            this._title = title;

            this.invalidate();
        }

        public get body(): string {
            return this._body;
        }

        public set body(body: string) {
            this._body = body;

            this.invalidate();
        }

        protected get windowElement(): HTMLElement {
            return this._windowElement;
        }

        protected get closeWindowButtonElement(): HTMLElement {
            return this._closeWindowButtonElement;
        }

        protected get titleElement(): HTMLElement {
            return this._titleElement;
        }

        protected get bodyElement(): HTMLElement {
            return this._bodyElement;
        }

        public setCloseListener(listener: Function): this {
            this._closeListener = listener;

            return this;
        }

        public open(): this {
            this.isVisible = true;

            return this;
        }

        public close(): this {
            this.isVisible = false;

            if (this._closeListener) {
                this._closeListener.apply(this);
            }

            return this;
        }

        protected onInvalidate(): void {
            if (!this._windowElement) {
                return;
            }

            if (this._title) {
                if (!this._titleElement) {
                    this._titleElement = this.createTitleElement(this._windowElement);
                }

                this._titleElement.innerText = this._title;
            } else if (this._titleElement) {
                this._titleElement.remove();
                this._titleElement = null;
            }

            if (this._body) {
                if (!this._bodyElement) {
                    this._bodyElement = this.createBodyElement(this._windowElement);
                }

                this._bodyElement.innerHTML = this._body;
            } else if (this._bodyElement) {
                this._bodyElement.remove();
                this._bodyElement = null;
            }

            if (this.isVisible) {
                if (!this.element.classList.contains("modal--opened")) {
                    this.element.classList.add("modal--opened");
                }
            } else {
                if (this.element.classList.contains("modal--opened")) {
                    this.element.classList.remove("modal--opened");
                }
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("modal");

            this._windowElement = this.createWindowElement(element);

            return element;
        }

        protected createWindowElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("modal__window");

            this._closeWindowButtonElement = this.createCloseWindowButtonElement(element);

            if (this._title && !this._titleElement) {
                this._titleElement = this.createTitleElement(element);
            }

            if (this._body && !this._bodyElement) {
                this._bodyElement = this.createBodyElement(element);
            }

            parentElement.appendChild(element);

            return element;
        }

        protected createCloseWindowButtonElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("button");
            element.setAttribute("type", "button");
            element.classList.add("modal__closeWindowButton");
            element.addEventListener("click", this.onWindowCloseButtonClick);

            parentElement.appendChild(element);

            return element;
        }

        protected createTitleElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("modal__title");

            parentElement.appendChild(element);

            return element;
        }

        protected createBodyElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("modal__body");
            element.innerHTML = this._body;
            
            parentElement.appendChild(element);
            
            return element;
        }

        protected onWindowCloseButtonClick = (event: MouseEvent): any => {
            this.close();
        }
    }
}
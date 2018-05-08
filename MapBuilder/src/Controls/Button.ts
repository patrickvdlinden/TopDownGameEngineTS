/// <reference path="Control.ts" />

module MapBuilder.Controls {
    export class Button extends Control {
        private _label: string;
        private _clickHandler: ClickEventListener;

        public constructor(label: string, clickHandler?: ClickEventListener) {
            super();

            this._label = label;
            this._clickHandler = clickHandler;
        }

        public get label(): string {
            return this._label;
        }

        public set label(label: string) {
            this._label = label;

            this.invalidate();
        }

        public setClickHandler(clickHandler: ClickEventListener): this {
            this._clickHandler = clickHandler;

            return this;
        }

        protected onInvalidate(): void {
            if (this._label) {
                this.element.innerText = this._label;
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("button");
            element.classList.add("button");
            element.addEventListener("click", this.onClick);

            return element;
        }

        protected onClick = (event: MouseEvent): any => {
            if (this._clickHandler) {
                this._clickHandler.apply(event);
            }
        }
    }
}
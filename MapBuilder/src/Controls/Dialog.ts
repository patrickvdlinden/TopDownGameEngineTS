/// <reference path="Modal.ts" />

module MapBuilder.Controls {
    export class Dialog extends Modal {
        private _buttonsContainerElement: HTMLElement;
        private _buttons: Button[] = [];

        public get buttons(): Button[] {
            return this._buttons;
        }

        protected onInvalidate(): void {
            super.invalidate();

            if (!this.windowElement) {
                return;
            }

            if (this._buttons.length > 0) {
                if (!this._buttonsContainerElement) {
                    this._buttonsContainerElement = this.createButtonsContainerElement(this.windowElement);
                }

                this._buttonsContainerElement.innerHTML = "";

                for (let i = 0; i < this._buttons.length; i++) {
                    const button = this._buttons[i];

                    this._buttonsContainerElement.appendChild(button.element);
                    button.element.addEventListener("click", this.onDialogButtonClick);
                    button.invalidate();

                    if (!button.element.classList.contains("button--dialog")) {
                        button.element.classList.add("button--dialog");
                    }
                }

                if (this.body && this.bodyElement) {
                    this.windowElement.insertBefore(this.bodyElement, this._buttonsContainerElement);
                }
            }
        }

        protected createElement(): HTMLElement {
            const element = super.createElement();

            element.classList.add("modal--dialog");
            element.classList.add("dialog");

            return element;
        }

        protected createWindowElement(parentElement: HTMLElement): HTMLElement {
            const element = super.createWindowElement(parentElement);

            this._buttonsContainerElement = this.createButtonsContainerElement(element);

            return element;
        }

        protected createButtonsContainerElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("dialog__buttonsContainer");

            parentElement.appendChild(element);

            return element;
        }

        protected onDialogButtonClick = (event: MouseEvent): any => {
            this.close();
        }
    }
}
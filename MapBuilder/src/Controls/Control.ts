module MapBuilder.Controls {
    export abstract class Control implements IControl {
        private static controlCounter: number = 0;

        private _hashCode: number;
        private _element: HTMLElement;
        private _dockMode: DockMode = DockMode.None;
        private _isVisible: boolean = true;

        public constructor() {
            this._hashCode = ++Control.controlCounter;
        }

        public get hashCode(): number {
            return this._hashCode;
        }

        public get element(): HTMLElement {
            return this._element || (this._element = this.createElementInternal());
        }

        public get dockMode(): DockMode {
            return this._dockMode;
        }

        public set dockMode(dockMode: DockMode) {
            this._dockMode = dockMode;

            if (this._element) {
                this.invalidate();
            }
        }

        public get isVisible(): boolean {
            return this._isVisible;
        }

        public set isVisible(isVisible: boolean) {
            this._isVisible = isVisible;

            if (this._element) {
                this.invalidate();
            }
        }

        public invalidate(): void {
            if (this.dockMode !== DockMode.None) {
                this.element.classList.add("docked");

                let dockModeStrings = DockModeStringHelper.toString(this.dockMode).toLowerCase().split(" ");
                for (let i = 0; i < dockModeStrings.length; i++) {
                    this.element.classList.add("docked--" + dockModeStrings[i]);
                }
            }
            
            if (!this.isVisible) {
                if (!this.element.classList.contains("control--hidden")) {
                    this.element.classList.add("control--hidden");
                }
            } else {
                if (this.element.classList.contains("control--hidden")) {
                    this.element.classList.remove("control--hidden");
                }
            }

            this.onInvalidate();
        }

        protected abstract createElement(): HTMLElement;
        protected abstract onInvalidate(): void;

        private createElementInternal(): HTMLElement {
            const element = this.createElement();
            element.classList.add("control");

            return element;
        }
    }
}
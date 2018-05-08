/// <reference path="Control.ts" />

module MapBuilder.Controls {
    export class AppContainer implements IControl, IInvalidatable {
        private _element: HTMLElement;
        private _toolbarMenu: ToolbarMenu;
        private _toolbarMenuAdded: boolean = false;
        private _pane: Pane;

        public constructor() {
            this._pane = new Pane();
            this._pane.dockMode = DockMode.All;
        }

        public get element(): HTMLElement {
            return this._element || (this._element = this.createElement());
        }

        public get hashCode(): number {
            return Number.MIN_VALUE;
        }

        public get toolbarMenu(): ToolbarMenu {
            return this._toolbarMenu;
        }

        public set toolbarMenu(toolbarMenu: ToolbarMenu) {
            if (this._toolbarMenu) {
                this._toolbarMenu.element.remove();
            }

            this._toolbarMenu = toolbarMenu;
            this._toolbarMenuAdded = false;

            this.invalidate();
        }

        public get pane(): Pane {
            return this._pane;
        }

        public invalidate(): void {
            if (this._toolbarMenu) {
                if (!this._toolbarMenuAdded) {
                    this._element.insertBefore(this._toolbarMenu.element, this._element.childNodes[0]);
                    this._toolbarMenuAdded = true;
                }

                this._toolbarMenu.invalidate();

                if (!this._element.classList.contains("appContainer--hasToolbarMenu")) {
                    this._element.classList.add("appContainer--hasToolbarMenu");
                }
            } else {
                if (this._element.classList.contains("appContainer--hasToolbarMenu")) {
                    this._element.classList.remove("appContainer--hasToolbarMenu");
                }
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("appContainer");

            if (this._toolbarMenu) {
                element.insertBefore(this._toolbarMenu.element, this._element.childNodes[0]);
                this._toolbarMenuAdded = true;
            }

            element.appendChild(this.pane.element);

            return element;
        }
    }
}
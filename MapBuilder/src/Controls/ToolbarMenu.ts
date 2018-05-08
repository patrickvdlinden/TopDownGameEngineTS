module MapBuilder.Controls {
    export class ToolbarMenu extends Control {
        private _menuElement: HTMLElement;
        private _menuItems: ToolbarMenuItem[] = [];

        public constructor() {
            super();
        }

        public get menuItems(): ToolbarMenuItem[] {
            return this._menuItems.slice();
        }

        public addMenuItem(menuItem: ToolbarMenuItem): this {
            this._menuItems.push(menuItem);

            if (this._menuElement) {
                this.invalidate();
            }

            return this;
        }

        protected onInvalidate() {
            if (this._menuItems.length === 0) {
                return;
            }

            if (!this._menuElement) {
                this._menuElement = this.createMenuElement(this.element);
            }

            this._menuElement.innerHTML = "";

            for (let i = 0; i < this._menuItems.length; i++) {
                this._menuElement.appendChild(this._menuItems[i].element);
                this._menuItems[i].invalidate();
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("toolbarMenuContainer");

            this._menuElement = this.createMenuElement(element);

            return element;
        }

        protected createMenuElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("ul");
            element.classList.add("toolbarMenu");

            parentElement.appendChild(element);

            return element;
        }
    }
}
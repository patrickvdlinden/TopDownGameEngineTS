module SpritesheetBuilder {
    export class ToolbarMenu {
        private _element: HTMLElement;
        private _menuElement: HTMLElement;
        private _menuItems: ToolbarMenuItem[] = [];

        public constructor() {
        }

        public get element(): HTMLElement {
            const element = this._element;
            if (element) {
                this.invalidate();
                return this._element;
            }

            return this.createElement();
        }


        public get menuItems(): ToolbarMenuItem[] {
            return this._menuItems.slice();
        }

        public addMenuItem(menuItem: ToolbarMenuItem): this {
            this._menuItems.push(menuItem);

            this.invalidate();

            return this;
        }

        public appendTo(container: HTMLElement): this {
            container.appendChild(this.element);

            return this;
        }

        private createElement(): HTMLElement {
            this._element = document.createElement("div");
            this._element.classList.add("toolbarMenuContainer");

            this._menuElement = document.createElement("ul");
            this._menuElement.classList.add("toolbarMenu");

            for (let i = 0; i < this._menuItems.length; i++) {
                this._menuElement.appendChild(this._menuItems[i].element);
            }

            this._element.appendChild(this._menuElement);

            return this._element;
        }
        
        private invalidate() {
            if (this._element) {
                this._element.innerHTML = "";

                for (let i = 0; i < this._menuItems.length; i++) {
                    this._element.appendChild(this._menuItems[i].element);
                }
            }
        }
    }

    export class ToolbarMenuItem {
        private _element: HTMLElement;
        private _labelElement: HTMLElement;
        private _subMenuElement: HTMLElement;
        private _label: string;
        private _shortKeys: Keys[];
        private _clickHandler: ClickEventListener;
        private _children: ToolbarMenuItem[] = [];
        private _isEnabled: boolean = true;

        public constructor(label: string, shortKeys?: Keys[]) {
            this._label = label;
            this._shortKeys = shortKeys;
        }

        public get element(): HTMLElement {
            const element = this._element;
            if (element) {
                this.invalidate();
                return this._element;
            }
            
            return this.createElement();
        }

        public get label(): string {
            return this._label;
        }

        public set label(label: string) {
            this._label = label;

            this.invalidate();
        }

        public get shortKeys(): Keys[] {
            return this._shortKeys;
        }

        public set shortKeys(shortKeys: Keys[]) {
            this._shortKeys = shortKeys;

            this.invalidate();
        }

        public get clickHandler(): ClickEventListener {
            return this._clickHandler;
        }
        
        public set clickHandler(clickHandler: ClickEventListener) {
            this._clickHandler = clickHandler;

            this.invalidate();
        }

        public get children(): ToolbarMenuItem[] {
            return this._children.slice();
        }

        public get isEnabled(): boolean {
            return this._isEnabled;
        }

        public set isEnabled(isEnabled: boolean) {
            this._isEnabled = isEnabled;

            this.invalidate();
        }

        public setLabel(label: string): this {
            this.label = label;

            return this;
        }

        public setShortKeys(shortKeys: Keys[]): this {
            this.shortKeys = shortKeys;

            return this;
        }

        public disable(): this {
            this.isEnabled = false;

            return this;
        }

        public setClickHandler(clickHandler: ClickEventListener): this {
            this.clickHandler = clickHandler;

            return this;
        }

        public addChildItem(menuItem: ToolbarMenuItem): this {
            this._children.push(menuItem);

            this.invalidate();

            return this;
        }

        protected createElement(): HTMLElement {
            this._element = document.createElement("li");
            this._element.classList.add("toolbarMenu__item");
            this._element.onmouseover = this.onMouseOver;
            this._element.onmouseout = this.onMouseOut;

            this._labelElement = document.createElement("span");
            this._labelElement.classList.add("toolbarMenu__itemLabel");
            this._labelElement.onmousedown = this.onMouseDown;
            this._element.appendChild(this._labelElement);

            if (this._children.length > 0) {
                this.createSubMenuElement();
            }    

            document.addEventListener("mousedown", this.onDocumentMouseDown);

            this.invalidate();

            return this._element;
        }

        protected createSubMenuElement(): void {
            this._subMenuElement = document.createElement("ul");
            this._subMenuElement.classList.add("toolbarMenu__subMenu");

            this._element.appendChild(this._subMenuElement);
        }

        protected invalidate() {
            if (!this._element) {
                return;
            }

            if (!this._isEnabled) {
                this._element.classList.add("toolbarMenu__item--disabled");
            } else if (this._element.classList.contains("toolbarMenu__item--disabled")) {
                this._element.classList.remove("toolbarMenu__item--disabled");
            }

            if (this._labelElement) {
                if (this._label === "-") {
                    this._labelElement.innerText = "";

                    if (!this._element.classList.contains("toolbarMenu__item--divider")) {
                        this._element.classList.add("toolbarMenu__item--divider");
                    }
                } else {
                    this._labelElement.innerText = this._label;

                    if (this._element.classList.contains("toolbarMenu__item--divider")) {
                        this._element.classList.remove("toolbarMenu__item--divider");
                    }
                }

                if (this._clickHandler) {
                    this._labelElement.onclick = this.clickHandler;
                }
            }
            
            if (this.children.length > 0 && !this._subMenuElement) {
                this.createSubMenuElement();
            }

            if (this._subMenuElement) {
                this._subMenuElement.innerHTML = "";

                for (let i = 0; i < this._children.length; i++) {
                    this._subMenuElement.appendChild(this._children[i].element);
                }
            }
        }

        protected onMouseDown = (event: MouseEvent): any => {
            if (this._children.length > 0) {
                if (!this._element.classList.contains("toolbarMenu__item--opened")) {
                    this._element.classList.add("toolbarMenu__item--opened");
                } else {
                    this._element.classList.remove("toolbarMenu__item--opened");
                }
            }
        }

        protected onMouseOver = (event: MouseEvent): any => {
            const parent = this._element.parentElement;

            if (!this._element.classList.contains("toolbarMenu__item--opened")
                && parent.classList.contains("toolbarMenu")) {
                
                let open = false;
                for (let i = 0; i < parent.children.length; i++) {
                    let child = parent.children[i];
                    if (child === this._element) {
                        continue;
                    }

                    if (child.classList.contains("toolbarMenu__item--opened")) {
                        open = true;
                        child.classList.remove("toolbarMenu__item--opened");
                    }
                }

                if (open) {
                    this._element.classList.add("toolbarMenu__item--opened");
                }
            }
        }

        protected onMouseOut = (event: MouseEvent): any => {
            
        }

        private onDocumentMouseDown = (event: MouseEvent): any => {
            if (!this._element) {
                return;
            }

            const target = <HTMLElement>event.target;
            if (target !== this._element && !this._element.contains(target)
                && this._element.classList.contains("toolbarMenu__item--opened")) {
                this._element.classList.remove("toolbarMenu__item--opened");
            }
        }
    }
}
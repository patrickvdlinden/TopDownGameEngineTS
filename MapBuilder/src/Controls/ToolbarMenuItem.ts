module MapBuilder.Controls {
    export class ToolbarMenuItem extends Control {
        private _labelElement: HTMLElement;
        private _shortKeysElement: HTMLElement;
        private _subMenuElement: HTMLElement;
        private _label: string;
        private _shortKeys: Keys[];
        private _clickHandler: ClickEventListener;
        private _subItems: ToolbarMenuItem[] = [];
        private _isEnabled: boolean = true;

        public constructor(label: string, shortKeys?: Keys[]) {
            super();

            this._label = label;
            this._shortKeys = shortKeys;
        }

        public get controls(): IControlCollection {
            throw new Error("Child controls are not supported on ToolbarMenuItem, use `addChildItem(menuItem: ToolbarMenuItem)` instead.");
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

        public get subItems(): ToolbarMenuItem[] {
            return this._subItems.slice();
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
            this._clickHandler = clickHandler;

            return this;
        }

        public addSubItem(menuItem: ToolbarMenuItem): this {
            this._subItems.push(menuItem);

            this.invalidate();

            return this;
        }

        protected onInvalidate() {
            if (!this._isEnabled && !this.element.classList.contains("toolbarMenu__item--disabled")) {
                this.element.classList.add("toolbarMenu__item--disabled");
            } else if (this._isEnabled && this.element.classList.contains("toolbarMenu__item--disabled")) {
                this.element.classList.remove("toolbarMenu__item--disabled");
            }

            if ((this._label || this._shortKeys) && !this._labelElement) {
                this._labelElement = this.createLabelElement(this.element);
            }

            if (this._label === "-") {
                this._labelElement.innerText = "";

                if (!this.element.classList.contains("toolbarMenu__item--divider")) {
                    this.element.classList.add("toolbarMenu__item--divider");
                }
            } else {
                // TODO: ShortKey not showing?
                this._labelElement.innerText = this._label;

                if (this.element.classList.contains("toolbarMenu__item--divider")) {
                    this.element.classList.remove("toolbarMenu__item--divider");
                }
            }

            if (this._shortKeys) {
                var shortKeysString = "";
                for (let i = 0; i < this._shortKeys.length; i++) {
                    if (shortKeysString) {
                        shortKeysString += "+";
                    }
                    shortKeysString += KeysStringHelper.toString(this._shortKeys[i]);
                }

                if (shortKeysString) {
                    if (!this._shortKeysElement) {
                        this._shortKeysElement = this.createShortKeysElement(this._labelElement);
                    }

                    this._shortKeysElement.innerText = shortKeysString;
                    this._labelElement.appendChild(this._shortKeysElement);
                }
            }

            if (this._subItems.length > 0) {
                if (!this._subMenuElement) {
                    this._subMenuElement = this.createSubMenuElement(this.element);
                }

                if (!this.element.classList.contains("toolbarMenu__item--hasSubMenu")) {
                    this.element.classList.add("toolbarMenu__item--hasSubMenu");
                }

                this._subMenuElement.innerHTML = "";

                for (let i = 0; i < this._subItems.length; i++) {
                    this._subMenuElement.appendChild(this._subItems[i].element);
                    this._subItems[i].invalidate();
                }
            } else {
                if (this.element.classList.contains("toolbarMenu__item--hasSubMenu")) {
                    this.element.classList.remove("toolbarMenu__item--hasSubMenu");
                }
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("li");
            element.classList.add("toolbarMenu__item");
            element.addEventListener("mouseover", this.onMouseOver);
            element.addEventListener("mouseout", this.onMouseOut);

            if (this._label) {
                this._labelElement = this.createLabelElement(element);
            }

            document.addEventListener("mousedown", this.onDocumentMouseDown);

            return element;
        }

        protected createLabelElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("span");
            element.classList.add("toolbarMenu__itemLabel");
            element.addEventListener("mousedown", this.onMouseDown);
            element.addEventListener("click", this.onClick);

            if (this._shortKeys) {
                this._shortKeysElement = this.createShortKeysElement(element);
            }

            parentElement.appendChild(element);

            return element;
        }

        protected createShortKeysElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("span");
            element.classList.add("toolbarMenu__itemShortKeys");

            parentElement.appendChild(element);

            return element;
        }

        protected createSubMenuElement(parentElement: HTMLElement): HTMLElement {
            const element = document.createElement("ul");
            element.classList.add("toolbarMenu__subMenu");

            parentElement.appendChild(element);

            return element;
        }

        protected onMouseDown = (event: MouseEvent): any => {
            if (this._subItems.length > 0) {
                if (!this.element.classList.contains("toolbarMenu__item--opened")) {
                    this.element.classList.add("toolbarMenu__item--opened");
                } else {
                    this.element.classList.remove("toolbarMenu__item--opened");
                }
            }
        }

        protected onClick = (event: MouseEvent): any => {
            if (this._subItems.length === 0) {
                let parent = this.element.parentElement;
                while (parent && !parent.classList.contains("toolbarMenu")) {
                    if (parent.classList.contains("toolbarMenu__item--opened")) {
                        parent.classList.remove("toolbarMenu__item--opened");
                    }

                    parent = parent.parentElement;
                }


            }
            if (this._clickHandler) {
                this._clickHandler.apply(event);
            }
        }

        protected onMouseOver = (event: MouseEvent): any => {
            const parent = this.element.parentElement;

            if (!this.element.classList.contains("toolbarMenu__item--opened")
                && (parent.classList.contains("toolbarMenu") || parent.classList.contains("toolbarMenu__subMenu"))) {

                let open = false;
                if (parent.classList.contains("toolbarMenu__subMenu")) {
                    open = this._subItems.length > 0;
                } else {
                    for (let i = 0; i < parent.children.length; i++) {
                        let child = parent.children[i];
                        if (child === this.element) {
                            continue;
                        }

                        if (child.classList.contains("toolbarMenu__item--opened")) {
                            open = true;
                            child.classList.remove("toolbarMenu__item--opened");
                        }
                    }
                }

                if (open) {
                    this.element.classList.add("toolbarMenu__item--opened");
                }
            }
        }

        protected onMouseOut = (event: MouseEvent): any => {
            const parent = this.element.parentElement;
            if (this.element.classList.contains("toolbarMenu__item--opened") && parent.classList.contains("toolbarMenu__subMenu")) {
                this.element.classList.remove("toolbarMenu__item--opened");
            }
        }

        private onDocumentMouseDown = (event: MouseEvent): any => {
            if (!this.element) {
                return;
            }

            const target = <HTMLElement>event.target;
            if (target !== this.element && !this.element.contains(target)
                && this.element.classList.contains("toolbarMenu__item--opened")) {
                this.element.classList.remove("toolbarMenu__item--opened");
            }
        }
    }
}
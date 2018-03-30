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
        private _clickHandler: ClickEventListener;
        private _children: ToolbarMenuItem[] = [];

        public constructor(label: string)
        public constructor(label: string, children: ToolbarMenuItem[])
        public constructor(label: string, clickHandler: ClickEventListener)
        public constructor(label: string, clickHandler: ClickEventListener, children: ToolbarMenuItem[])
        public constructor(label: string, arg2?: any, arg3?: any) {
            let clickHandler: ClickEventListener;
            let children: ToolbarMenuItem[];

            if (typeof arg2 !== "undefined") {
                if (Array.isArray ? Array.isArray(arg2) : (arg2 instanceof Array)) {
                    children = arg2;
                } else {
                    clickHandler = arg2;
                }
            }
            
            if (typeof arg3 !== "undefined") {
                children = arg3;
            }

            this._label = label;
            this._clickHandler = clickHandler;

            if (children && children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    this.addChildItem(children[i]);
                }
            }
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

        public get clickHandler(): ClickEventListener {
            return this._clickHandler;
        }
        
        public set clickHandler(clickHandler: ClickEventListener) {
            this._clickHandler = clickHandler;
        }

        public get children(): ToolbarMenuItem[] {
            return this._children.slice();
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
            this.updateLabelStyle();
            this._labelElement.onmousedown = this.onMouseDown;

            if (this._clickHandler) {
                this._labelElement.onclick = this.clickHandler;
            }

            this._element.appendChild(this._labelElement);

            if (this._children.length > 0) {
                this._subMenuElement = document.createElement("ul");
                this._subMenuElement.classList.add("toolbarMenu__subMenu");

                for (let i = 0; i < this._children.length; i++) {
                    this._subMenuElement.appendChild(this._children[i].element);
                }

                this._element.appendChild(this._subMenuElement);
            }

            document.addEventListener("mousedown", this.onDocumentMouseDown);

            return this._element;
        }

        protected invalidate() {
            if (!this._element) {
                return;
            }

            if (this._labelElement) {
                this.updateLabelStyle();

                if (this._clickHandler) {
                    this._labelElement.onclick = this.clickHandler;
                }
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

        private updateLabelStyle() {
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
        }
    }
}
module UI {
    export class SelectBox extends Control {
        private _items: SelectBoxItem[] = [];
        private _selectedIndex: number = 0;
        private _selectedItem: SelectBoxItem = null;
        private _dropDownMenu: SelectBoxDropDownMenu = null;
        private isDropDownBoxOpened: boolean = false;
        private lastKnownItemLength: number = 0;
        private arrowImage: HTMLImageElement;
        private mustMeasureText: boolean = false;
        private selectedItemText: string;

        public constructor() {
            super();

            this._dropDownMenu = new SelectBoxDropDownMenu(this);
        }

        public get items(): SelectBoxItem[] {
            return this._items;
        }

        public get selectedIndex(): number {
            return this._selectedIndex;
        }

        public set selectedIndex(index: number) {
            if (index < -1 || index >= this._items.length) {
                throw new Error("Index out of range");
            }

            var item = this._items[index];
            if (typeof item === "undefined") {
                throw new Error("No item found at index: "+ index);
            }

            this.selectItem(item);
        }

        public get selectedItem(): SelectBoxItem {
            return this._selectedItem;
        }

        public set selectedItem(item: SelectBoxItem) {
            this.selectItem(item);
        }

        public get dropDownMenu(): SelectBoxDropDownMenu {
            return this._dropDownMenu;
        }

        public addItem(label: string, value: any): SelectBoxItem {
            const item = new SelectBoxItem(label, value);
            this.items.push(item);
            return item;
        }

        public handleInput(updateTime: number): boolean {
             if (!super.handleInput(updateTime)) {
                 return false;
             }

             if (this.isDropDownBoxOpened) {
                return this.dropDownMenu.handleInput(updateTime);
             }

             return true;
        }

        protected onInitialize(): void {
            this.backgroundColor = "white";
            this.textColor = "black";

            this.arrowImage = new Image();
            this.arrowImage.src = "arrow_down.png";

            this.dropDownMenu.initialize();
        }

        protected onUpdate(updateTime: number): void {
            if (this.lastKnownItemLength !== this.items.length) {
                this.lastKnownItemLength = this.items.length;
                this.dropDownMenu.invalidate();
            }

            if (this.isDropDownBoxOpened) {
                this.dropDownMenu.update(updateTime);
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.mustMeasureText) {
                let text = this.selectedItem ? this.selectedItem.text : "";
                let textWidth = context.measureText(text).width;

                if (text.length > 0
                    && this.bounds.width - this.padding.horizontal > context.measureText(text[0]).width) {
                    while (textWidth > this.bounds.width - this.padding.horizontal) {
                        text = text.substring(0, text.length - 1);
                        textWidth = context.measureText(text).width;
                    }
                }

                this.selectedItemText = text;
                this.mustMeasureText = false;
            }

            // render textbox-like control
            context.fillStyle = this.backgroundColor;
            context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.height);

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.height);

            if (this.selectedIndex >= 0) {
                context.font = `${this.textSize}px ${this.fontFamily}`;
                context.fillText(
                    (this.selectedItem || { text: "" }).text,
                    this.bounds.x + this.padding.left,
                    this.bounds.y + this.padding.top);
            }

            context.drawImage(this.arrowImage, this.bounds.right - this.padding.right, this.bounds.centerY - (this.arrowImage.height / 2));

            if (this.isDropDownBoxOpened) {
                this.dropDownMenu.draw(context);
            }
        }

        protected selectItem(item: SelectBoxItem): void {
            var index = this._items.indexOf(item);

            if (item === null || typeof item === "undefined") {
                this._selectedItem = null;
                this._selectedIndex = -1;
            } else if (index === -1) {
                throw new Error("Item not found")
            } else {
                this._selectedIndex = index;
                this._selectedItem = item;
            }

            this.mustMeasureText = true;
            this.selectedItemText = "";
        }

        protected onBlur(): void {
            super.onBlur();
        }

        protected onFocus(): void {
            super.onFocus();

            this.isDropDownBoxOpened = true;
        }

        protected onMouseDown(mouseSate: Input.MouseState): void {
            super.onMouseDown(mouseSate);

            this.isDropDownBoxOpened = !this.isDropDownBoxOpened;
        }

        protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle): void {
            super.onBoundsChanged(oldBounds, newBounds);

            this.mustMeasureText = true;
            this.selectedItemText = "";
            this.dropDownMenu.invalidate();
        }
    }

    export class SelectBoxDropDownMenu extends Control {
        private defaultHeight: number = 400;
        private _itemHeight: number = 30;
        private mustMeasureWidth: boolean = true;

        public constructor(private parent: SelectBox) {
            super();
        }

        public get itemHeight(): number {
            return this._itemHeight;
        }
        
        public set itemHeight(height: number) {
            this._itemHeight = height;
        }

        public invalidate(): void {
            let height = this.defaultHeight;

            if (this.parent.items.length > 0) {
                height = (this.parent.items.length * this.itemHeight) + this.padding.vertical;
                this.mustMeasureWidth = true;
            }

            this.bounds = new Rectangle(
                this.parent.bounds.x,
                this.parent.bounds.bottom,
                this.parent.bounds.width,
                height);

            for (let i = 0; i < this.parent.items.length; i++) {
                let item = this.parent.items[i];
                item.bounds = new Rectangle(
                    this.bounds.x + this.padding.left,
                    this.bounds.y + (i * this.itemHeight)  + this.padding.top,
                    this.bounds.width,
                    this.itemHeight);
            }
        }

        public handleInput(updateTime: number): boolean {
            super.handleInput(updateTime);

            for (let i = 0; i < this.parent.items.length; i++) {
                let item = this.parent.items[i];
                item.handleInput(updateTime);
            }

            return true;
        }

        protected onInitialize(): void {
            this.backgroundColor = "white";
            this.padding = new Padding(5, 0);

            this.invalidate();

            for (let i = 0; i < this.parent.items.length; i++) {
                let item = this.parent.items[i];
                item.initialize();
            }
        }

        protected onUpdate(updateTime: number): void {
            for (let i = 0; i < this.parent.items.length; i++) {
                let item = this.parent.items[i];
                item.update(updateTime);
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.mustMeasureWidth) {
                let width = this.parent.bounds.width;

                for (let i = 0; i < this.parent.items.length; i++) {
                    let item = this.parent.items[i];
                    let itemWidth = context.measureText(item.text || item.toString()).width + item.padding.horizontal;
                    if (itemWidth > width) {
                        width = itemWidth;
                    }
                }

                this.bounds = new Rectangle(this.bounds.x, this.bounds.y, width + this.padding.horizontal, this.bounds.height);

                for (let i = 0; i < this.parent.items.length; i++) {
                    let item = this.parent.items[i];
                    item.bounds = new Rectangle(item.bounds.x, item.bounds.y, width, this.itemHeight);
                }

                this.mustMeasureWidth = false;
            }

            // render dropdown box
            context.fillStyle = this.backgroundColor;
            context.fillRect(
                this.bounds.x,
                this.bounds.y,
                this.bounds.width,
                this.bounds.height);

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.strokeRect(
                this.bounds.x,
                this.bounds.y,
                this.bounds.width,
                this.bounds.height);

            for (let i = 0; i < this.parent.items.length; i++) {
                let item = this.parent.items[i];

                if (this.parent.selectedIndex === i) {
                    item.backgroundColor = "blue";
                    item.textColor = "white";
                } else {
                    item.backgroundColor = "white";
                    item.textColor = "black";
                }

                item.draw(context);
            }
        }
    }

    export class SelectBoxItem extends Control {
        private _value: any;

        public constructor(text: string, value: any) {
            super();

            this.text = text;
            this._value = value;
        }

        public get value(): any {
            return this._value;
        }

        protected onInitialize(): void {
            this.backgroundColor = "transparent";
            this.backgroundColorHover = "#e5e5e5";
            this.textColor = "black";
            this.padding = new Padding(5, 10);
        }

        protected onUpdate(updateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            context.fillStyle = this.state === ControlStates.Hovered ? this.backgroundColorHover : this.backgroundColor;
            context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

            context.fillStyle = this.textColor;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            context.font = `${this.textSize}px ${this.fontFamily}`;
            context.fillText(
                this.text,
                this.bounds.x + this.padding.left,
                this.bounds.y + this.padding.top);
        }
    }
}
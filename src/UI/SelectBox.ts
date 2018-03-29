module UI {
    export class SelectBox extends Control {
        private _items: SelectBoxItem[] = [];
        private _selectedIndex: number = 0;
        private _selectedItem: SelectBoxItem = null;
        private _dropDownMenu: SelectBoxDropDownMenu = null;
        private isDropDownBoxOpened: boolean = false;
        private lastKnownItemLength: number = 0;
        private arrowDownImage: HTMLImageElement;
        private arrowUpImage: HTMLImageElement;
        private mustMeasureText: boolean = false;
        private selectedItemText: string;

        public constructor() {
            super();

            this._dropDownMenu = new SelectBoxDropDownMenu(this);
            this.backgroundColor = Colors.white;
            this.textColor = Colors.black;
            this.textBaseline = TextBaselines.Middle;
            this.padding = new Padding(5, 10);
        }

        public get items(): SelectBoxItem[] {
            return this._items.slice();
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

        public addItem = (label: string, value: any): SelectBoxItem => {
            const item = new SelectBoxItem(this, label, value);
            this._items.push(item);

            return item;
        }

        public addItemSelectedHandler(handler: IEventHandler2<SelectBoxItem, SelectBoxItem>): this {
            this.eventManager.registerEventHandler("itemSelected", handler);

            return this;
        }

        public handleInput(updateTime: number): boolean {
            if (this.isFocused) {
                let prevKeyboard = Input.Keyboard.previousState;
                let curKeyboard = Input.Keyboard.currentState;

                var isDropDownBoxOpenedBeforeInput = this.isDropDownBoxOpened;

                if (prevKeyboard.isKeyUp(Input.Keys.Down) && curKeyboard.isKeyDown(Input.Keys.Down)) {
                    if (this.selectedIndex === this._items.length - 1) {
                        this.selectedIndex = 0;
                    } else {
                    this.selectedIndex++;
                    }
                } else if (prevKeyboard.isKeyUp(Input.Keys.Up) && curKeyboard.isKeyDown(Input.Keys.Up)) {
                    if (this.selectedIndex === 0) {
                        this.selectedIndex = this._items.length - 1;
                    } else {
                        this.selectedIndex--;
                    }
                } else if (prevKeyboard.isKeyUp(Input.Keys.Enter) && curKeyboard.isKeyDown(Input.Keys.Enter)) {
                    isDropDownBoxOpenedBeforeInput = false;
                }

                this.isDropDownBoxOpened = isDropDownBoxOpenedBeforeInput;
            }
            
            if (!super.handleInput(updateTime)) {
                 return false;
            }

            if (this.isDropDownBoxOpened) {
               return this.dropDownMenu.handleInput(updateTime);
            }

            return true;
        }

        protected onInitialize(): void {
            this.arrowDownImage = new Image();
            this.arrowDownImage.src = "arrow_down.png";

            this.arrowUpImage = new Image();
            this.arrowUpImage.src = "arrow_up.png";

            this.dropDownMenu.initialize();
        }

        protected onUninitialize(): void {
            this.dropDownMenu.uninitialize();
        }

        protected onUpdate(updateTime: number): void {
            if (this.lastKnownItemLength !== this._items.length) {
                this.lastKnownItemLength = this._items.length;
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
            context.fillRect(this.viewportX, this.viewportY, this.width, this.height);

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.strokeRect(this.viewportX, this.viewportY, this.width, this.height);

            context.fillStyle = "grey";
            context.fillRect(
                this.viewportX + this.width - this.padding.horizontal - this.arrowDownImage.width,
                this.viewportY + 1,
                1,
                this.height - 2);

            if (this.selectedIndex >= 0) {
                context.beginPath();
                context.rect(
                    this.viewportX + this.padding.left,
                    this.viewportY + this.padding.top,
                    this.width - this.padding.horizontal - this.arrowDownImage.width,
                    this.height - this.padding.vertical);
                context.clip();
                context.font = `${this.textSize}px ${this.fontFamily}`;
                context.textBaseline = this.textBaseline;
                context.fillStyle = this.textColor;
                context.fillText(
                    (this.selectedItem || { text: "" }).text,
                    this.viewportX + this.padding.left,
                    this.viewportY + (this.height / 2));
                context.restore();
            }
            
            if (this.isDropDownBoxOpened) {
                this.dropDownMenu.draw(context);

                context.drawImage(
                    this.arrowUpImage,
                    this.viewportX + this.width - this.padding.right - this.arrowDownImage.width,
                    this.viewportY + (this.height / 2) - (this.arrowDownImage.height / 2));
            } else {
                context.drawImage(
                    this.arrowDownImage,
                    this.viewportX + this.width - this.padding.right - this.arrowDownImage.width,
                    this.viewportY + (this.height / 2) - (this.arrowDownImage.height / 2));
            }
        }

        protected selectItem(item: SelectBoxItem): void {
            var index = this._items.indexOf(item);

            let oldItem = this._selectedItem;

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
            this.isDropDownBoxOpened = false;

            this.onItemSelected(oldItem, this._selectedItem);
        }

        protected handleOnBlur(): boolean {
            let curMouse = Input.Mouse.currentState;

            if (curMouse.x >= this.dropDownMenu.bounds.x && curMouse.x <= this._bounds.right
                && curMouse.y >= this.dropDownMenu.bounds.y && curMouse.y <= this.dropDownMenu.bounds.bottom) {
                return false;
            }

            return true;
        }

        protected onBlur(): void {
            super.onBlur();

            this.isDropDownBoxOpened = false;
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

        protected onItemSelected(oldItem: SelectBoxItem, newItem: SelectBoxItem): void {
            this.eventManager.triggerEvent("itemSelected", oldItem, newItem);
        }
    }

    export class SelectBoxDropDownMenu extends Control {
        private defaultHeight: number = 400;
        private _itemHeight: number = 30;
        private mustMeasureWidth: boolean = true;

        public constructor(private selectBox: SelectBox) {
            super();
        }

        protected get viewportX(): number {
            return this.x + (this.selectBox.manager ? this.selectBox.manager.game.viewport.x : 0);
        }

        protected get viewportY(): number {
            return this.y + (this.selectBox.manager ? this.selectBox.manager.game.viewport.y : 0);
        }

        public get itemHeight(): number {
            return this._itemHeight;
        }
        
        public set itemHeight(height: number) {
            this._itemHeight = height;
        }

        public invalidate(): void {
            let height = this.defaultHeight;

            if (this.selectBox.items.length > 0) {
                height = (this.selectBox.items.length * this.itemHeight) + this.padding.vertical;
                this.mustMeasureWidth = true;
            }

            this.bounds = new Rectangle(
                this.selectBox.bounds.x,
                this.selectBox.bounds.bottom,
                this.selectBox.bounds.width,
                height);

            for (let i = 0; i < this.selectBox.items.length; i++) {
                let item = this.selectBox.items[i];
                item.bounds = new Rectangle(
                    this.bounds.x + this.padding.left,
                    this.bounds.y + (i * this.itemHeight)  + this.padding.top,
                    this.bounds.width,
                    this.itemHeight);
            }
        }

        public handleInput(updateTime: number): boolean {
            super.handleInput(updateTime);

            for (let i = 0; i < this.selectBox.items.length; i++) {
                let item = this.selectBox.items[i];
                item.handleInput(updateTime);
            }

            return true;
        }

        protected onInitialize(): void {
            this.backgroundColor = "white";
            this.padding = new Padding(5, 0);

            this.invalidate();

            for (let i = 0; i < this.selectBox.items.length; i++) {
                let item = this.selectBox.items[i];
                item.initialize();                
                item.addClickHandler((mouseState: Input.MouseState) => {
                    this.selectBox.selectedItem = item;
                })
            }
        }

        protected onUpdate(updateTime: number): void {
            for (let i = 0; i < this.selectBox.items.length; i++) {
                let item = this.selectBox.items[i];
                item.update(updateTime);
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.mustMeasureWidth) {
                let width = this.selectBox.bounds.width;

                for (let i = 0; i < this.selectBox.items.length; i++) {
                    let item = this.selectBox.items[i];
                    let itemWidth = context.measureText(item.text || item.toString()).width + item.padding.horizontal;
                    if (itemWidth > width) {
                        width = itemWidth;
                    }
                }

                this.bounds = new Rectangle(this.bounds.x, this.bounds.y, width + this.padding.horizontal, this.bounds.height);

                for (let i = 0; i < this.selectBox.items.length; i++) {
                    let item = this.selectBox.items[i];
                    item.bounds = new Rectangle(item.bounds.x, item.bounds.y, width, this.itemHeight);
                }

                this.mustMeasureWidth = false;
            }

            // render dropdown box
            context.fillStyle = this.backgroundColor;
            context.fillRect(
                this.viewportX,
                this.viewportY,
                this.width,
                this.height);

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.strokeRect(
                this.viewportX,
                this.viewportY,
                this.width,
                this.height);

            const items = this.selectBox.items;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                if (this.selectBox.selectedIndex === i) {
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

        public constructor(private selectBox: SelectBox, text: string, value: any) {
            super();

            this.text = text;
            this._value = value;
        }

        protected get viewportX(): number {
            return this.x + (this.selectBox.manager ? this.selectBox.manager.game.viewport.x : 0);
        }

        protected get viewportY(): number {
            return this.y + (this.selectBox.manager ? this.selectBox.manager.game.viewport.y : 0);
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
            context.fillRect(this.viewportX, this.viewportY, this.bounds.width, this.bounds.height);

            context.fillStyle = this.textColor;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            context.font = `${this.textSize}px ${this.fontFamily}`;
            context.fillText(
                this.text,
                this.viewportX + this.padding.left,
                this.viewportY + this.padding.top);
        }
    }
}
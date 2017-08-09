module UI {
    export abstract class Control implements IInitializable, IUpdatable, IDrawableWithContext {
        public static defaultTextSize: number = 14;

        protected _bounds: Rectangle;
        protected eventManager: EventManager;
        protected textureFile: string = null;
        protected _manager: ControlManager = null;
        protected cursorInBounds: boolean = false;
        
        private _isInitialized: boolean = false;
        private _state: ControlStates = ControlStates.Default;
        private _text: string = null;
        private _cursor = Cursors.Default;
        private _backgroundColor: string = "rgba(0, 0, 0, 0.7)";
        private _backgroundColorHover: string = "rgba(0, 0, 0, 1)";
        private _padding = new Padding(7, 15);
        private _fontFamily: string = "'Segoe UI', Arial, sans-serif";
        private _textSize: number = Control.defaultTextSize;
        private _textColor: string = "#FFFFFF";
        private _textBaseline: TextBaselines = TextBaselines.Alphabetic;
        private _textAlign: TextAligns = TextAligns.Left;
        private _isFocused: boolean = false;

        public constructor() {
            this._bounds = new Rectangle();
            this.eventManager = new EventManager(this);

            Input.Keyboard.addKeyDownHandler((key: Input.Keys, state: Input.KeyboardState) => {
                if (this.isFocused) {
                    this.onKeyDown(key, state);
                }
            });

            Input.Keyboard.addKeyUpHandler((key: Input.Keys, state: Input.KeyboardState) => {
                if (this.isFocused) {
                    this.onKeyUp(key, state);
                }
            });
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get bounds(): Rectangle {
            return this._bounds;
        }

        public set bounds(bounds: Rectangle) {
            let oldBounds = this._bounds;
            this._bounds = bounds;

            if (this._isInitialized) {
                this.onBoundsChanged(oldBounds, bounds);
            }
        }

        public get x(): number {
            return this._bounds.x;
        }

        public set x(x: number) {
            this._bounds = this._bounds.update(x, this._bounds.y, this._bounds.width, this._bounds.height);
        }

        public get y(): number {
            return this._bounds.y;
        }

        public set y(y: number) {
            this._bounds = this._bounds.update(this._bounds.x, y, this._bounds.width, this._bounds.height);
        }

        public get width(): number {
            return this._bounds.width;
        }

        public set width(width: number) {
            this._bounds = this._bounds.update(this._bounds.x, this._bounds.y, width, this._bounds.height);
        }

        public get height(): number {
            return this._bounds.height;
        }

        public set height(height: number) {
            this._bounds = this.bounds.update(this._bounds.x, this._bounds.y, this._bounds.width, height);
        }

        public get state(): ControlStates {
            return this._state;
        }

        public set state(state: ControlStates) {
            this._state = state;
        }

        public get manager(): ControlManager {
            return this._manager;
        }

        public set manager(manager: ControlManager) {
            if (this._manager !== null && this._manager.contains(this)) {
                this._manager.remove(this);
            }

            this._manager = manager;

            if (manager !== null && !manager.contains(this)) {
                manager.add(this);
            }
        }

        public get zIndex(): number {
            if (this._manager !== null) {
                return this._manager.getZIndex(this);
            }

            return 0;
        }

        public get cursor(): Cursors {
            return this._cursor;
        }

        public set cursor(cursor: Cursors) {
            this._cursor = cursor;
        }

        public get backgroundColor(): string {
            return this._backgroundColor;
        }

        public set backgroundColor(color: string) {
            this._backgroundColor = color;
        }

        public get backgroundColorHover(): string {
            return this._backgroundColorHover;
        }

        public set backgroundColorHover(color: string) {
            this._backgroundColorHover = color;
        }

        public get padding(): Padding {
            return this._padding;
        }

        public set padding(padding: Padding) {
            let oldPadding = this._padding;
            this._padding = padding;       
            
            if (this._isInitialized) {
                this.onPaddingChanged(oldPadding, padding);
            }
        }

        public get text(): string {
            return this._text;
        }

        public set text(text: string) {
            let oldText = this._text;
            this._text = text;

            if (this._isInitialized) {
                this.onTextChanged(oldText, text);
            }
        }

        public get fontFamily(): string {
            return this._fontFamily;
        }

        public set fontFamily(fontFamily: string) {
            this._fontFamily = fontFamily;
        }

        public get textSize(): number {
            return this._textSize;
        }

        public set textSize(textSize: number) {
            this._textSize = textSize;
        }

        public get textColor(): string {
            return this._textColor;
        }

        public set textColor(color: string) {
            this._textColor = color;
        }

        public get textBaseline(): TextBaselines {
            return this._textBaseline;
        }

        public set textBaseline(textBaseline: TextBaselines) {
            this._textBaseline = textBaseline;
        }

        public get textAlign(): TextAligns {
            return this._textAlign;
        }

        public set textAlign(textAlign: TextAligns) {
            this._textAlign = textAlign;
        }

        public get isFocused(): boolean {
            return this._isFocused;
        }

        public initialize() {
            if (this._isInitialized) {
                throw new Error("Control is already initialized.");
            }

            this.onInitialize();
            this._isInitialized = true;
        }

        public uninitialize() {
            if (!this._isInitialized) {
                throw new Error("Control is not yet initialized.");
            }

            this.onUninitialize();
            this._isInitialized = false;
        }

        public addMouseOverHandler(handler: Input.IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseover", handler);

            return this;
        }

        public addMouseOutHandler(handler: Input.IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseout", handler);

            return this;
        }

        public addMouseDownHandler(handler: Input.IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mousedown", handler);

            return this;
        }

        public addMouseUpHandler(handler: Input.IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseup", handler);

            return this;
        }

        public addClickHandler(handler: Input.IMouseEventHandler): this {
            this.eventManager.registerEventHandler("click", handler);

            return this;
        }

        public addBoundsChangedHandler(handler: IEventHandler2<Rectangle, Rectangle>): this {
            this.eventManager.registerEventHandler("boundschanged", handler);

            return this;
        }

        public addPaddingChangedHandler(handler: IEventHandler2<Padding, Padding>): this {
            this.eventManager.registerEventHandler("paddingchanged", handler);

            return this;
        }

        public addTextChangedHandler(handler: IEventHandler2<string, string>): this {
            this.eventManager.registerEventHandler("textchanged", handler);

            return this;
        }

        public addKeyDownHandler(handler: Input.IKeyboardEventHandler): this {
            this.eventManager.registerEventHandler("keydown", handler);

            return this;
        }

        public addKeyUpHandler(handler: Input.IKeyboardEventHandler): this {
            this.eventManager.registerEventHandler("keyup", handler);

            return this;
        }

        public bringToFront(): this {
            if (this._manager === null) {
                throw new Error("Cannot bring unmanaged control to front.");
            }

            this._manager.bringToFront(this);

            return this;
        }

        public requestFocus(): boolean {
            if (this._manager === null) {
                this._isFocused = true;
                return true;
            }

            if (this._manager.focusControl(this)) {
                this._isFocused = true;

                return true;
            }

            return false;
        }

        public releaseFocus(): this {
            this.onBlur();
            this._isFocused = false;

            return this;
        }

        public handleInput(lastUpdateTime: number): boolean {
            var prevMouse = Input.Mouse.previousState;
            var curMouse = Input.Mouse.currentState;

            if (curMouse.x >= this._bounds.x && curMouse.x <= this._bounds.right
                && curMouse.y >= this._bounds.y && curMouse.y <= this._bounds.bottom) {

                if (!this.cursorInBounds) {
                    this.cursorInBounds = true;
                    this.onMouseOver(curMouse);
                }

                if (!prevMouse.isLeftButtonPressed && curMouse.isLeftButtonPressed) {
                    this.onMouseDown(curMouse);    
                    
                    if (!this.isFocused) {
                        if (this.manager !== null) {
                            this.manager.focusControl(this);
                        }

                        this._isFocused = true;
                        this.onFocus();
                    }
                }
            } else if (this.cursorInBounds) {
                this.onMouseOut(curMouse);
                this.cursorInBounds = false;
            } else if (!prevMouse.isLeftButtonPressed && curMouse.isLeftButtonPressed) {
                if (this._isFocused) {
                    this.onBlur();
                }
                this._isFocused = false;                
            }

            if (this._state === ControlStates.Pressed) {
                if (this.manager) {
                    this.manager.enableExclusiveInputHandling(this);
                }

                if (prevMouse.isLeftButtonPressed && !curMouse.isLeftButtonPressed) {
                    this.onMouseUp(curMouse);

                    if (this.cursorInBounds) {
                        this.onClick(curMouse);
                    } else {
                        this.onMouseOut(curMouse);
                        this.cursorInBounds = false;
                    }

                    this.manager.disableExclusiveInputHandling();
                }

                return false;
            }

            return !this.cursorInBounds;
        }

        public resetInput() {
            if (this.cursorInBounds) {
                this.onMouseOut(Input.Mouse.currentState);
                this.cursorInBounds = false;
            }
        }

        public update(lastUpdateTime: number): void {
            this.onUpdate(lastUpdateTime);
        }

        public draw(context: CanvasRenderingContext2D): void {
            this.onDraw(context);
        }

        protected abstract onInitialize(): void;

        protected onUninitialize(): void {
        }

        protected abstract onUpdate(lastUpdateTime: number): void;
        protected abstract onDraw(context: CanvasRenderingContext2D): void;
        
        protected onMouseOver(mouseState: Input.MouseState) {
            if (this.state === ControlStates.Pressed) {
                return;
            }

            this.state = ControlStates.Hovered;
            this.eventManager.triggerEvent("mouseover", Input.Mouse.currentState);
        }

        protected onMouseOut(mouseState: Input.MouseState) {
            if (this.state === ControlStates.Pressed) {
                return;
            }

            this.state = ControlStates.Default;
            this.eventManager.triggerEvent("mouseout", Input.Mouse.currentState);
        }

        protected onMouseDown(mouseState: Input.MouseState): void {
            this.state = ControlStates.Pressed;
            this.eventManager.triggerEvent("mousedown", Input.Mouse.currentState);
        }

        protected onMouseUp(mouseState: Input.MouseState) {
            this.state = ControlStates.Default;
            this.state = ControlStates.Default;
            this.eventManager.triggerEvent("mouseup", Input.Mouse.currentState);
        }

        protected onClick(mouseState: Input.MouseState): void {
            this.eventManager.triggerEvent("click", Input.Mouse.currentState);
        }

        protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle): void {
            this.eventManager.triggerEvent("boundschanged", oldBounds, newBounds);
        }

        protected onPaddingChanged(oldPadding: Padding, newPadding: Padding): void {
            this.eventManager.triggerEvent("paddingchanged", oldPadding, newPadding);
        }

        protected onTextChanged(oldText: string, newText: string): void {
            this.eventManager.triggerEvent("textchanged", oldText, newText);
        }

        protected onFocus(): void {
            this.eventManager.triggerEvent("focus");
        }

        protected onBlur(): void {
            this.eventManager.triggerEvent("blur");
        }

        protected onKeyDown(key: Input.Keys, keyboardState: Input.KeyboardState): void {
            this.eventManager.triggerEvent("keydown", key, Input.Keyboard.currentState);

            if (key === Input.Keys.Tab) {
                if (keyboardState.isShiftKeyPressed) {
                    this.manager.focusPreviousControl();
                } else {
                    this.manager.focusNextControl();
                }
            }
        }

        protected onKeyUp(key: Input.Keys, keyboardState: Input.KeyboardState): void {
            this.eventManager.triggerEvent("keyup", key, Input.Keyboard.currentState);
        }
    }
}
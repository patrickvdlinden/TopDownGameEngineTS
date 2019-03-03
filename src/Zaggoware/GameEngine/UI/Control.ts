namespace Zaggoware.GameEngine.UI {
    import IKeyboardEventHandler = Input.IKeyboardEventHandler;
    import KeyboardState = Input.KeyboardState;
    import Keyboard = Input.Keyboard;
    import Keys = Input.Keys;
    import IMouseEventHandler = Input.IMouseEventHandler;
    import MouseState = Input.MouseState;
    import Mouse = Input.Mouse;

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
        private _textBaseline: TextBaselines = TextBaselines.Top;
        private _textAlign: TextAligns = TextAligns.Left;
        private _isFocused: boolean = false;
        private _isHidden: boolean = false;

        public constructor() {
            this._bounds = new Rectangle();
            this.eventManager = new EventManager(this);

            Keyboard.addKeyDownHandler((key: Keys, state: KeyboardState) => {
                if (this.isFocused) {
                    this.onKeyDown(key, state);
                }
            });

            Keyboard.addKeyUpHandler((key: Keys, state: KeyboardState) => {
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
            return this.bounds.x;
        }

        public set x(x: number) {
            this.bounds = this.bounds.update(x, this.bounds.y, this.bounds.width, this.bounds.height);
        }

        public get y(): number {
            return this.bounds.y;
        }

        public set y(y: number) {
            this.bounds = this.bounds.update(this.bounds.x, y, this.bounds.width, this.bounds.height);
        }

        public get width(): number {
            return this.bounds.width;
        }

        public set width(width: number) {
            this.bounds = this.bounds.update(this.bounds.x, this.bounds.y, width, this.bounds.height);
        }

        public get height(): number {
            return this.bounds.height;
        }

        public set height(height: number) {
            this.bounds = this.bounds.update(this.bounds.x, this.bounds.y, this.bounds.width, height);
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

            const oldManager = this._manager;
            this._manager = manager;

            if (oldManager !== manager) {
                this.onManagerChanged(oldManager, manager);
            }

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

        public get isHidden(): boolean {
            return this._isHidden;
        }

        protected get viewportX(): number {
            return this.x + (this.manager ? this.manager.game.viewport.x : 0);
        }

        protected get viewportY(): number {
            return this.y + (this.manager ? this.manager.game.viewport.y : 0);
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

        public addMouseOverHandler(handler: IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseover", handler);

            return this;
        }

        public addMouseOutHandler(handler: IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseout", handler);

            return this;
        }

        public addMouseDownHandler(handler: IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mousedown", handler);

            return this;
        }

        public addMouseUpHandler(handler: IMouseEventHandler): this {
            this.eventManager.registerEventHandler("mouseup", handler);

            return this;
        }

        public addClickHandler(handler: IMouseEventHandler): this {
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

        public addVisibilityChangedHandler(handler: IEventHandler1<boolean>): this {
            this.eventManager.registerEventHandler("visibilityChanged", handler);

            return this;
        }

        public addKeyDownHandler(handler: IKeyboardEventHandler): this {
            this.eventManager.registerEventHandler("keydown", handler);

            return this;
        }

        public addKeyUpHandler(handler: IKeyboardEventHandler): this {
            this.eventManager.registerEventHandler("keyup", handler);

            return this;
        }

        public addManagerChangedHandler(handler: IEventHandler2<ControlManager, ControlManager>): this {
            this.eventManager.registerEventHandler("managerChanged", handler);

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

        public hide(): this {
            this.onHide();
            this._isHidden = true;

            return this;
        }

        public show(): this {
            this.onShow();
            this._isHidden = false;

            return this;
        }

        public handleInput(updateTime: number): boolean {
            var prevMouse = Input.Mouse.previousState;
            var curMouse = Input.Mouse.currentState;

            if (this.isCursorInBounds(updateTime, curMouse)) {
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
                if (this.handleOnBlur()) {
                    if (this._isFocused) {
                        this.onBlur();
                    }
                    this._isFocused = false;
                }
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

                    if (this.manager) {
                        this.manager.disableExclusiveInputHandling();
                    }
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

        public update(updateTime: number): void {
            this.onUpdate(updateTime);
        }

        public draw(context: CanvasRenderingContext2D): void {
            if (this._isHidden) {
                return;
            }
            
            context.save();
            this.onDraw(context);
            context.restore();
        }

        protected isCursorInBounds(updateTime: number, mouseState: MouseState): boolean {
            return mouseState.x >= this._bounds.x && mouseState.x <= this._bounds.right
            && mouseState.y >= this._bounds.y && mouseState.y <= this._bounds.bottom;
        }

        protected abstract onInitialize(): void;

        protected onUninitialize(): void {
        }

        protected abstract onUpdate(updateTime: number): void;
        protected abstract onDraw(context: CanvasRenderingContext2D): void;
        
        protected onMouseOver(mouseState: MouseState) {
            if (this.state === ControlStates.Pressed) {
                return;
            }

            this.state = ControlStates.Hovered;
            this.eventManager.triggerEvent("mouseover", Mouse.currentState);
        }

        protected onMouseOut(mouseState: MouseState) {
            if (this.state === ControlStates.Pressed) {
                return;
            }

            this.state = ControlStates.Default;
            this.eventManager.triggerEvent("mouseout", Mouse.currentState);
        }

        protected onMouseDown(mouseState: MouseState): void {
            this.state = ControlStates.Pressed;
            this.eventManager.triggerEvent("mousedown", Mouse.currentState);
        }

        protected onMouseUp(mouseState: MouseState) {
            this.state = ControlStates.Default;
            this.state = ControlStates.Default;
            this.eventManager.triggerEvent("mouseup", Mouse.currentState);
        }

        protected onClick(mouseState: MouseState): void {
            this.eventManager.triggerEvent("click", Mouse.currentState);
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

        protected handleOnBlur(): boolean {
            return true;
        }

        protected onBlur(): void {
            this.eventManager.triggerEvent("blur");
        }

        protected onHide(): void {
            if (!this._isHidden) {
                this.eventManager.triggerEvent("visibilityChanged", false);
            }
        }

        protected onShow(): void {
            if (this._isHidden) {
                this.eventManager.triggerEvent("visibilityChanged", true);
            }
        }

        protected onKeyDown(key: Keys, keyboardState: KeyboardState): void {
            this.eventManager.triggerEvent("keydown", key, Input.Keyboard.currentState);

            if (key === Keys.Tab) {
                if (keyboardState.isShiftKeyPressed) {
                    this.manager.focusPreviousControl();
                } else {
                    this.manager.focusNextControl();
                }
            }
        }

        protected onKeyUp(key: Keys, keyboardState: KeyboardState): void {
            this.eventManager.triggerEvent("keyup", key, Input.Keyboard.currentState);
        }

        protected onManagerChanged(oldManager: ControlManager, newManager: ControlManager): void {
            this.eventManager.triggerEvent("managerChanged", oldManager, newManager);
        }
    }
}
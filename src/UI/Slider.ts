module UI {
    export class Slider extends Control {
        private handle: SliderHandle;
        private sliderHeight: number = 5;
        private _value: number = 0;

        constructor() {
            super();
            
            this.backgroundColor = Colors.white;
            this.handle = new SliderHandle(this);
            this.height = 30;
            this.padding = new Padding(0, 0);
        }

        public get value(): number {
            return this._value;
        }

        public set value(value: number) {
            if (isNaN(value)) {
                value = 0;
            }

            value = Math.max(0, Math.min(1, value));

            if (this._value === value) {
                return;
            }

            const oldValue = this._value;
            this._value = value;
            this.onValueChanged(this._value, value);
            this.handle.invalidate();
        }

        public handleInput(updateTime: number): boolean {
            return this.handle.handleInput(updateTime);
        }

        public addValueChangedHandler(handler: IEventHandler2<number, number>): this {
            this.eventManager.registerEventHandler("valueChanged", handler);

            return this;
        }

        protected onInitialize(): void {
            this.handle.initialize();
        }

        protected onUninitialize(): void {
            this.handle.uninitialize();
        }

        protected onUpdate(updateTime: number): void {
            this.handle.update(updateTime);
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            context.fillStyle = this.backgroundColor;
            context.fillRect(
                this.viewportX,
                this.viewportY + ((this.height - this.sliderHeight) / 2),
                this.width,
                this.sliderHeight);

            this.handle.draw(context);
        }

        protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle): void {
            super.onBoundsChanged(oldBounds, newBounds);

            this.handle.invalidate();
        }

        protected onValueChanged(oldValue: number, newValue: number): void {
            this.eventManager.triggerEvent("valueChanged", oldValue, newValue);
        }
    }

    export class SliderHandle extends Button {
        private _slider: Slider;
        private mouseDown: boolean = false;
        private mouseOffsetX: number = 0;

        public constructor(slider: Slider) {
            super();

            this._slider = slider;
            this.autoSize = false;
            this.backgroundColor = Colors.yellow;
            this.backgroundColorHover = "#AAAA00";
            this.backgroundColorPressed = "#AAAA00";
            this.clickSoundEnabled = false;
        }

        protected get viewportX(): number {
            return (this.slider.manager ? this.slider.manager.game.viewport.x : 0) + this.x;
        }

        protected get viewportY(): number {
            return (this.slider.manager ? this.slider.manager.game.viewport.y : 0) + this.y;
        }

        public get slider(): Slider {
            return this._slider;
        }

        protected isCursorInBounds(updateTime: number, mouseState: Input.MouseState): boolean {
            return Math.pow(mouseState.x - this.bounds.centerX, 2) + Math.pow(mouseState.y - this.bounds.centerY, 2)
                   < Math.pow(this.width / 2, 2);
        }

        public invalidate() {
            let newWidth = this.width;
            let newHeight = this.height;

            if (this.width === 0 || this.height === 0 || this.width !== this.height
                || this.width > this._slider.height || this.height > this.slider.height) {
                newWidth = this._slider.height;
                newHeight = this._slider.height;
            }

            let relX = (this._slider.width * this._slider.value) - (newWidth / 2);
            let relY = -((this._slider.height - newHeight) / 2);

            this.bounds = new Rectangle(this._slider.x + relX, this._slider.y + relY, newWidth, newHeight);
        }

        protected onInitialize(): void {
            super.onInitialize();
            
            this.invalidate();
        }

        protected onUpdate(updateTime: number): void {
            if (this.mouseDown) {
                let mouseState = Input.Mouse.currentState;
                
                this.x = mouseState.x - this.mouseOffsetX;
            } else if (this.isFocused) {
                const prevKeyboard = Input.Keyboard.previousState;
                const curKeyboard = Input.Keyboard.currentState;

                let moveSpeed = 0.0005 * updateTime;
                let skipValueMovement = false;

                if (curKeyboard.isKeyDown(Input.Keys.Control)) {
                    if (prevKeyboard.isKeyUp(Input.Keys.Right)
                        && curKeyboard.isKeyDown(Input.Keys.Right)) {
                        if (this.slider.value < 0.5) {
                            this.slider.value = 0.5;
                        } else {
                            this.slider.value = 1;
                        }
                    } else if (prevKeyboard.isKeyUp(Input.Keys.Left)
                        && curKeyboard.isKeyDown(Input.Keys.Left)) {
                            if (this.slider.value > 0.5) {
                                this.slider.value = 0.5;
                            } else {
                                this.slider.value = 0;
                            }
                    }
                    skipValueMovement = true;
                } else if (curKeyboard.isKeyDown(Input.Keys.Shift)) {
                    moveSpeed = 0.001 * updateTime;
                }

                if (!skipValueMovement) {
                    if (curKeyboard.isKeyDown(Input.Keys.Right)) {
                        this.slider.value += moveSpeed;
                    } else if (curKeyboard.isKeyDown(Input.Keys.Left)) {
                        this.slider.value -= moveSpeed;
                    }
                }
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            context.fillStyle = this.state === ControlStates.Hovered
                ? this.backgroundColorHover
                : (this.state === ControlStates.Pressed
                    ? this.backgroundColorPressed
                    : this.backgroundColor);
            
            context.beginPath();
            context.ellipse(
                this.viewportX + (this.width / 2),
                this.viewportY + (this.height / 2),
                this.width / 2, this.height / 2,
                0,
                0,
                Math.PI * 2,
                false);
            //context.arc(this.x, this.y, 15, 0, 2 * Math.PI, true);
            context.fill();
        }

        protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle): void {
            let relMinX = -(newBounds.width / 2);
            let relMinY = -((this._slider.height - newBounds.height) / 2);
            
            if (newBounds.y !== this._slider.y + relMinY) {
                newBounds = newBounds.update(newBounds.x, this._slider.y + relMinY, newBounds.width, newBounds.height);
            }

            if (newBounds.x < this._slider.x + relMinX) {
                newBounds = newBounds.update(this._slider.x + relMinX, newBounds.y, newBounds.width, newBounds.height);
            } else if (newBounds.x > this._slider.bounds.right + relMinX) {
                newBounds = newBounds.update(this._slider.bounds.right + relMinX, newBounds.y, newBounds.width, newBounds.height);
            }

            this._bounds = newBounds;

            if (oldBounds.x !== newBounds.x || oldBounds.y !== newBounds.y
                || oldBounds.width !== newBounds.width || oldBounds.height !== newBounds.height) {
                this.slider.value = (newBounds.x + (this.width / 2) - this._slider.x) / this._slider.width;
                super.onBoundsChanged(oldBounds, newBounds);
            }
        }

        protected onMouseDown(mouseState: Input.MouseState): void {
            super.onMouseDown(mouseState);

            this.mouseDown = true;
            this.mouseOffsetX = mouseState.x - this.x;
        }

        protected onMouseUp(mouseState: Input.MouseState) {
            super.onMouseUp(mouseState);

            this.mouseDown = false;
        }
    }
}
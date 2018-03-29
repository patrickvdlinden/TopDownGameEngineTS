module UI {
    export class Label extends Control {
        private _target: Control;
        private _autoSize: boolean = true;
        private _textWidth: number = null;
        private mustRecalculateSize: boolean = true;
        private mustMeasureTextWidth: boolean = true;

        public constructor() {
            super();

            this.backgroundColor = "transparent";
            this.backgroundColorHover = "transparent";
        }

        public get target(): Control {
            return this._target;
        }

        public set target(control: Control) {
            this._target = control;
        }

        public get autoSize(): boolean {
            return this._autoSize;
        }
        
        public set autoSize(flag: boolean) {
            this._autoSize = flag;

            if (flag) {
                this.mustRecalculateSize = true;
            } else {
                this.mustRecalculateSize = false;
            }
        }

        public get textWidth(): number {
            return this._textWidth;
        }

        protected onInitialize(): void {
        }

        protected onUpdate(updateTime: number): void {
            if (this.autoSize && this.mustRecalculateSize) {
                this.bounds = this.bounds.update(this.x, this.y, this._textWidth + this.padding.horizontal, this.textSize + this.padding.vertical);
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.mustMeasureTextWidth) {
                this.mustMeasureTextWidth = false;

                this._textWidth = context.measureText(this.text).width;
            }

            context.fillStyle = this.backgroundColor;
            context.fillRect(this.viewportX, this.viewportY, this.width, this.height);

            if (this.text) {
                context.fillStyle = this.textColor;
                context.textAlign = this.textAlign;
                context.textBaseline = this.textBaseline;
                context.font = `${this.textSize}px ${this.fontFamily}`;

                let x = this.padding.left;
                let y = this.padding.top;
                switch (this.textBaseline) {
                    case TextBaselines.Middle:
                        y = this.height / 2;
                        break;

                    case TextBaselines.Bottom:
                        y =  this.bounds.bottom;
                        break;
                }

                context.fillText(this.text, this.viewportX + x, this.viewportY + y);
            }
        }

        protected onFocus() {
            super.onFocus();

            if (this.target) {
                this.target.requestFocus();
            }
        }

        protected onTextChanged(oldText: string, newText: string) {
            this.mustMeasureTextWidth = true;

            if (this.autoSize) {
                this.mustRecalculateSize = true;
            }
        }

         protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle) {
            if (newBounds.width !== oldBounds.width || newBounds.height !== oldBounds.height) {
                this.autoSize = false;
                this.mustRecalculateSize = false;
            }
        }
    }
}
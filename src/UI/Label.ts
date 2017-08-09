module UI {
    export class Label extends Control {
        private _target: Control;
        private _autoSize: boolean = true;
        private _textWidth: number = null;
        private mustRecalculateSize: boolean = true;
        private mustMeasureTextWidth: boolean = true;

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
            this.backgroundColor = "transparent";
            this.backgroundColorHover = "transparent";
        }

        protected onUpdate(lastUpdateTime: number): void {
            if (this.autoSize && this.mustRecalculateSize) {
                this.bounds = this.bounds.update(this.x, this.y, this._textWidth + this.padding.horizontal, this.textSize + this.padding.vertical);
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.mustMeasureTextWidth) {
                this.mustMeasureTextWidth = false;

                this._textWidth = context.measureText(this.text).width;
            }

            if (this.text) {
                context.fillStyle = this.textColor;
                context.textAlign = "left";
                context.font = `${this.textSize}px ${this.fontFamily}`;

                context.fillText(this.text, this.x + this.padding.left, this.y + this.padding.top);
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
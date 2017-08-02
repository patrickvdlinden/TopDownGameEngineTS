module UI {
    class CharacterWidthItem {
        public characterWidth: number = 0;
        public totalWidth: number = 0;
    }

    export class TextBox extends Control {
        private _placeholder: string = null;
        private _placeholderTextColor: string = "gray";
        private characterWidths: Array<CharacterWidthItem> = [];
        private textMeasureContext: CanvasRenderingContext2D = null;
        private textCursorBlinker: boolean = false;
        private textCursorBlinkerInterval: number;
        private _textCursorIndex = 0;
        private textCursorPosition: Rectangle;

        public constructor() {
            super();
        }

        public get placeholder(): string {
            return this._placeholder;
        }
        
        public set placeholder(placeholder: string) {
            this._placeholder = placeholder;
        }

        public get placeholderTextColor(): string {
            return this._placeholderTextColor;
        }
        
        public set placeholderTextColor(color: string) {
            this._placeholderTextColor = color;
        }

        private get textCursorIndex(): number {
            return this._textCursorIndex;
        }

        private set textCursorIndex(index: number) {
            this._textCursorIndex = Math.max(0, index);

            if (this.text !== null && this.text.length > 0) {
                this._textCursorIndex = Math.min(this.text.length, this._textCursorIndex);
            }

            this.calculateCursorPosition();
        }

        protected onInitialize(): void {
            this.bounds = this.bounds.update(this.x, this.y, 250, 25);
            this.textSize = 12;
            this.fontFamily = "Courier New";
            this.textColor = "black";
            this.textBaseline = TextBaselines.Top;
            this.textCursorPosition = new Rectangle();
            this.padding = new Padding(5, 7);
        }

        protected onUpdate(lastUpdateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (!this.textMeasureContext) {
                this.textMeasureContext = context;
            }

            context.fillStyle = "white";
            context.fillRect(this.x, this.y, this.width, this.height);

            context.strokeStyle = this.isFocused ? "red" : "black";
            context.lineWidth = 1;
            context.strokeRect(this.x, this.y, this.width, this.height);

            if (this.text !== null && this.text.length > 0) {
                this.drawText(context, this.text, this.textColor);
            } else if (this.placeholder !== null && this.placeholder.length > 0) {
                this.drawText(context, this.placeholder, this.placeholderTextColor);
            }
        }

        protected drawText(context: CanvasRenderingContext2D, text: string, color: string): void {
            context.textBaseline = this.textBaseline;
            context.textAlign = "left";
            context.fillStyle = color;
            context.font = `${this.textSize}px ${this.fontFamily}`;

            context.fillText(text, this.x + this.padding.left, this.y + this.padding.top);

            if (this.isFocused && this.textCursorBlinker) {
                context.strokeStyle = "grey";
                context.lineWidth = 1;
                context.strokeRect(this.x + this.padding.left + this.textCursorPosition.left, this.y + this.padding.top, 0, this.textSize);
            }
        }

        protected onTextChanged(oldText: string, newText: string): void {
            this.calculateTextWidth();
        }

        protected onKeyDown(key: Input.Keys, keyboardState: Input.KeyboardState): void {
            super.onKeyDown(key, keyboardState);

            switch (key) {
                case Input.Keys.Left:
                    this.textCursorIndex--;
                    return;

                case Input.Keys.Right:
                    this.textCursorIndex++;
                    return;

                case Input.Keys.Delete:
                    this.text = this.text.slice(0, this.textCursorIndex) + this.text.slice(this.textCursorIndex + 1, this.text.length);
                    return;

                case Input.Keys.Backspace:
                    this.textCursorIndex--;

                    if (this.textCursorIndex === 0) {
                        this.text = this.text.slice(1, this.text.length);
                    } else {
                        this.text = this.text.slice(0, this.textCursorIndex) + this.text.slice(this.textCursorIndex + 1, this.text.length);
                    }
                    this.calculateTextWidth();
                    return;
            }

            //if (key >= 65 && key <= 90) {
                var char = keyboardState.toChar(key);

                // TODO: insert at cursor position
                this.text = (this.text || "") + char;
                this.textCursorIndex++;
            //}
        }

        protected onKeyUp(key: Input.Keys, keyboardState: Input.KeyboardState): void {
            super.onKeyUp(key, keyboardState);            
        }

        protected onFocus(): void {
            super.onFocus();

            this.textCursorBlinker = true;
            this.textCursorIndex = this.characterWidths.length;
            this.calculateCursorPosition();

            this.textCursorBlinkerInterval = setInterval(() => {
                this.textCursorBlinker = !this.textCursorBlinker;
            }, 500);
        }

        protected onBlur(): void {
            super.onBlur();
            
            this.textCursorBlinker = false;
            clearInterval(this.textCursorBlinkerInterval);
        }

        protected calculateTextWidth() {
             if (this.text === null || this.text.length === 0 || this.textMeasureContext === null) {
                 return;
             }

            this.textMeasureContext.font = `${this.textSize}px ${this.fontFamily}`;

            this.characterWidths = [];
            let totalWidth = 0;
            for (let i = 0; i < this.text.length; i++) {
                // Is this performance heavy ??? If it is, only use serif fonts with
                // equal character widths (then only one character has to be measured).
                var item = new CharacterWidthItem();
                item.characterWidth = this.textMeasureContext.measureText(this.text[i]).width;
                item.totalWidth = (totalWidth += item.characterWidth);
                this.characterWidths.push(item);
            }

            this.calculateCursorPosition();
        }
        
        protected calculateCursorPosition() {
            if (this.text === null || this.text.length === 0) {
                this.textCursorPosition = this.textCursorPosition.update(0, 0);
                return;
            }

            if (this.textCursorIndex === 0) {
                this.textCursorPosition = this.textCursorPosition.update(0, 0);
                return;
            }

            if (this.textCursorIndex === this.text.length) {
                this.textCursorPosition = this.textCursorPosition.update(this.characterWidths[this.textCursorIndex - 1].totalWidth, 0);
                return;
            }
            
            this.textCursorPosition = this.textCursorPosition.update(this.characterWidths[this.textCursorIndex - 1].totalWidth, 0);
        }
    }
}
module UI {
    class CharacterWidthItem {
        public characterWidth: number = 0;
        public totalWidth: number = 0;
    }

    export class TextBox extends Control {
        private _placeholder: string = null;
        private _placeholderFontFamily: string = "'Segoe UI', Arial, sans-serif";
        private _placeholderTextSize: number = 14;
        private _placeholderTextColor: string = "gray";
        private characterWidths: Array<CharacterWidthItem> = [];
        private textMeasureContext: CanvasRenderingContext2D = null;
        private textCursorBlinker: boolean = false;
        private textCursorBlinkerInterval: number;
        private _textCursorIndex = 0;
        private textCursorPosition: Rectangle;

        public constructor() {
            super();

            this._bounds = new Rectangle(this.x, this.y, 250, 25);
            this.backgroundColor = Colors.white;
            this.textSize = 12;
            this.fontFamily = "Courier New";
            this.textColor = Colors.black;
            this.textBaseline = TextBaselines.Bottom;
            this.textCursorPosition = new Rectangle();
            this.padding = new Padding(5, 7);
        }

        public get placeholder(): string {
            return this._placeholder;
        }
        
        public set placeholder(placeholder: string) {
            this._placeholder = placeholder;
        }

        public get placeholderFontFamily(): string {
            return this._placeholderFontFamily;
        }
        
        public set placeholderFontFamily(fontFamily: string) {
            this._placeholderFontFamily = fontFamily;
        }

        public get placeholderTextSize(): number {
            return this._placeholderTextSize;
        }
        
        public set placeholderTextSize(size: number) {
            this._placeholderTextSize = size;
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
        }

        protected onUpdate(updateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (!this.textMeasureContext) {
                this.textMeasureContext = context;
            }

            context.fillStyle = this.backgroundColor;
            context.fillRect(this.viewportX, this.viewportY, this.width, this.height);

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.strokeRect(this.viewportX, this.viewportY, this.width, this.height);

            if (this.text !== null && this.text.length > 0) {
                this.drawText(context, this.text, this.fontFamily, this.textSize, this.textColor);
            } else if (this.placeholder !== null && this.placeholder.length > 0) {
                this.drawText(context, this.placeholder, this.placeholderFontFamily, this.placeholderTextSize, this.placeholderTextColor);
            }
        }

        protected drawText(context: CanvasRenderingContext2D, text: string, fontFamily: string, size: number, color: string): void {
            context.textBaseline = this.textBaseline;
            context.textAlign = "left";
            context.fillStyle = color;
            context.font = `${size}px ${fontFamily}`;
            context.fillText(text, this.viewportX + this.padding.left, this.viewportY + this.height - this.padding.bottom);

            if (this.isFocused && this.textCursorBlinker) {
                context.strokeStyle = "grey";
                context.lineWidth = 1;
                context.strokeRect(
                    this.viewportX + this.padding.left + this.textCursorPosition.left,
                    this.viewportY + this.padding.top,
                    0,
                    this.textSize);
            }
        }

        protected onTextChanged(oldText: string, newText: string): void {
            this.calculateTextWidth();
        }

        protected onKeyDown(key: Input.Keys, keyboardState: Input.KeyboardState): void {
            super.onKeyDown(key, keyboardState);

            var text = (this.text || "");

            switch (key) {
                case Input.Keys.Left:
                    this.textCursorIndex--;
                    return;

                case Input.Keys.Right:
                    this.textCursorIndex++;
                    return;

                case Input.Keys.Delete:
                    this.text = text.slice(0, this.textCursorIndex) + text.slice(this.textCursorIndex + 1, text.length);
                    return;

                case Input.Keys.Backspace:
                    this.textCursorIndex--;

                    if (this.textCursorIndex === 0) {
                        this.text = text.slice(1, text.length);
                    } else {
                        this.text = text.slice(0, this.textCursorIndex) + text.slice(this.textCursorIndex + 1, text.length);
                    }
                    this.calculateTextWidth();
                    return;

                case Input.Keys.Home:
                    this.textCursorIndex = 0;
                    return;

                case Input.Keys.End:
                    this.textCursorIndex = text.length;
                    return;
            }

            var char = keyboardState.toChar(key);
            if (char !== null) {
                if (!this.text) {
                    this.text = char;
                } else {
                    this.text = text.slice(0, this.textCursorIndex) + char + this.text.slice(this.textCursorIndex, text.length);
                }

                this.textCursorIndex++;
            }
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
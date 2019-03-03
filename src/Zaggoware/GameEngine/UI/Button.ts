///<reference path="Control.ts" />

namespace Zaggoware.GameEngine.UI {
    export class Button extends Control {
        private _autoSize = true;
        private _textWidth: number = null;
        private _textLineStyles: TextLineStyles = TextLineStyles.None;
        private _backgroundColorPressed: string = "rgba(0, 0, 100, 1)";
        private _clickSoundEnabled: boolean = true;
        private mustRecalculateSize = true;
        private mustRemeasureTextWidth = true;
        private clickSound: HTMLAudioElement;

        public constructor() {
            super();

            this.cursor = Cursors.Pointer;
            this.textBaseline = TextBaselines.Middle;
            this.textAlign = TextAligns.Center;
        }

        public get autoSize(): boolean {
            return this._autoSize;
        }

        public set autoSize(autoSize: boolean) {
            this._autoSize = autoSize;

            if (autoSize) {
                this.mustRecalculateSize = true;
            } else {
                this.mustRecalculateSize = false;
            }
        }

        public get textWidth(): number {
            return this._textWidth || 0;
        }

        public get textLineStyles(): TextLineStyles {
            return this._textLineStyles;
        }

        public set textLineStyles(textLineStyles: TextLineStyles) {
            this._textLineStyles = textLineStyles;
        }

        public get backgroundColorPressed(): string {
            return this._backgroundColorPressed;
        }

        public set backgroundColorPressed(color: string) {
            this._backgroundColorPressed = color;
        }

        public get clickSoundEnabled(): boolean {
            return this._clickSoundEnabled;
        }

        public set clickSoundEnabled(flag: boolean) {
            this._clickSoundEnabled = flag;
        }

        protected onInitialize(): void {
            this.clickSound = new Audio("Menu Selection Click.wav");
            this.clickSound.volume = IO.UserSettings.instance.audioVolume;
            this.clickSound.load();

            IO.UserSettings.instance.removeSettingChangedHandler(this.onUserSettingChanged);

            if (this.autoSize) {
                this.mustRecalculateSize = true;
                this.mustRemeasureTextWidth = true;
            }
        }

        protected onUnitialize(): void {
            super.onUninitialize();

            IO.UserSettings.instance.addSettingChangedHandler(this.onUserSettingChanged);

            this.clickSound.pause();
            this.clickSound = null;
        }

        protected onUpdate(updateTime: number): void {
            // use the field '_textWidth' as its property 'textWidth' will return 0 as default value.
            if (this.autoSize && this.mustRecalculateSize && this._textWidth !== null) {
                this.mustRecalculateSize = false;

                let width = this.textWidth + this.padding.horizontal;
                let height = this.textSize + this.padding.vertical;
                this.bounds = this.bounds.update(this.x, this.y, width, height);

                // autoSize will get set to false when changing the bounds. Make sure autoSize stays true.
                this._autoSize = true;
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.text !== null && this.text.length > 0) {
                context.font = `${this.textSize}px ${this.fontFamily}`;

                if (this.mustRemeasureTextWidth) {
                    this.mustRemeasureTextWidth = false;

                    this._textWidth = context.measureText(this.text).width;
                }
            }

            switch (this.state) {
                case ControlStates.Hovered:
                    context.fillStyle = this.backgroundColorHover;
                    break;

                case ControlStates.Pressed:
                    context.fillStyle = this.backgroundColorPressed;
                    break;

                case ControlStates.Disabled:
                    break;

                default:
                    context.fillStyle = this.backgroundColor;
                    break;
            }

            context.fillRect(this.viewportX, this.viewportY, this.width, this.height);

            if (this.text !== null && this.text.length > 0) {
                this.drawText(context);
            }
        }

        protected drawText(context: CanvasRenderingContext2D) {
            let offsetY = this.state == ControlStates.Pressed ? 2 : 0;

            context.textBaseline = this.textBaseline;
            context.textAlign = "left";
            context.fillStyle = this.textColor;
            context.font = `${this.textSize}px ${this.fontFamily}`;

            let textX;
            switch (this.textAlign) {
                case TextAligns.Center:
                    textX = this.width / 2;
                    context.textAlign = "center";
                    break;

                case TextAligns.End:
                case TextAligns.Right:
                    textX = this.width - this.textWidth - this.padding.right;
                    break;

                default:
                    textX = this.padding.left;
                    break;
            }

            context.fillText(this.text, this.viewportX + textX, this.viewportY + (this.height / 2) + offsetY);

            if (this._textLineStyles !== TextLineStyles.None) {
                if ((this._textLineStyles & TextLineStyles.Overline) === TextLineStyles.Overline) {
                    context.fillRect(this.viewportX + textX, this.viewportY + (this.height / 2) - (this.textSize / 2) + offsetY - 1, this.textWidth, 1);
                }

                if ((this._textLineStyles & TextLineStyles.Underline) === TextLineStyles.Underline) {
                    context.fillRect(this.viewportX + textX, this.viewportY + (this.height / 2) + (this.textSize / 2) + offsetY, this.textWidth, 1);
                }

                if ((this._textLineStyles & TextLineStyles.Strikethrough) === TextLineStyles.Strikethrough) {
                    context.fillRect(this.viewportX + textX, this.viewportY + (this.height / 2) + offsetY + 1, this.textWidth, 1);
                }
            }
        }

        protected onBoundsChanged(oldBounds: Rectangle, newBounds: Rectangle): void {
            super.onBoundsChanged(oldBounds, newBounds)

            if (oldBounds.width !== newBounds.width || oldBounds.height !== newBounds.height) {
                this.autoSize = false;
                this.mustRecalculateSize = false;
            }
        }

        protected onPaddingChanged(oldPadding: Padding, newPadding: Padding): void {
            super.onPaddingChanged(oldPadding, newPadding);

            if (this.autoSize) {
                this.mustRecalculateSize = true;
            }
        }

        protected onTextChanged(oldText: string, newText: string): void {
            super.onTextChanged(oldText, newText);

            if (this.autoSize) {
                this.mustRecalculateSize = true;
            }

            this.mustRemeasureTextWidth = true;
        }

        protected onMouseDown(mouseState: Input.MouseState): void {
            super.onMouseDown(mouseState);

            if (this.clickSoundEnabled) {
                this.clickSound.volume = IO.UserSettings.instance.audioVolume;
                this.clickSound.play();
            }
        }

        private onUserSettingChanged = (name: string, value: any) => {
            if (name !== "audioVolume") {
                return;
            }

            this.clickSound.volume = <number>value;
        }
    }
}
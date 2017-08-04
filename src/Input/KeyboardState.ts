module Input {
    export class KeyboardState {        
        private keysPressed: { [keyCode: number]: Keys };
        private _isShiftKeyPressed: boolean = false;
        private _isControlKeyPressed: boolean = false;
        private _isAltKeyPressed: boolean = false;

        public constructor(keysPressed: { [keyCode: number]: Keys }, isShiftKeyPressed: boolean, isControlKeyPressed: boolean, isAltKeyPressed: boolean) {
            this.keysPressed = keysPressed;
            this._isShiftKeyPressed = isShiftKeyPressed;
            this._isControlKeyPressed = isControlKeyPressed;
            this._isAltKeyPressed = isAltKeyPressed;
        }

        public get isShiftKeyPressed(): boolean {
            return this._isShiftKeyPressed;
        }
        
        public get isControlKeyPressed(): boolean {
            return this._isShiftKeyPressed;
        }
        
        public get isAltKeyPressed(): boolean {
            return this._isShiftKeyPressed;
        }

        public isKeyDown(key: Keys): boolean {
            return typeof this.keysPressed[key] !== "undefined";
        }

        public isKeyUp(key: Keys): boolean {
            return typeof this.keysPressed[key] === "undefined";
        }

        public isDigit(key: Keys): boolean {
            return (key >= Keys.D0 && key <= Keys.D9)
                || (key >= Keys.Num0 && key <= Keys.Num9);
        }

        public isLetter(key: Keys): boolean {
            return (key >= Keys.A && key <= Keys.Z);
        }

        public toChar(key: Keys): string {
            var isDigit = this.isDigit(key);
            var isLetter = this.isLetter(key);

            let char = "";

            if (isDigit || isLetter || key === Keys.Space) {
                char = String.fromCharCode(key).toLowerCase();

                if (this.isShiftKeyPressed) {
                    if (isDigit) {
                        // TODO: every keyboard layout has differenct chars on the Shift-action
                        switch (key) {
                            case Keys.D1:
                                return "!";
                            case Keys.D2:
                                return "@";
                            case Keys.D3:
                                return "#";
                            case Keys.D4:
                                return "$";
                            case Keys.D5:
                                return "%";
                            case Keys.D6:
                                return "^";
                            case Keys.D7:
                                return "&";
                            case Keys.D8:
                                return "*";
                            case Keys.D9:
                                return "(";
                            case Keys.D0:
                                return ")";
                        }
                    }

                    if (isLetter) {
                        return char.toUpperCase();
                    }
                }

                return char;
            }

            return null;
        }
    }
}
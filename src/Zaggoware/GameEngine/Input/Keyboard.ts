namespace Zaggoware.GameEngine.Input {
    export class Keyboard {
        private static container: HTMLElement;
        private static _previousState: KeyboardState;
        private static _currentState: KeyboardState;
        private static keysPressed: { [keyCode: number]: Keys } = {};
        private static isControlKeyPressed = false;
        private static isShiftKeyPressed = false;
        private static isAltKeyPressed = false;
        private static eventManager: EventManager;

        private static specialKeys: Array<Keys>;

        public static hook(container: HTMLElement) {
            this.specialKeys = [
                Keys.F5, Keys.F12, Keys.WinKey, Keys.CommandKey
            ];

            if (Settings.isDebugModeEnabled) {
                this.specialKeys.push(Keys.F5);
            }

            this.container = container;
            this.container.tabIndex = 0;

            this.eventManager = new EventManager(null);
            document.addEventListener("keydown", this.onKeyDown);
            document.addEventListener("keyup", this.onKeyUp);
            container.focus();
        }

        public static unhook() {
            this.container.removeEventListener("keydown", this.onKeyDown);
            this.container.removeEventListener("keyup", this.onKeyUp);
            this.container = null;
        }

        public static get previousState(): KeyboardState {
            return this._previousState;
        }

        public static get currentState(): KeyboardState {
            return this._currentState;
        }

        public static updateState() {
            this._previousState = this._currentState;
            this._currentState = new KeyboardState(
                this.copyObject(this.keysPressed),
                this.isShiftKeyPressed,
                this.isControlKeyPressed,
                this.isAltKeyPressed);
            
            if (!this._previousState) {
                // On the very first update, the previous state will be undefined.
                // To prevent errors, just set it to the current state for this once.
                this._previousState = this._currentState;
            }
        }

        public static addKeyDownHandler(handler: IKeyboardEventHandler): any {
            this.eventManager.registerEventHandler("keydown", handler);
        }

        public static removeKeyDownHandler(handler: IKeyboardEventHandler): any {
            this.eventManager.unregisterEventHandler("keydown", handler);
        }

        public static addKeyUpHandler(handler: IKeyboardEventHandler): any {
            this.eventManager.registerEventHandler("keyup", handler);
        }

        public static removeKeyUpHandler(handler: IKeyboardEventHandler): any {
            this.eventManager.unregisterEventHandler("keyup", handler);
        }

        private static onKeyDown = (ev: KeyboardEvent) => {
            if (Keyboard.specialKeys.indexOf(ev.keyCode) !== -1) {
                return true;
            }

            ev.preventDefault();

            Keyboard.keysPressed[ev.keyCode] = <Keys>ev.keyCode;
            Keyboard.isShiftKeyPressed = ev.shiftKey;
            Keyboard.isControlKeyPressed = ev.ctrlKey;
            Keyboard.isAltKeyPressed = ev.altKey;

            Keyboard.eventManager.triggerEvent(
                "keydown",
                ev.keyCode,
                new KeyboardState(
                    Keyboard.copyObject(Keyboard.keysPressed),
                    Keyboard.isShiftKeyPressed,
                    Keyboard.isControlKeyPressed,
                    Keyboard.isAltKeyPressed));

            return false;
        }

        private static onKeyUp = (ev: KeyboardEvent) => {
            if (Keyboard.specialKeys.indexOf(ev.keyCode) !== -1) {
                return true;
            }

            ev.preventDefault();

            delete Keyboard.keysPressed[ev.keyCode];

            Keyboard.isShiftKeyPressed = ev.shiftKey;
            Keyboard.isControlKeyPressed = ev.ctrlKey;
            Keyboard.isAltKeyPressed = ev.altKey;

            Keyboard.eventManager.triggerEvent(
                "keyup",
                ev.keyCode,
                new KeyboardState(
                    Keyboard.copyObject(Keyboard.keysPressed),
                    Keyboard.isControlKeyPressed,
                    Keyboard.isShiftKeyPressed,
                    Keyboard.isAltKeyPressed));

            return false;
        }

        private static copyObject(obj: any): any {
            var copy: any = {};

            for (let i in obj) {
                if (!obj.hasOwnProperty(i)) {
                    continue;

                }
                // Arrays are still by reference, but we don't use arrays for now.
                if (typeof obj[i] === "object") {
                    copy[i] = Keyboard.copyObject(obj[i]);
                } else {
                    copy[i] = obj[i];
                }
            }

            return copy;
        }
    }
}
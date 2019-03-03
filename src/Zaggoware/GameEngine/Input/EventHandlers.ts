namespace Zaggoware.GameEngine.Input {
    export interface IMouseEventHandler {
        (mouseState: MouseState): void;
    }

    export interface IKeyboardEventHandler {
        (key: Keys, keyboardState: KeyboardState): void;
    }
}
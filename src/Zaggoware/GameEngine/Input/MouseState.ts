namespace Zaggoware.GameEngine.Input {
    export class MouseState {
        private _x: number = -1;
        private _y: number = -1;
        private _leftButtonPressed: boolean = false;
        private _middleButtonPressed: boolean = false;
        private _rightButtonPressed: boolean = false;

        public constructor(x: number, y: number, leftButtonPressed: boolean, middleButtonPressed: boolean, rightButtonPressed: boolean) {
            this._x = x;
            this._y = y;
            this._leftButtonPressed = leftButtonPressed;
            this._middleButtonPressed = middleButtonPressed;
            this._rightButtonPressed = rightButtonPressed;
        }

        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get isLeftButtonPressed(): boolean {
            return this._leftButtonPressed;
        }

        public get isMiddleButtonPressed(): boolean {
            return this._middleButtonPressed;
        }

        public get isRightButtonPressed(): boolean {
            return this._rightButtonPressed;
        }        
    }
}
namespace Zaggoware.GameEngine {
    export class Camera {
        private _x = 0;
        private _y = 0;

        public get x(): number {
            return this._x;
        }

        public set x(x: number) {
            this._x = x || 0;
        }

        public get y(): number {
            return this._y;
        }

        public set y(y: number) {
            this._y = y || 0;
        }
    }
}
namespace Zaggoware.GameEngine.UI {
    export class Padding {
        private _top: number = 0;
        private _right: number = 0;
        private _bottom: number = 0;
        private _left: number = 0;
        private _horizontal: number = 0;
        private _vertical: number = 0;

        public constructor(vertical: number, horizontal: number);
        public constructor(top: number, right: number, bottom: number, left: number);
        public constructor(top: number = -1, right: number = -1, bottom: number = -1, left: number = -1) {
            this._top = Math.max(-1, top);
            this._right = Math.max(-1, right);
            this._bottom = Math.max(-1, bottom) === -1 ? this._top : bottom;
            this._left = Math.max(-1, left) === -1 ? this._right : left;
            this._horizontal = this._right + this._left;
            this._vertical = this._top + this._bottom;
        }

        public get top(): number {
            return this._top;
        }

        public get right(): number {
            return this._right;
        }

        public get bottom(): number {
            return this._bottom;
        }

        public get left(): number {
            return this._left;
        }

        public get horizontal(): number {
            return this._horizontal;
        }

        public get vertical(): number {
            return this._vertical;
        }
    }
}
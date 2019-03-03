/// <reference path="Rectangle.ts" />

namespace Zaggoware.GameEngine {
    export class Viewport extends Rectangle {
        public constructor(private game: GameBase, x: number = null, y: number = null, width: number = null, height: number = null) {
            super(x, y, width, height);
        }
    }
}
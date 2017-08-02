module Entities {
    export class Player extends EntityBase {
        protected onUpdate(lastUpdateTime: any): boolean {
            return true;
        }

        protected onDraw(context: CanvasRenderingContext2D): boolean {
            return true;
        }
    }
}
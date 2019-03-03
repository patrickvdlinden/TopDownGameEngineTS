namespace Zaggoware.GameEngine {
    export interface IDrawable {
        draw(): void;
    }

    export interface IDrawableWithContext {
        draw(context: CanvasRenderingContext2D): void;
    }
}
interface IDrawable {
    draw(): void;
}

interface IDrawableWithContext {
    draw(context: CanvasRenderingContext2D): void;
}
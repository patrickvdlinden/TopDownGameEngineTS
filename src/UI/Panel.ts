module UI {
    export class Panel extends Control {
        public handleInput(updateTime: number): boolean {
            return false;
        }

        protected onInitialize(): void {
        }

        protected onUninitialize(): void {
        }

        protected onUpdate(updateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            context.fillStyle = this.backgroundColor;
            context.fillRect(this.viewportX, this.viewportY, this.width, this.height);
        }
    }
}
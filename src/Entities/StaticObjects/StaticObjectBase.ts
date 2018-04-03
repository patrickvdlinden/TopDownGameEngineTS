module Entities.StaticObjects {
    export abstract class StaticObjectBase implements IInitializable, IDrawableWithContext {
        protected viewport: Viewport;
        protected camera: Camera;
        protected texture: HTMLImageElement;

        private _isInitialized: boolean = false;
        private _textureBounds: Rectangle;
        private _bounds: Rectangle;

        protected constructor(viewport: Viewport, camera: Camera) {
            this.viewport = viewport;
            this.camera = camera;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get textureBounds(): Rectangle {
            return this._textureBounds;
        }

        public set textureBounds(bounds: Rectangle) {
            this._textureBounds = bounds;
        }

        public get bounds(): Rectangle {
            return this._bounds;
        }

        public set bounds(bounds: Rectangle) {
            this._bounds = bounds;
        }

        public get x(): number {
            return this._bounds.x;
        }

        public get y(): number {
            return this._bounds.y;
        }

        protected get viewportX(): number {
            return this.viewport.x + this.x;
        }

        protected get viewportY(): number {
            return this.viewport.y + this.y;
        }

        public get width(): number {
            return this._bounds.width;
        }

        public get height(): number {
            return this._bounds.height;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("Object was already initialized.");
            }

            this.onInitialize();

            this._isInitialized = true;
        }

        public uninitialize(): void {
            this.onUninitialize();
        }

        public draw(context: CanvasRenderingContext2D): void {
            if (!this.texture) {
                return;
            }

            context.drawImage(
                this.texture,
                this._textureBounds.x,
                this._textureBounds.y,
                this._textureBounds.width,
                this._textureBounds.height,
                this.viewportX - this.camera.x,
                this.viewportY + this.height - this.textureBounds.height - this.camera.y,
                this.textureBounds.width,
                this.textureBounds.height);
        }

        protected abstract onInitialize(): void;
        protected abstract onUninitialize(): void;
        protected abstract onDraw(context: CanvasRenderingContext2D): void;
    }
}
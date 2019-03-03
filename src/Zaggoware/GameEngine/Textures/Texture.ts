namespace Zaggoware.GameEngine.Textures {
    export class Texture implements IInitializable, IDrawableWithContext {
        private _textureFilePath: string;
        private _image: HTMLImageElement;
        private _isInitialized: boolean = false;
        private _isLoaded: boolean = false;

        public constructor(texturePath?: string) {
            this.textureFilePath = texturePath || null;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get isLoaded(): boolean {
            return this._textureFilePath && this._isInitialized && this._isLoaded;
        }

        public get textureFilePath(): string {
            return this._textureFilePath;
        }

        public set textureFilePath(filePath: string) {
            this._textureFilePath = filePath || null;

            if (filePath && this._isInitialized) {
                this._image.src = this.textureFilePath;
            }
        }

        protected get image(): HTMLImageElement {
            return this._image;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("Texture has already been initialized.");
            }

            this._isLoaded = false;
            this._image = new Image();
            this._image.addEventListener("load", this.onImageLoaded);
            this._image.src = this.textureFilePath;
            this._isInitialized = true;
        }

        public uninitialize(): void {
            if (this._isInitialized) {
                this._image.remove();
                this._image = null;
            }
        }

        public draw(context: CanvasRenderingContext2D): void;
        public draw(context: CanvasRenderingContext2D, source?: Rectangle, destination?: Rectangle): void;
        public draw(context: CanvasRenderingContext2D, source?: any, destination?: any): void {
            //console.log("isLoaded:", this.isLoaded, "isInitialized:", this.isInitialized, "textureFilePath:", this.textureFilePath);
            if (!this.isLoaded) {
                return;
            }

            if (typeof source === "undefined" || source === null) {
                source = new Rectangle(0, 0, this.image.width, this.image.height);
            } else {
                if (source.width < 0) {
                    source = source.update(source.x, source.y, this.image.width, source.height);
                }

                if (source.height < 0) {
                    source = source.update(source.x, source.y, source.width, this.image.height);
                }
            }

            if (typeof destination === "undefined" || destination === null) {
                destination = new Rectangle(0, 0, this.image.width, this.image.height);
            } else {
                if (destination.width < 0) {
                    destination = destination.update(destination.x, destination.y, this.image.width, destination.height);
                }

                if (destination.height < 0) {
                    destination = destination.update(destination.x, destination.y, destination.width, this.image.height);
                }
            }

            this.onDraw(context, source, destination);
        }

        protected onImageLoaded = (): void => {
            this._isLoaded = true;
        }

        protected onDraw(context: CanvasRenderingContext2D, source: Rectangle, destination: Rectangle): void {
            context.drawImage(
                this._image,
                source.x,
                source.y,
                source.width,
                source.height,
                destination.x,
                destination.y,
                destination.width,
                destination.height);
        }
    }
}
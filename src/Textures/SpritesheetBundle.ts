module Textures {
    export class SpritesheetBundle implements IInitializable, IUpdatable {
        private _name: string;
        private _spritesheets: HTMLImageElement[] = [];
        private _textureFilePaths: string[] = [];
        private _sprites: SpriteDictionary;

        public constructor(name: string) {
            this._name = name;
            this._sprites = new SpriteDictionary();
        }

        // TODO: Idea: Draw all spritesheets on separate canvas and then
        // convert the canvas to a new image?

        public get name(): string {
            return this._name;
        }

        public get spritesheets(): HTMLImageElement[] {
            return this._spritesheets.slice();
        }

        public get textureFilePaths(): string[] {
            return this._textureFilePaths || [];
        }

        public set textureFilePaths(paths: string[]) {
            this._textureFilePaths = paths;
        }

        public get sprites(): SpriteDictionary {
            return this._sprites;
        }

        public initialize(): void {
            this._spritesheets = [];

            for (let i = 0; i < this.textureFilePaths.length; i++) {
                const image = new Image();
                image.src = this._textureFilePaths[i];
                this._spritesheets.push(image);
            }
        }

        public uninitialize(): void {
            this._spritesheets = [];
            this._textureFilePaths = [];
            this._sprites = undefined;
        }

        public update(updateTime: number): void {
            if (!this._sprites) {
                return;
            }

            for (let i = 0; i < this._sprites.count; i++) {
                let sprite = this._sprites.getAt(i);
                if (sprite.animationMap.length <= 1) {
                    continue;
                }

                sprite.update(updateTime);
            }
        }

        public draw(context: CanvasRenderingContext2D, spriteName: string, destX: number, destY: number): void {
            const sprite = this._sprites.get(spriteName);
            if (!sprite || !this._spritesheets || !this._spritesheets.length) {
                return;
            }

            const textureBounds = sprite.currentTextureBounds;

            for (let i = 0; i < this.textureFilePaths.length; i++) {
                context.drawImage(
                    this._spritesheets[i],
                    textureBounds.x,
                    textureBounds.y,
                    textureBounds.width,
                    textureBounds.height,
                    Math.round(destX),
                    Math.round(destY),
                    textureBounds.width,
                    textureBounds.height);
            }
        }
    }
}
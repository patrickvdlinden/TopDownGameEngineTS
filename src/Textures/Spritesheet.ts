module Textures {
    export class Spritesheet implements IInitializable, IUpdatable {
        private _name: string;
        private _spritesheet: HTMLImageElement;
        private _textureFilePath: string;
        private _shadow: HTMLImageElement;
        private _sprites: SpriteDictionary;

        public constructor(name: string, textureFilePath: string) {
            this._name = name;
            this._textureFilePath = textureFilePath;
            this._sprites = new SpriteDictionary();
        }

        public get name(): string {
            return this._name;
        }

        public get spritesheet(): HTMLImageElement {
            return this._spritesheet;
        }

        public get textureFilePath(): string {
            return this._textureFilePath;
        }

        public get sprites(): SpriteDictionary {
            return this._sprites;
        }

        public initialize(): void {
            this._spritesheet = new Image();
            this._spritesheet.src = this._textureFilePath;
        }

        public uninitialize(): void {
        }

        public update(updateTime: number): void {
            if (!this._sprites) {
                return;
            }

            for (let i=0; i<this._sprites.count; i++) {
                let sprite = this._sprites.getAt(i);
                if (sprite.animationMap.length <= 1) {
                    continue;
                }

                sprite.update(updateTime);
            }
        }

        public draw(context: CanvasRenderingContext2D, spriteName: string, destX: number, destY: number): void {
            const sprite = this._sprites.get(spriteName);
            if (!sprite || !this._spritesheet) {
                return;
            }

            const textureBounds = sprite.currentTextureBounds;
            context.drawImage(
                this._spritesheet,
                textureBounds.x,
                textureBounds.y,
                textureBounds.width,
                textureBounds.height,
                destX,
                destY,
                textureBounds.width,
                textureBounds.height);
        }
    }
}
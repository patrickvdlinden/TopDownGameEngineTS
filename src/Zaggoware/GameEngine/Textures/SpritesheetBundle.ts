namespace Zaggoware.GameEngine.Textures {
    export class SpritesheetBundle implements IInitializable, IUpdatable {
        private _name: string;
        private _isInitialized: boolean = false;
        private _textures: Texture[] = [];
        private _stateManager: SpritesheetStateManager;

        public constructor(name: string) {
            this._name = name;
            this._stateManager = new SpritesheetStateManager();
        } 

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        // TODO: Idea: Draw all spritesheets on a separate canvas and then
        // convert the canvas to a new image?

        public get name(): string {
            return this._name;
        }

        public get textures(): Texture[] {
            return this._textures || [];
        }

        public set textures(textures: Texture[]) {
            this._textures = textures;

            this.invalidate();
        }

        public get stateManager(): SpritesheetStateManager {
            return this._stateManager;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("This spritesheet bundle has already been initialized.");
            }

            for (let i = 0; i < this.textures.length; i++) {
                if (!this.textures[i].isInitialized) {
                    this.textures[i].initialize();
                }
            }

            this._isInitialized = true;
        }

        public invalidate(): void {
            if (!this._isInitialized) {
                throw new Error("This spritesheet bundle must be initialized before invalidation can occur.");
            }

            if (!this._textures) {
                return;
            }

            for (let i = 0; i < this.textures.length; i++) {
                if (!this.textures[i].isInitialized) {
                    this.textures[i].initialize();
                }
            }
        }

        public uninitialize(): void {
            this._textures = [];
            this._stateManager = undefined;
        }

        public update(updateTime: number): void {
            if (!this._stateManager) {
                return;
            }

            for (let i = 0; i < this._stateManager.count; i++) {
                let sprite = this._stateManager.getAt(i);
                if (sprite.animationMap.length <= 1) {
                    continue;
                }

                sprite.update(updateTime);
            }
        }

        public draw(context: CanvasRenderingContext2D, spriteName: string, destX: number, destY: number): void {
            const sprite = this._stateManager.get(spriteName);
            if (!sprite || !this._textures || !this._textures.length) {
                return;
            }

            const textureBounds = sprite.currentTextureBounds;

            for (let i = 0; i < this.textures.length; i++) {
                const source = new Rectangle(
                    textureBounds.x,
                    textureBounds.y,
                    textureBounds.width,
                    textureBounds.height);
                
                const destination = new Rectangle(
                    Math.round(destX),
                    Math.round(destY),
                    textureBounds.width,
                    textureBounds.height);

                this._textures[i].draw(context, source, destination);
            }
        }
    }
}
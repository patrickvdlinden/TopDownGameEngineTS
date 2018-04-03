module Entities {
    export class Character implements IInitializable, IUpdatable, IDrawableWithContext {
        private static baseTexture: Textures.Texture;

        protected viewport: Viewport;
        protected camera: Camera;

        private _isInitialized: boolean = false;
        private _name: string;
        private _bounds: Rectangle;
        private _state: CharacterStates = CharacterStates.Standing;
        private _map: Environment.IMap;
        private _energy: number;
        private _energyDrainSpeed: number;
        private _faceDirection: FaceDirections = FaceDirections.Down;
        private _walkSpeed: number = 0.1;
        private _runSpeed: number = 0.15;
        private _shadow: Textures.Texture;
        private _spritesheetStateManager: Textures.SpritesheetStateManager;
        private _cosmetics: CharacterCosmetics;

        public constructor(name: string, viewport: Viewport, camera: Camera) {
            this._name = name;
            this.viewport = viewport;
            this.camera = camera;
            this._bounds = new Rectangle(0, 0, 28, 16);
            this._spritesheetStateManager = new Textures.SpritesheetStateManager();
            this._cosmetics = new CharacterCosmetics();
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get name(): string {
            return this._name;
        }

        public get x(): number {
            return this._bounds.x;
        }

        public set x(x: number) {
            this._bounds = this._bounds.update(x, this.y, this.width, this.height);
        }

        public get y(): number {
            return this._bounds.y;
        }

        public set y(y: number) {
            this._bounds = this._bounds.update(this.x, y, this.width, this.height);
        }

        public get width(): number {
            return this._bounds.width;
        }

        public set width(width: number) {
            this._bounds = this._bounds.update(this.x, this.y, width, this.height);
        }

        public get height(): number {
            return this._bounds.height;
        }

        public set height(height: number) {
            this._bounds = this._bounds.update(this.x, this.y, this.width, height);
        }

        public get state(): CharacterStates {
            return this._state;
        }

        public set state(state: CharacterStates) {
            this._state = state;
        }

        public get map(): Environment.IMap {
            return this._map;
        }

        public set map(map: Environment.IMap) {
            this._map = map;
        }

        public get energy(): number {
            return this._energy;
        }

        public get enegeryDrainSpeed(): number {
            return this._energyDrainSpeed
        }

        public get faceDirection(): FaceDirections {
            return this._faceDirection || FaceDirections.Down;
        }

        public set faceDirection(faceDirection: FaceDirections) {
            this._faceDirection = faceDirection;
        }

        public get walkSpeed(): number {
            return this._walkSpeed;
        }

        public set walkSpeed(speed: number) {
            this._walkSpeed = speed;
        }

        public get runSpeed(): number {
            return this._runSpeed;
        }

        public set runSpeed(speed: number) {
            this._runSpeed = speed;
        }

        public get shadow(): Textures.Texture {
            return this._shadow;
        }

        public set shadow(texture: Textures.Texture) {
            this._shadow = texture;
        }

        public get cosmetics(): CharacterCosmetics {
            return this._cosmetics;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("Character '" + this.name + "' has already been initialized.");
            }

            if (!this._shadow) {
                this._shadow = new Textures.Texture("Resources/Textures/Entities/CharacterShadow.png");
            }

            // TODO: Remove hardcoded mappings: load from json file.
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Standing + FaceDirections.Down, [new Rectangle(32, 0, 32, 32)]));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Standing + FaceDirections.Left, [new Rectangle(32, 32, 32, 32)]));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Standing + FaceDirections.Up, [new Rectangle(32, 96, 32, 32)]));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Standing + FaceDirections.Right, [new Rectangle(32, 64, 32, 32)]));

            const walkInterval = 1000 * this.walkSpeed;
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Walking + FaceDirections.Down, [new Rectangle(0, 0, 32, 32), new Rectangle(32, 0, 32, 32), new Rectangle(64, 0, 32, 32), new Rectangle(32, 0, 32, 32)], walkInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Walking + FaceDirections.Left, [new Rectangle(0, 32, 32, 32), new Rectangle(32, 32, 32, 32), new Rectangle(64, 32, 32, 32), new Rectangle(32, 32, 32, 32)], walkInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Walking + FaceDirections.Up, [new Rectangle(0, 96, 32, 32), new Rectangle(32, 96, 32, 32), new Rectangle(64, 96, 32, 32), new Rectangle(32, 96, 32, 32)], walkInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Walking + FaceDirections.Right, [new Rectangle(0, 64, 32, 32), new Rectangle(32, 64, 32, 32), new Rectangle(64, 64, 32, 32), new Rectangle(32, 64, 32, 32)], walkInterval));

            const runInterval = walkInterval * (this.walkSpeed / this.runSpeed);
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Running + FaceDirections.Down, [new Rectangle(0, 0, 32, 32), new Rectangle(32, 0, 32, 32), new Rectangle(64, 0, 32, 32), new Rectangle(32, 0, 32, 32)], runInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Running + FaceDirections.Left, [new Rectangle(0, 32, 32, 32), new Rectangle(32, 32, 32, 32), new Rectangle(64, 32, 32, 32), new Rectangle(32, 32, 32, 32)], runInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Running + FaceDirections.Up, [new Rectangle(0, 96, 32, 32), new Rectangle(32, 96, 32, 32), new Rectangle(64, 96, 32, 32), new Rectangle(32, 96, 32, 32)], runInterval));
            this._spritesheetStateManager.add(new Textures.SpriteState(CharacterStates.Running + FaceDirections.Right, [new Rectangle(0, 64, 32, 32), new Rectangle(32, 64, 32, 32), new Rectangle(64, 64, 32, 32), new Rectangle(32, 64, 32, 32)], runInterval));

            if (!Character.baseTexture) {
                Character.baseTexture = new Textures.Texture("Resources/Textures/Entities/Base.png");
                Character.baseTexture.initialize();
            }

            if (!this._shadow.isInitialized) {
                this._shadow.initialize();
            }

            this._isInitialized = true;
        }

        public uninitialize(): void {
        }

        public isFacingTo(faceDirection: FaceDirections): boolean {
            return (this.faceDirection & faceDirection) === faceDirection;
        }

        /*
         * Tries to move the character in the given `direction` or to the current `faceDirection` if `direction` is null.
         * Returns false when movement is interrupted.
        */
        public move(updateTime: number, isRunning: boolean): boolean {
            let newX = this.x;
            let newY = this.y;
            let speedX = (isRunning ? this.runSpeed : this.walkSpeed) * updateTime;
            let speedY = (isRunning ? this.runSpeed : this.walkSpeed) * updateTime;

            this.state = isRunning ? CharacterStates.Running : CharacterStates.Walking;

            let isHorizontal = false;
            let isVertical = false;
            let tilePositions = [];

            // TODO: Always use last pressed move-key to indicate direction.
            switch (true) {
                case this.isFacingTo(FaceDirections.Down):
                    newY += speedY;
                    isVertical = true;
                    tilePositions.push([this.x - (this.width / 2), newY - (this.height / 2)], [this.x + (this.width / 2), newY + (this.height / 2)]);
                    break;

                case this.isFacingTo(FaceDirections.Left):
                    newX -= speedX;
                    isHorizontal = true;
                    tilePositions.push([newX - (this.width / 2), this.y - (this.height / 2)], [newX - (this.width / 2), this.y + (this.height / 2)]);
                    break;

                case this.isFacingTo(FaceDirections.Up):
                    newY -= speedY;
                    isVertical = true;
                    tilePositions.push([this.x - (this.width / 2), newY - (this.height / 2)], [this.x + (this.width / 2), newY + (this.height / 2)]);
                    break;

                case this.isFacingTo(FaceDirections.Right):
                    newX += speedX;
                    isHorizontal = true;
                    tilePositions.push([newX + (this.width / 2), this.y - (this.height / 2)], [newX + (this.width / 2), this.y + (this.height / 2)]);
                    break;
            }

            for (let t = 0; t < tilePositions.length; t++) {
                let tile = this.getTileAtXY(tilePositions[t][0], tilePositions[t][1]);
                if (!tile || !tile.passable) {
                    newX = isHorizontal ? this.x : newX;
                    newY = isVertical ? this.y : newY;
                    break;
                }
            }

            this.x = newX;
            this.y = newY;

            return true;
        }

        public update(updateTime: number): void {
            if (this._spritesheetStateManager) {
                this._spritesheetStateManager.update(updateTime);
            }
        }

        public draw(context: CanvasRenderingContext2D): void {
            context.save();

            if (Settings.isDebugModeEnabled) {
                context.fillStyle = "red";
                context.fillRect(
                    this.viewport.x + this.x - (this.width / 2) - this.camera.x,
                    this.viewport.y + this.y - (this.height / 2) - this.camera.y,
                    this.width,
                    this.height);
                
                context.fillStyle = "yellow";
                context.fillRect(
                    this.viewport.x + this.x - 1 - this.camera.x,
                    this.viewport.y + this.y - 1 - this.camera.y,
                    3,
                    3);
            }

            if (this._shadow) {
                this._shadow.draw(
                    context,
                    null,
                    new Rectangle(
                        this.viewport.x + this.x - (this.width / 2) - this.camera.x,
                        this.viewport.y + this.y - 32 - this.camera.y,
                        -1,
                        -1));
            }
            
            this.onDrawSprite(context);

            context.restore();
        }

        protected onDrawSprite(context: CanvasRenderingContext2D): void {
            if (!this._spritesheetStateManager || !this._spritesheetStateManager.contains(this.state + this.faceDirection)) {
                return;
            }

            let sprite = this._spritesheetStateManager.get(this.state + this.faceDirection);

            const destination = new Rectangle(
                Math.round(this.viewport.x + this.x - (sprite.currentTextureBounds.width / 2) - this.camera.x),
                Math.round(this.viewport.y + this.y - sprite.currentTextureBounds.height - this.camera.y),
                sprite.currentTextureBounds.width,
                sprite.currentTextureBounds.height);
            
            Character.baseTexture.draw(context, sprite.currentTextureBounds, destination);
            
            this.drawCosmeticsItem(context, this.cosmetics.legsAndFeet, this.cosmetics.legsAndFeetTexture, sprite, destination);
            this.drawCosmeticsItem(context, this.cosmetics.bodyAndArms, this.cosmetics.bodyAndArmsTexture, sprite, destination);
            this.drawCosmeticsItem(context, this.cosmetics.headAndHair, this.cosmetics.headAndHairTexture, sprite, destination);
            this.drawCosmeticsItem(context, this.cosmetics.hat, this.cosmetics.hatsTetxure, sprite, destination);
        }

        private drawCosmeticsItem(context: CanvasRenderingContext2D, item: CharacterCosmeticsItem, texture: Textures.Texture, sprite: Textures.SpriteState, destination: Rectangle): void {
            if (!item) {
                return;
            }

            const source = sprite.currentTextureBounds.update(
                sprite.currentTextureBounds.x + item.textureOffsetX,
                sprite.currentTextureBounds.y + item.textureOffsetY,
                sprite.currentTextureBounds.width,
                sprite.currentTextureBounds.height);

            texture.draw(context, source, destination);
        }

        private getTileAtXY(x: number, y: number): Environment.ITile {
            var chunkX = Math.floor(x / (this.map.chunkSize * this.map.tileSize)),
                chunkY = Math.floor(y / (this.map.chunkSize * this.map.tileSize));

            var tileX = Math.floor(x / this.map.tileSize) - (chunkX * this.map.chunkSize),
                tileY = Math.floor(y / this.map.tileSize) - (chunkY * this.map.chunkSize);
            
            return this.map.chunks[chunkY] && this.map.chunks[chunkY][chunkX] && this.map.chunks[chunkY][chunkX].tiles[tileY] && this.map.chunks[chunkY][chunkX].tiles[tileY][tileX]
                ? this.map.chunks[chunkY][chunkX].tiles[tileY][tileX]
                : null;
        }
    }
}
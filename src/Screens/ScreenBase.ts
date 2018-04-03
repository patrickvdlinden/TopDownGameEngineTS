module Screens {
    export abstract class ScreenBase implements IGameComponent, IInitializable, IUpdatable, IDrawable {
        protected uiLayerElement: HTMLCanvasElement;
        protected uiLayer: CanvasRenderingContext2D;

        private _game: Game;
        private _name: string;
        private _state: ScreenStates = ScreenStates.Visible;
        private _controlManager: UI.ControlManager;
        private _dialogManager: UI.DialogManager;
        private _manager: ScreenManager;
        private _isInitialized = false;
        private _backgroundColor: string = "transparent";
        private _backgroundImage: HTMLImageElement = null;
        private _backgroundImageFillStyle: BackgroundImageFillStyles = BackgroundImageFillStyles.Stretch;
        private backgroundImageBounds: Rectangle;

        public constructor(game: Game, name: string) {
            if (!name || !name.length) {
                throw new Error("Name is required.");
            }

            this._game = game;
            this._name = name;
        }

        public get game(): Game {
            return this._game;
        }

        public get name(): string {
            return this._name;
        }

        public set name(name: string) {
            this._name = name;
        }

        public get state(): ScreenStates {
            return this._state;
        }

        public set state(state: ScreenStates) {
            this._state = state;
        }

        public get controlManager(): UI.ControlManager {
            return this._controlManager;
        }

        public get manager(): ScreenManager {
            return this._manager;
        }

        public set manager(manager: ScreenManager) {
            this._manager = manager;
        }

        public get viewport(): Viewport {
            return this.game.viewport;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get backgroundColor(): string {
            return this._backgroundColor;
        }

        public set backgroundColor(color: string) {
            this._backgroundColor = color;
        }

        public get backgroundImage(): HTMLImageElement {
            return this._backgroundImage;
        }

        public set backgroundImage(image: HTMLImageElement) {
            this._backgroundImage = image;
            this.backgroundImageBounds = new Rectangle(0, 0, 0, 0);

            if (image !== null) {
                this.calculateBackgroundImageBounds();
            }
        }

        public get backgroundImageFillStyle(): BackgroundImageFillStyles {
            return this._backgroundImageFillStyle;
        }

        public set backgroundImageFillStyle(fillStyle: BackgroundImageFillStyles) {
            this._backgroundImageFillStyle = fillStyle;
            this.calculateBackgroundImageBounds();
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("Screen is already initialized.");
            }

            if (Settings.isDebugModeEnabled) {
                console.log("initialize screen:", this.name);
            }

            this.uiLayerElement = <HTMLCanvasElement>document.getElementById("UILayer");
            if (!this.uiLayerElement) {
                this.uiLayerElement = document.createElement("canvas");
                this.uiLayerElement.id = "UILayer";
                this.uiLayerElement.width = Settings.screenWidth;
                this.uiLayerElement.height = Settings.screenHeight;
                this.uiLayerElement.style.position = "absolute";
                this.uiLayerElement.style.zIndex = "100";
                this.game.container.appendChild(this.uiLayerElement);
            }
            this.setupUILayer();
            this.uiLayer = this.uiLayerElement.getContext("2d");

            this._controlManager = new UI.ControlManager(this.game, this.uiLayer);
            this._controlManager.initialize();

            this._dialogManager = new UI.DialogManager(this.game, this.uiLayer);
            this._dialogManager.initialize();

            this.onInitialize();
            this._isInitialized = true;
        }

        public uninitialize(): void {
            if (!this._isInitialized) {
                throw new Error("Screen is not yet initialized.");
            }

            if (Settings.isDebugModeEnabled) {
                console.log("uninitialize screen:", this.name);
            }

            // Make sure to clear the viewport before unloading.
            this.uiLayer.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);

            this.onUninitialize();

            if (this._controlManager.isInitialized) {
                this._controlManager.uninitialize();
            }

            if (this._dialogManager.isInitialized) {
                this._dialogManager.uninitialize();
            }

            this._controlManager = null;
            this._dialogManager = null;
            this._isInitialized = false;

            this.uiLayer = null;
            this.uiLayerElement = null;
        }

        public update(updateTime: number): void {
            if (this._dialogManager.hasActiveDialog) {
                this.updateDialogManager(updateTime);
            } else {
                this.updateControlManager(updateTime);
            }

            this.onUpdate(updateTime);
        }

        public draw(): void {
            this.uiLayer.save();
            this.uiLayer.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);

            if (this.backgroundColor && this.backgroundColor !== "transparent") {
                this.uiLayer.fillStyle = this.backgroundColor;
                this.uiLayer.fillRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            }

            if (this.backgroundImage) {
                this.drawBackgroundImage(this.uiLayer);
            }

            this.onDraw(this.uiLayer);
            this.uiLayer.restore();

            this.drawControlManager(this.uiLayer);
        }

        protected abstract onInitialize(): void;
        protected abstract onUninitialize(): void;
        protected abstract onUpdate(updateTime: number): void;
        protected abstract onDraw(context: CanvasRenderingContext2D): void;

        protected drawBackgroundImage(context: CanvasRenderingContext2D): void {
            this.uiLayer.beginPath();
            this.uiLayer.rect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            this.uiLayer.clip();
            
            this.uiLayer.drawImage(
                this.backgroundImage,
                this.viewport.x + this.backgroundImageBounds.x,
                this.viewport.y + this.backgroundImageBounds.y,
                this.backgroundImageBounds.width,
                this.backgroundImageBounds.height);
                // TODO: texture bounds (to support topright, bottomleft, bottomright, etc.)
        }

        protected updateDialogManager(updateTime: number): void {
            this._dialogManager.update(updateTime);
        }

        protected updateControlManager(updateTime: number): void {
            this._controlManager.update(updateTime);
        }

        protected drawControlManager(context: CanvasRenderingContext2D): void {
            this._controlManager.draw(context);
        }

        protected setupUILayer(): void {
            this.uiLayerElement.width = Settings.screenWidth;
            this.uiLayerElement.height = Settings.screenHeight;
        }

        private calculateBackgroundImageBounds() {
            if (this._backgroundImage === null) {
                return;
            }

            const image = this.backgroundImage;
            let imageX = 0;
            let imageY = 0;
            let imageWidth = image.width;
            let imageHeight = image.height;

            const aspectRatio = image.width / image.height;
            const scaleX = this.viewport.width / image.width;
            const scaleY = this.viewport.height / image.height;

            switch (this._backgroundImageFillStyle) {
                case BackgroundImageFillStyles.Stretch:
                    imageX = this.viewport.x;
                    imageY = this.viewport.y;
                    imageWidth = this.viewport.width;
                    imageHeight = this.viewport.height;
                    break;

                case BackgroundImageFillStyles.TopRight:
                    break;

                case BackgroundImageFillStyles.BottomLeft:
                    break;

                case BackgroundImageFillStyles.BottomRight:
                    break;

                case BackgroundImageFillStyles.Center:
                    imageX = (this.viewport.width - image.width) / 2;
                    imageY = (this.viewport.height - image.height) / 2;
                    imageWidth = image.width;
                    imageHeight = image.height;
                    break;

                case BackgroundImageFillStyles.CenterCrop:
                case BackgroundImageFillStyles.CenterFit:
                    imageX = 0;
                    imageY = 0;
                    imageWidth = 0;
                    imageHeight = 0;

                    if (image.width <= this.viewport.width) {
                        imageX = (this.viewport.width - image.width) / 2;
                    }

                    if (image.height <= this.viewport.height) {
                        imageY = (this.viewport.height - image.height) / 2;
                    }

                    if (this._backgroundImageFillStyle === BackgroundImageFillStyles.CenterCrop) {
                        const smallestWidth = image.width * scaleX;
                        const smallestHeight = image.height * scaleY;

                        if (smallestHeight * aspectRatio >= smallestWidth) {
                            imageWidth = smallestHeight * aspectRatio;
                            imageHeight = smallestHeight;
                            imageX = (this.viewport.width - imageWidth) / 2;
                        }

                        if (smallestWidth / aspectRatio >= smallestHeight) {
                            imageWidth = smallestWidth;
                            imageHeight = smallestWidth / aspectRatio;
                            imageY = (this.viewport.height - imageHeight) / 2;
                        }
                    } else {
                        const largestWidth = image.width * scaleX;
                        const largestHeight = image.height * scaleY;

                        if  (largestHeight * aspectRatio >= largestWidth) {
                            imageWidth = largestWidth;
                            imageHeight = imageWidth / aspectRatio;
                            imageY = (this.viewport.height - imageHeight) / 2;
                        }
                        
                        if (largestWidth / aspectRatio >= largestHeight) {
                            imageHeight = largestHeight;
                            imageWidth = imageHeight * aspectRatio;
                            imageX = (this.viewport.width - imageWidth) / 2;
                        }
                    }
                    break;
            }

            this.backgroundImageBounds = new Rectangle(imageX, imageY, imageWidth, imageHeight);
        }
    }
}
/// <reference path="IInitializable.ts" />
/// <reference path="IUpdatable.ts" />
/// <reference path="IDrawable.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="EventManager.ts" />
/// <reference path="CommandManager.ts" />
/// <reference path="Screens/ScreenManager.ts" />
/// <reference path="IO/SaveManager.ts" />

namespace Zaggoware.GameEngine {
    import ScreenManager = Screens.ScreenManager;
    import SaveManager = IO.SaveManager;

    export abstract class GameBase implements IInitializable {
        protected eventManager: EventManager;
        protected uiLayerElement: HTMLCanvasElement;
        protected updateInterval: number;
        protected updateEstimatedFpsInterval: number;
        protected updateTime: number = 10;
        protected lastUpdateTime: number = performance.now();
        protected drawInterval: number;

        private _container: HTMLElement;
        private _isInitialized: boolean = false;
        private _viewport: Viewport;
        private _screenManager: ScreenManager;
        private _commandManager: CommandManager;
        private _saveManager: SaveManager;
        private _directFps = 0;
        private _estimatedFps = 0;
        private _isStarted: boolean = false;

        public constructor(container: HTMLElement) {
            this._container = container;
            this._screenManager = new ScreenManager(this, this._container);
            this.eventManager = new EventManager(this);
            this._commandManager = new CommandManager(this);
            this._saveManager = new SaveManager();
        }

        public get container(): HTMLElement {
            return this._container;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public get viewport(): Viewport {
            return this._viewport;
        }

        public get screenManager(): Screens.ScreenManager {
            return this._screenManager;
        }

        public get saveManager(): IO.SaveManager {
            return this._saveManager;
        }

        public get isStarted(): boolean {
            return this._isStarted;
        }

        public initialize() {
            if (this.isInitialized) {
                throw new Error("Game is already initialized.");
            }

            // Make sure the children are at least relative to its container.
            var containerPositionStyle = window.getComputedStyle(this.container).position;
            if (containerPositionStyle !== "absolute" && containerPositionStyle !== "fixed") {
                this.container.style.position = "relative";
            }

            const resolution = IO.UserSettings.instance.resolution;
            Settings.changeScreenResolution(this._container, resolution.width, resolution.height);
            this._viewport = new Viewport(this, 0, 0, Settings.screenWidth, Settings.screenHeight);

            window.onresize = this.onWindowResize;

            Input.Mouse.hook(this.container, this.viewport);
            Input.Keyboard.hook(this.container);

            this.screenManager.initialize();
            this.onInitialize();

            this.setIsInitialized(true);
        }
        
        public uninitialize(): void {
            if (!this.isInitialized) {
                return;
            }

            window.onresize = null;

            Input.Mouse.unhook();
            Input.Keyboard.unhook();

            this.screenManager.uninitialize();
            this.onUninitialize();

            this.setIsInitialized(false);
        }

        public start() {
            if (this.isStarted) {
                throw new Error("Game is already started.");
            }

            if (!this.isInitialized) {
                this.initialize();
            }

            this.onStart();

            this.uiLayerElement = <HTMLCanvasElement>document.getElementById("UILayer");
            if (!this.uiLayerElement) {
                if (Settings.isDebugModeEnabled) {
                    console.log("Creating canvas 'UILayer'.");
                }

                this.uiLayerElement = document.createElement("canvas");
                this.uiLayerElement.width = this.viewport.width;
                this.uiLayerElement.height = this.viewport.height;
                this.uiLayerElement.id = "UILayer";
                this.container.appendChild(this.uiLayerElement);
            }

            this.updateInterval = setInterval(this.onUpdate, this.updateTime);
            this.updateEstimatedFpsInterval = setInterval(this.onUpdateEstimatedFps, 1000);
            this.drawInterval = setInterval(() => {
                window.requestAnimationFrame(this.onDraw);
            }, 0);

            this.setIsStarted(true);
        }

        public stop() {
            if (!this.isStarted) {
                throw new Error("Game is not started.");
            }

            this.onStop();
            this.uninitialize();

            clearInterval(this.updateInterval);
            this.updateInterval = undefined;

            clearInterval(this.updateEstimatedFpsInterval);
            this.updateEstimatedFpsInterval = undefined;

            clearInterval(this.drawInterval);
            this.drawInterval = undefined;

            this.setIsStarted(false);
        }

        public addInitializeHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("initialize", handler);

            return this;
        }

        public addUninitializeHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("uninitialize", handler);

            return this;
        }

        public addStartHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("start", handler);

            return this;
        }

        public addStopHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("stop", handler);

            return this;
        }

        protected setIsInitialized(flag: boolean) {
            this._isInitialized = flag;
        }

        protected setIsStarted(flag: boolean) {
            this._isStarted = flag;
        }

        protected onInitialize() {
            this.eventManager.triggerEvent("initialize");
        }

        protected onUninitialize() {
            this.eventManager.triggerEvent("uninitialize");
        }

        protected onWindowResize = (ev: UIEvent) => {
            if (Settings.isDebugModeEnabled) {
                console.log("onWindowResize");
            }
        }

        protected onStart() {
            this.eventManager.triggerEvent("start");
        }
        
        protected onStop() {
            this.eventManager.triggerEvent("stop");
        }

        protected onUpdate = () => {
            Input.Mouse.updateState();
            Input.Keyboard.updateState();

            const now = performance.now();
            const updateTime = now - this.lastUpdateTime;

            this._directFps = Math.round(1000 / updateTime);
        
            this._screenManager.update(updateTime);

            this.lastUpdateTime = performance.now();
        }

        protected onUpdateEstimatedFps = () => {
            this._estimatedFps = this._directFps;
        }

        protected onDraw = () => {
            let context: CanvasRenderingContext2D = null;

            if (this.uiLayerElement) {
                context = this.uiLayerElement.getContext("2d");
                context.clearRect(0, 0, this.uiLayerElement.clientWidth, this.uiLayerElement.clientHeight);
            }

            // TODO: dictate MainLayer in Game.ts and pass context to all screens.
            this._screenManager.draw();

            if (context !== null) {
                context.save();
                context.font = "10px Arial";
                context.fillStyle = "#000000";
                context.fillText(this._estimatedFps.toString(), this.viewport.x + 11, this.viewport.bottom - 14);
                context.fillStyle = "#FFFF00";
                context.fillText(this._estimatedFps.toString(), this.viewport.x + 10, this.viewport.bottom - 15);
                context.restore();

                context.strokeStyle = "#AA0000";
                context.strokeRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            }
        }
    
    }
}
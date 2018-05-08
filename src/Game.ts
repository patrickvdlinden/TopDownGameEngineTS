class Game {
    protected eventManager: EventManager;
    protected isInitialized = false;

    protected updateInterval: number;
    protected updateEstimatedFpsInterval: number;
    protected updateTime: number = 10;
    protected lastUpdateTime: number = performance.now();
    protected drawInterval: number;

    private _container: HTMLElement;
    private _viewport: Viewport;
    private _screenManager: Screens.ScreenManager;
    private _commandManager: CommandManager;
    private _saveManager: IO.SaveManager;

    private uiLayerElement: HTMLCanvasElement;
    private _directFps = 0;
    private _estimatedFps = 0;

    public constructor(container: HTMLElement) {
        this._container = container;
        this._screenManager = new Screens.ScreenManager(this, this._container);
        this.eventManager = new EventManager(this);
        this._commandManager = new CommandManager(this);
        this._saveManager = new IO.SaveManager();
    }

    public get container(): HTMLElement {
        return this._container;
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

    public initialize() {
        if (this.isInitialized) {
            throw new Error("Game is already initialized.");
        }

        if (Settings.isDebugModeEnabled) {
            console.log("Creating canvas 'MainLayer'.");
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

        this.isInitialized = true;
    }

    public start() {
        if (!this.isInitialized) {
            throw new Error("Game must be initialized first.");
        }

        this.onStart();

        this.uiLayerElement = <HTMLCanvasElement>document.getElementById("UILayer");

        this.updateInterval = setInterval(this.onUpdate, this.updateTime);
        this.updateEstimatedFpsInterval = setInterval(this.onUpdateEstimatedFps, 1000);
        this.drawInterval = setInterval(this.onDraw, 0);
    }

    public addInitializeHandler(handler: IEventHandler): this {
        this.eventManager.registerEventHandler("initialize", handler);

        return this;
    }

    public addStartHandler(handler: IEventHandler): this {
        this.eventManager.registerEventHandler("start", handler);

        return this;
    }

    protected onInitialize() {
        this.eventManager.triggerEvent("initialize");
    }

    protected onWindowResize = (ev: UIEvent) => {
        if (Settings.isDebugModeEnabled) {
            console.log("onWindowResize");
        }
    }

    protected onStart() {
        this.eventManager.triggerEvent("start");
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
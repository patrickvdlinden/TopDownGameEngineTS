class Game {
    protected eventManager: EventManager;
    protected isInitialized = false;

    protected updateInterval: number;
    protected updateTime: number = 10;
    protected drawInterval: number;

    protected lastUpdateTime: number = 0;

    private _container: HTMLElement;
    private _viewport: Viewport;
    private _screenManager: Screens.ScreenManager;

    public constructor(container: HTMLElement) {
        this._container = container;
        this._screenManager = new Screens.ScreenManager(this, this._container);
        this.eventManager = new EventManager(this);
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

        Settings.changeScreenResolution(this._container.offsetWidth, this._container.offsetHeight);
        this._viewport = new Viewport(this, 0, 0, Settings.screenWidth, Settings.screenHeight);

        window.onresize = this.onWindowResize;  

        Input.Mouse.hook(this.container);
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

        this.updateInterval = setInterval(this.onUpdate, this.updateTime);
        this.drawInterval = setInterval(this.onDraw);
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

        this._screenManager.update(this.lastUpdateTime);
    }

    protected onDraw = () => {
        this._screenManager.draw();
    }
}
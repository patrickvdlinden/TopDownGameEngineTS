module Screens {
    export abstract class ScreenBase implements IGameComponent, IUpdatable, IDrawable {
        private static screenCount = 0;

        protected mainLayerElement: HTMLCanvasElement;
        protected mainLayer: CanvasRenderingContext2D;

        private _game: Game;
        private _name: string;
        private _title: string;
        private _state: ScreenStates;
        private _controlManager: UI.ControlManager;
        private _manager: ScreenManager;            
        private _viewport: Viewport;
        private _isInitialized = false;

        public constructor(game: Game, name: string);
        public constructor(game: Game, name: string, title: string);
        public constructor(game: Game, name: string = null, title: string = null) {
            if (!name || !name.length) {
                throw new Error("Name is required.");
            }

            this._game = game;
            this._name = name;
            this._title = title || name;
            this._state = ScreenStates.Hidden;
            this._viewport = game.viewport;

            ScreenBase.screenCount++;
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

        public get title(): string {
            return this._title;
        }

        public set title(title: string) {
            this._title = title;
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
            return this._viewport;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("Screen is already initialized.");
            }

            this.mainLayerElement = document.createElement("canvas");
            this.mainLayerElement.id = "MainLayer";
            this.mainLayerElement.width = Settings.screenWidth;
            this.mainLayerElement.height = Settings.screenHeight;
            this.mainLayerElement.style.position = "absolute";
            this.mainLayerElement.style.zIndex = "100";
            this.game.container.appendChild(this.mainLayerElement);
            this.setupMainLayer();

            this.mainLayer = this.mainLayerElement.getContext("2d");
            
            this.onInitialize();
            this._controlManager = new UI.ControlManager(this.game, this.mainLayer);
            
            this._isInitialized = true;
        }

        public update(lastUpdateTime: number): void {
            this._controlManager.update(lastUpdateTime);

            this.onUpdate(lastUpdateTime);
        }

        public draw(): void {            
            this.onDraw(this.mainLayer);
        }

        protected abstract onInitialize(): void;
        protected abstract onUpdate(lastUpdateTime: number): void;
        protected abstract onDraw(context: CanvasRenderingContext2D): void;

        protected setupMainLayer() {
            this.mainLayerElement.width = Settings.screenWidth;
            this.mainLayerElement.height = Settings.screenHeight;
        }
    }
}
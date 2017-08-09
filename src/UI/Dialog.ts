module UI {
    export class Dialog implements IGameComponent, IInitializable, IUpdatable, IDrawableWithContext {
        protected mainLayerElement: HTMLCanvasElement;
        protected mainLayer: CanvasRenderingContext2D;

        private _manager: DialogManager;
        private _controlManager: ControlManager;
        private _isInitialized: boolean = false;

        public constructor(private _game: Game) {
        }

        public get game(): Game {
            return this._game;
        }
        
        public get manager(): DialogManager {
            return this._manager;
        }

        public set manager(manager: DialogManager) {
            this._manager = manager;
        }
        
        public get controlManager(): ControlManager {
            return this._controlManager;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public initialize(): void {
            this.mainLayerElement = <HTMLCanvasElement>document.getElementById("MainLayer");
            if (!this.mainLayerElement) {
                this.mainLayerElement = document.createElement("canvas");
                this.mainLayerElement.width = this._game.viewport.width;
                this.mainLayerElement.height = this._game.viewport.height;
                this.mainLayerElement.style.position = "absolute";
                this.mainLayerElement.style.zIndex = "100";
            }

            this.mainLayer = this.mainLayerElement.getContext("2d");

            this._controlManager = new ControlManager(this.game, this.mainLayer);
        }

        public uninitialize(): void {
        }

        public update(lastUpdateTime: number): void {
        }

        public draw(context: CanvasRenderingContext2D): void {
        }
    }
}
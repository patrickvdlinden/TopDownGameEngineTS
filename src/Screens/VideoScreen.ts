module Screens {
    export class VideoScreen extends ScreenBase {
        private _isLoaded: boolean = false;
        private _isPlaying: boolean = false;
        private _isPaused: boolean = false;

        private videoElement: HTMLVideoElement;
        private eventManager: EventManager;

        public constructor(game: Game) {
            super(game, "VideoScreen");
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        public get isPaused(): boolean {
            return this._isPlaying;
        }

        public load<T = never>(url: string): IPromise<T> {
            if (!this.isInitialized) {
                throw new Error("VideoScreen must be initialized first.");
            }

            this.stop();

            this._isLoaded = false;
            this._isPaused = false;

            return new SimplePromise((fulfill: (value?: T) => void, reject: (reason?: any) => void) => {
                setTimeout(() => {
                    this.videoElement = document.createElement("video");
                    this.videoElement.id = Settings.elementIdPrefix + "Video";
                    this.videoElement.width = 0;
                    this.videoElement.height = 0;
                    this.videoElement.autoplay = false;
                    this.videoElement.addEventListener("loadeddata", () => {
                        this._isLoaded = true;
                        fulfill();
                    });
                    this.videoElement.addEventListener("error", (e: ErrorEvent) => {
                        reject(e.error);
                    });
                    this.videoElement.addEventListener("ended", () => {
                        this.onEnded();
                        this.onStop();
                    });
                    this.videoElement.src = url;
                    this.videoElement.style.position = "absolute";
                    this.videoElement.style.zIndex = "0";
                    this.videoElement.style.display = "none";
                    this.game.container.appendChild(this.videoElement);
                    this.videoElement.load();
                });
            });
        }

        public play() {
            if (!this.isInitialized) {
                throw new Error("VideoScreen must be initialized first.");
            }

            if (!this.isLoaded) {
                throw new Error("Video must be loaded first.");
            }

            if (this._isPlaying && this.isPaused) {
                this._isPaused = false;
                this.onResume();
            } else {
                this._isPlaying = true;
                this.onStart();
            }

            this.videoElement.play();
        }

        public pause() {
            this._isPaused = true;
            this.videoElement.pause();

            this.onPause();
        }

        public stop() {
            if (!this.isPlaying) {
                return;
            }

            this._isPlaying = false;
            this.videoElement.pause();
            this.videoElement.remove();
            this._isLoaded = false;

            this.onStop();
        }

        public addLoadedEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("load", handler);

            return this;
        }

        public addStartEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("start", handler);

            return this;
        }

        public addResumeEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("resume", handler);

            return this;
        }

        public addPauseEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("pause", handler);

            return this;
        }

        public addStopEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("stop", handler);

            return this;
        }

        public addEndedEventHandler(handler: IEventHandler): this {
            this.eventManager.registerEventHandler("ended", handler);

            return this;
        }

        protected onInitialize(): void {
            if (this.isInitialized) {
                throw new Error("VideoScreen is already initialized.");
            }

            this.eventManager = new EventManager(this);
        }

        protected onUninitialize(): void {
            this.stop();
            this.eventManager = null;
        }

        protected onLoaded(): void {
            this.eventManager.triggerEvent("loaded");
        }

        protected onStart(): void {
            this.eventManager.triggerEvent("start");
        }

        protected onResume(): void {
            this.eventManager.triggerEvent("resume");
        }

        protected onPause(): void {
            this.eventManager.triggerEvent("pause");
        }

        protected onStop(): void {
            this.eventManager.triggerEvent("stop");
        }

        protected onEnded(): void {
            this.eventManager.triggerEvent("ended");
        }

        protected onUpdate(updateTime: number): void {
            if (Input.Keyboard.previousState.isKeyUp(Input.Keys.Escape) &&
                Input.Keyboard.currentState.isKeyDown(Input.Keys.Escape)) {
                this.stop();
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this._isPlaying) {
                context.drawImage(this.videoElement, this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            } else {
                context.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            }
        }

    }
}
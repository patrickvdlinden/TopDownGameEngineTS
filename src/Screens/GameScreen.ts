///<reference path="ScreenBase.ts" />

module Screens {
    export class GameScreen extends ScreenBase {
        protected backgroundLayerElement: HTMLCanvasElement;
        protected groundLayerElement: HTMLCanvasElement;
        protected objectEntityLayerElement: HTMLCanvasElement;
        protected itemLayerElement: HTMLCanvasElement;
        protected uiLayerElement: HTMLCanvasElement;

        protected backgroundLayer: CanvasRenderingContext2D;
        protected groundLayer: CanvasRenderingContext2D;
        protected objectEntityLayer: CanvasRenderingContext2D;
        protected itemLayer: CanvasRenderingContext2D;
        protected uiLayer: CanvasRenderingContext2D;

        private _camera: Camera;
        private _map: Environment.IMap;
        private backgroundMusic: HTMLAudioElement;
        private videoScreen: VideoScreen;

        private _isPaused: boolean = false;
        private _isStarted: boolean = false;

        private map: Environment.IMap;
        private tilesetImages: { [tilesetName: string]: HTMLImageElement } = {};
        private chunksInRangeStartX: number = 0;
        private chunksInRangeStartY: number = 0;
        private chunksInRangeEndX: number = 0;
        private chunksInRangeEndY: number = 0;

        private animationUpdateTime: number = 0;
        private tileAnimationIndice: { [tileName: string]: number } = {};

        public constructor(game: Game) {
            super(game, "GameScreen");
        }

        public get camera(): Camera {
            return this._camera;
        }

        public get isPaused(): boolean {
            return this._isPaused;
        }

        public get isStarted(): boolean {
            return this._isStarted;
        }

        public get isVideoPlaying(): boolean {
            if (!this.videoScreen) {
                return false;
            }

            return this.videoScreen.state === ScreenStates.Visible;
        }

        protected onInitialize() {
            this.backgroundLayerElement = this.createCanvasElement("BackgroundLayer", Settings.screenWidth, Settings.screenHeight, 10);
            this.groundLayerElement = this.createCanvasElement("GroundLayer", Settings.screenWidth, Settings.screenHeight, 20);
            this.objectEntityLayerElement = this.createCanvasElement("ObjectEntityLayer", Settings.screenWidth, Settings.screenHeight, 30);
            this.itemLayerElement = this.createCanvasElement("ItemLayer", Settings.screenWidth, Settings.screenHeight, 40);

            this.backgroundLayer = this.backgroundLayerElement.getContext("2d");
            this.groundLayer = this.groundLayerElement.getContext("2d");
            this.objectEntityLayer = this.objectEntityLayerElement.getContext("2d");
            this.itemLayer = this.itemLayerElement.getContext("2d");

            this._camera = new Camera();

            // draw background once.
            this.drawBackgroundLayer(this.backgroundLayer);

            var loadingScreen = new LoadingScreen(this.game);
            loadingScreen.runTasksParallel = false;
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(0, "Loading map...");

                Environment.MapLoader.load("map").then((map: Environment.IMap) => {
                    reporter.reportCompleted();

                    this.map = map;
                });
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(25, "Loading tilesets...");

                let totalCount  = 0;
                let tilesetsLoaded = 0;

                for (let i in this.map.tilesets) {
                    if (!this.map.tilesets.hasOwnProperty(i)) {
                        continue;
                    }
                    totalCount++;
                }

                for (let i in this.map.tilesets) {
                    if (!this.map.tilesets.hasOwnProperty(i)) {
                        continue;
                    }

                    let tilesetImage = new Image();
                    tilesetImage.addEventListener("load", () => {
                        tilesetsLoaded++;

                        if (tilesetsLoaded >= totalCount) {
                            reporter.reportCompleted();
                        }
                    });
                    tilesetImage.addEventListener("error", (error: ErrorEvent) => {
                        reporter.reportError(error);
                    });
                    tilesetImage.src = this.map.tilesets[i].textureFilePath;

                    this.tilesetImages[i] = tilesetImage;
                }
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(30, "Loading background music (Grasslands Theme.mp3)...");

                this.backgroundMusic = new Audio("Grasslands Theme.mp3");
                this.backgroundMusic.volume = .5;
                this.backgroundMusic.loop = true;
                this.backgroundMusic.addEventListener("loadeddata", () => {
                    reporter.reportProgress(50, "Done loading background music.");
                    reporter.reportCompleted();
                });
                this.backgroundMusic.addEventListener("error", (e: ErrorEvent) => {
                    reporter.reportError(e.error);
                });
                this.backgroundMusic.load();
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(60, "Loading intro video (OnePieceOpening.mp4)...");

                this.videoScreen = new VideoScreen(this.game);
                this.manager.add(this.videoScreen);
                this.videoScreen.load("OnePieceOpening.mp4").then(() => {
                    reporter.reportProgress(80, "Done loading intro video.");
                    reporter.reportCompleted();
                }, (error) => {
                    reporter.reportError(error);
                });
                this.state = ScreenStates.Frozen | ScreenStates.Hidden;
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(90, "Loading UI...");

                this.initializeUI();

                reporter.reportProgress(100, "Done.");
                reporter.reportCompleted();
            });
            loadingScreen.runInBackground().then(
                () => {
                    this.state = ScreenStates.Visible;
                    this.manager.remove(loadingScreen);

                    this.videoScreen.play();
                    this.videoScreen.addStopEventHandler(() => {
                        this._isStarted = true;
                        this._isPaused = false;
                        this.videoScreen.state = ScreenStates.Frozen | ScreenStates.Hidden;
                        this.backgroundMusic.play();
                    });
                },
                (e) => {
                    alert("An error occured while loading the game. Returning back to Main Menu.");
                    console.error(e);

                    this.manager.add(new MainMenuScreen(this.game));
                    this.manager.remove(this);
                });

            this.manager.add(loadingScreen);
            this.state = ScreenStates.Hidden | ScreenStates.Frozen;
        }

        protected initializeUI() {
            if (Settings.isDebugModeEnabled) {
                console.log("initialize UI");
            }
        }

        protected createCanvasElement(name: string, width: number, height: number, zIndex: number): HTMLCanvasElement {
            var canvasElement = document.createElement("canvas");
            canvasElement.id = name;
            canvasElement.width = width;
            canvasElement.height = height;
            canvasElement.style.position = "absolute";
            canvasElement.style.zIndex = zIndex.toString();

            this.game.container.appendChild(canvasElement);

            return canvasElement;
        }

        protected onUninitialize(): void {
            this.manager.remove(this.videoScreen);
            this.videoScreen = null;

            this.backgroundMusic.pause();
            this.backgroundMusic.remove();
            this.backgroundMusic = null;
        }

        protected onUpdate(updateTime: number) {
            if (this.isStarted && !this.isVideoPlaying
                && Input.Keyboard.previousState.isKeyUp(Input.Keys.Escape)
                && Input.Keyboard.currentState.isKeyDown(Input.Keys.Escape)) {
                this.manager.add(new MainMenuScreen(this.game));
                this.manager.remove(this);
            }

            if (!this.map) {
                return;
            }

            if (this.isStarted && !this.isPaused) {
                this.animationUpdateTime += updateTime;

                if (this.animationUpdateTime >= Number.MAX_VALUE - updateTime) {
                    // Make sure the game can't crash when the max value is reached.
                    // This will, however, force the animated indice to 0.
                    // TODO: Find a better solution to depend on index values.
                    this.animationUpdateTime = (Number.MAX_VALUE - this.animationUpdateTime) + updateTime;
                }

                for (let tilesetName in this.map.tilesets) {
                    if (!this.map.tilesets.hasOwnProperty(tilesetName)) {
                        continue;
                    }

                    let tileset = this.map.tilesets[tilesetName];

                    for (let i = 0; i < tileset.animatedTiles.length; i++) {
                        let tileName = tileset.animatedTiles[i];
                        let tile = <Environment.IAnimatedTileDescriptor>tileset.tiles[tileName];
                        if (!tile) {
                            continue;
                        }

                        this.tileAnimationIndice[tile.name] = Math.floor(this.animationUpdateTime / (tile.interval || 100)) % tile.animation.length;

                        if (this.tileAnimationIndice[tile.name] >= tile.animation.length) {
                            this.tileAnimationIndice[tile.name] = 0;
                        }

                        console.log("animation index: ", this.tileAnimationIndice[tile.name]);
                    }
                }
            }
        }

        protected onDraw() {
            if (!this.isInitialized) {
                return;
            }
            
            this.drawGroundLayer(this.groundLayer);
            this.drawObjectEntitiesLayer(this.objectEntityLayer);
            this.drawItemLayer(this.itemLayer);
            this.drawUILayer(this.mainLayer);
        }

        protected updateControlManager(updateTime: number): void {
            if (this.isStarted && !this.isVideoPlaying) {
                this.controlManager.update(updateTime);
            }
        }

        protected drawControlManager(context: CanvasRenderingContext2D): void {
            if (this.isStarted && !this.isVideoPlaying) {
                this.controlManager.draw(context);
            }
        }

        protected drawBackgroundLayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.viewport.width, this.viewport.height);
        }

        protected drawGroundLayer(context: CanvasRenderingContext2D) {
            for (let chunkY = 0; chunkY <= 1; chunkY++) {
                for (let chunkX = 0; chunkX <= 1; chunkX++) {
                    let chunk = this.map.chunks && this.map.chunks[chunkY] && this.map.chunks[chunkY][chunkX]
                        ? this.map.chunks[chunkY][chunkX]
                        : null;
                    if (!chunk) {
                        continue;
                    }

                    let tiles = this.map.chunks[chunkY][chunkX].tiles
                        ? this.map.chunks[chunkY][chunkX].tiles
                        : null;
                    if (tiles === null) {
                        continue;
                    }

                    const tileStartX = chunkX === this.chunksInRangeStartX ? Math.floor((this.camera.x - this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : 0;
                    const tileStartY = chunkY === this.chunksInRangeStartY ? Math.floor((this.camera.y - this.map.tileSize) / this.map.tileSize - (chunkY * this.map.chunkSize)) : 0;
                    const tileEndX = chunkX === this.chunksInRangeEndX ? Math.ceil((this.camera.x + this.viewport.width + this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : this.map.chunkSize;
                    const tileEndY = chunkY === this.chunksInRangeEndY ? Math.ceil((this.camera.y + this.viewport.height + this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : this.map.chunkSize;

                    for (let y = 0; y < 16; y++) {
                        for (let x = 0; x < 16; x++) {
                            if (!tiles[y] || !tiles[y][x]) {
                                continue;
                            }

                            let tile = tiles[y][x];
                            let tileset = this.map.tilesets[tile.tilesetName];
                            let tileDescriptor = tileset.tiles[tile.tileName];
                            let tileIndice = <Environment.ITileTexture>tileDescriptor;
                            if (tileDescriptor.hasOwnProperty("animation")) {
                                let animatedTileDescriptor = (<Environment.IAnimatedTileDescriptor>tileDescriptor);

                                tileIndice = animatedTileDescriptor.animation[this.tileAnimationIndice[tileDescriptor.name] || 0];
                            }// else if (tileIndice.corners) {
                            //     groundLayer.drawImage(
                            //             tilesMap,
                            //             tileIndice.corners[0][1] * map.tileSize,
                            //             tileIndice.corners[0][0] * map.tileSize,
                            //             map.tileSize,
                            //             map.tileSize,
                            //             window.settings.viewPort.x + (chunkX * map.chunkSize * map.tileSize) + (x * map.tileSize) - window.camera.x,
                            //             window.settings.viewPort.y + (chunkY * map.chunkSize * map.tileSize) + (y * map.tileSize) - window.camera.y,
                            //             map.tileSize,
                            //             map.tileSize);

                            //     tileIndice = tileIndice.corners[1];
                            // }

                            context.drawImage(
                                    this.tilesetImages[tile.tilesetName],
                                    tileIndice.textureX * tileset.tileSize,
                                    tileIndice.textureY * tileset.tileSize,
                                    tileset.tileSize,
                                    tileset.tileSize,
                                    this.viewport.x + (chunkX * this.map.chunkSize * this.map.tileSize) + (x * this.map.tileSize) - this.camera.x,
                                    this.viewport.y + (chunkY * this.map.chunkSize * this.map.tileSize) + (y * this.map.tileSize) - this.camera.y,
                                    this.map.tileSize,
                                    this.map.tileSize);
                        }
                    }

                    if (Settings.isDebugModeEnabled) {
                        for (let i = 0; i < chunk.triggers.length; i++) {
                            let trigger = chunk.triggers[i];

                            context.fillStyle = "rgba(100, 100, 255, 0.6)";
                            context.fillRect(trigger.x, trigger.y, trigger.width, trigger.height);

                            context.font = "10px Segoe UI";
                            let labelWidth = context.measureText(trigger.command).width;

                            context.fillStyle = "rgba(0, 0, 0, 0.6)";
                            context.fillRect(trigger.x + ((trigger.width - labelWidth) / 2) - 5, trigger.y + 5, labelWidth + 10, 15);

                            context.fillStyle = "white";
                            context.fillText(trigger.command, trigger.x + ((trigger.width - labelWidth) / 2), trigger.y + 15);
                        }

                        context.lineWidth = 2;
                        context.strokeStyle = "red";
                        context.strokeRect(
                                this.viewport.x + (chunkX * this.map.chunkSize * 32) - this.camera.x,
                                this.viewport.y + (chunkY * this.map.chunkSize * 32) - this.camera.y,
                                this.map.chunkSize * 32,
                                this.map.chunkSize * 32);
                    }
                }
            }
        }

        protected drawObjectEntitiesLayer(context: CanvasRenderingContext2D) {            
        }
        
        protected drawItemLayer(context: CanvasRenderingContext2D) {
        }

        protected drawUILayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, Settings.screenWidth, Settings.screenHeight);

            // if (!this.isVideoPlaying && this.isStarted) {
            //     this.mainLayer.fillStyle = "#FFFFFF";
            //     this.mainLayer.fillText("Left Mouse: " + Input.Mouse.currentState.isLeftButtonPressed, 10, 10);
            //     this.mainLayer.fillText("Middle Mouse: " + Input.Mouse.currentState.isMiddleButtonPressed, 10, 30);
            //     this.mainLayer.fillText("Right Mouse: " + Input.Mouse.currentState.isRightButtonPressed, 10, 50);
            //     this.mainLayer.fillText("Focused control: " + (this.controlManager.focusedControl ? this.controlManager.focusedControl.text : ""), 10, 80);
            // }
        }
    }
}
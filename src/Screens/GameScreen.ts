///<reference path="ScreenBase.ts" />

module Screens {
    export class GameScreen extends ScreenBase {
        protected groundLayerElement: HTMLCanvasElement;
        protected entitiesLayerElement: HTMLCanvasElement;
        protected itemLayerElement: HTMLCanvasElement;
        protected uiLayerElement: HTMLCanvasElement;

        protected groundLayer: CanvasRenderingContext2D;
        protected entitiesLayer: CanvasRenderingContext2D;
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

        private player: Entities.Player;

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

        public static startNewGame(game: Game): GameScreen {
             return new GameScreen(game);
        }

        protected onInitialize() {
            this.groundLayerElement = this.createCanvasElement("GroundLayer", Settings.screenWidth, Settings.screenHeight, 10);
            this.entitiesLayerElement = this.createCanvasElement("EntitiesLayer", Settings.screenWidth, Settings.screenHeight, 20);
            this.uiLayerElement = this.createCanvasElement("UILayer", Settings.screenWidth, Settings.screenHeight, 30);

            this.groundLayer = this.groundLayerElement.getContext("2d");
            this.entitiesLayer = this.entitiesLayerElement.getContext("2d");
            this.uiLayer = this.uiLayerElement.getContext("2d");

            this._camera = new Camera();

            var loadingScreen = new LoadingScreen(this.game);
            loadingScreen.runTasksParallel = false;
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(0, "Loading map...");

                Environment.MapLoader.load("map").then((map: Environment.IMap) => {
                    reporter.reportCompleted();

                    this.map = map;
                    this.map.tilesOccupiedByObject = {};

                    for (let chunkY in this.map.chunks) {
                        this.map.tilesOccupiedByObject[chunkY] = {};

                        for (let chunkX in this.map.chunks[chunkY]) {
                            let chunk = this.map.chunks[chunkY][chunkX];

                            this.map.tilesOccupiedByObject[chunkY][chunkX] = {};

                            for (let objectY in chunk.objects) {
                                for (let objectX in chunk.objects[objectY]) {
                                    let object = chunk.objects[objectY][objectX];
                                    let objectDescriptor = <Environment.IStaticObjectDescriptor>this.map.tilesets[object.tilesetName].objects[object.objectName];

                                    const objY = parseInt(objectY);
                                    const objX = parseInt(objectX);

                                    for (let y = objY; y < objY + objectDescriptor.collisionHeight; y++) {
                                        if (!this.map.tilesOccupiedByObject[chunkY][chunkX][y]) {
                                            this.map.tilesOccupiedByObject[chunkY][chunkX][y] = {};
                                        }

                                        for (let x = objX; x < objX + objectDescriptor.collisionWidth; x++) {
                                            this.map.tilesOccupiedByObject[chunkY][chunkX][y][x] = true;
                                            this.map.chunks[chunkY][chunkX].tiles[y][x].passable = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
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

                // TODO: create seperate task for Entities.
                this.player = new Entities.Player(this.viewport, this.camera);
                //this.player.character = new Entities.Characters.MyCharacter(this.viewport, this.camera);
                //this.player.character.map = this.map;
                //this.player.character.initialize();
                this.player.x = 96;
                this.player.y = 96;
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(30, "Loading background music (Grasslands Theme.mp3)...");

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

            let musicButton = new UI.Button();
            musicButton.text = "Music On";
            musicButton.addClickHandler((m: Input.MouseState) => {
                !this.backgroundMusic.paused ? this.backgroundMusic.pause() : this.backgroundMusic.play();
                musicButton.text = "Music "+ (this.backgroundMusic.paused ? "Off" : "On");
            });
            musicButton.bounds = new Rectangle(this.game.viewport.width - 100, 10);
            this.controlManager.add(musicButton);
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

                // TODO: Find a better solution to update animated tiles from different tilesets.
                // For example, only tilesets that are currently used within the viewport.
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
                    }
                }

                this.chunksInRangeStartX = Math.floor((this.camera.x - this.map.tileSize) / this.map.tileSize / this.map.chunkSize);
                this.chunksInRangeStartY = Math.floor((this.camera.y - this.map.tileSize) / this.map.tileSize / this.map.chunkSize);
                this.chunksInRangeEndX = Math.floor((this.viewport.width + this.camera.x + this.map.tileSize) / this.map.tileSize / this.map.chunkSize);
                this.chunksInRangeEndY = Math.floor((this.viewport.height + this.camera.y + this.map.tileSize) / this.map.tileSize / this.map.chunkSize);

                this.player.update(updateTime);

                this.camera.x = Math.max(0, Math.floor(this.player.x - (this.viewport.width / 2)));
                this.camera.y = Math.max(0, Math.floor(this.player.y - (this.viewport.height / 2)));
            }
        }

        protected onDraw() {
            if (!this.isInitialized) {
                return;
            }

            this.groundLayer.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            this.entitiesLayer.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            this.uiLayer.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);

            let playerDrawn = false;

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

                    let objects = chunk.objects ? chunk.objects : {};

                    const tileStartX = chunkX === this.chunksInRangeStartX ? Math.floor((this.camera.x - this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : 0;
                    const tileStartY = chunkY === this.chunksInRangeStartY ? Math.floor((this.camera.y - this.map.tileSize) / this.map.tileSize - (chunkY * this.map.chunkSize)) : 0;
                    const tileEndX = chunkX === this.chunksInRangeEndX ? Math.ceil((this.camera.x + this.viewport.width + this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : this.map.chunkSize;
                    const tileEndY = chunkY === this.chunksInRangeEndY ? Math.ceil((this.camera.y + this.viewport.height + this.map.tileSize) / this.map.tileSize - (chunkX * this.map.chunkSize)) : this.map.chunkSize;

                    for (let y = tileStartY; y < tileEndY; y++) {
                        for (let x = tileStartX; x < tileEndX; x++) {
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

                            let tileAbsX = (chunkX * this.map.chunkSize * this.map.tileSize) + (x * this.map.tileSize) 
                            let tileAbsY = (chunkY * this.map.chunkSize * this.map.tileSize) + (y * this.map.tileSize)

                            this.groundLayer.drawImage(
                                this.tilesetImages[tile.tilesetName],
                                tileIndice.textureX * tileset.tileSize,
                                tileIndice.textureY * tileset.tileSize,
                                tileset.tileSize,
                                tileset.tileSize,
                                this.viewport.x + tileAbsX - this.camera.x,
                                this.viewport.y + tileAbsY - this.camera.y,
                                this.map.tileSize,
                                this.map.tileSize);
                            
                            if (objects[y] && objects[y][x]) {
                                let object = objects[y][x];
                                let objectset = this.map.tilesets[object.tilesetName];
                                let objectDescriptor = objectset.objects[object.objectName];
                                let objectTexture = <Environment.IObjectTexture>objectDescriptor;

                                if (Settings.isDebugModeEnabled) {
                                    this.entitiesLayer.fillStyle = "red";
                                    this.entitiesLayer.fillRect(
                                        this.viewport.x + tileAbsX - this.camera.x,
                                        this.viewport.y + tileAbsY - this.camera.y,
                                        objectDescriptor.collisionWidth * this.map.tileSize,
                                        objectDescriptor.collisionHeight * this.map.tileSize
                                    );
                                }

                                this.entitiesLayer.drawImage(
                                    this.tilesetImages[object.tilesetName],
                                    objectTexture.textureX * objectset.tileSize,
                                    objectTexture.textureY * objectset.tileSize,
                                    objectTexture.textureWidth * objectset.tileSize,
                                    objectTexture.textureHeight * objectset.tileSize,
                                    this.viewport.x + tileAbsX - this.camera.x,
                                    this.viewport.y + tileAbsY - ((objectTexture.textureHeight - objectDescriptor.collisionHeight) * this.map.tileSize) - this.camera.y,
                                    objectTexture.textureWidth * this.map.tileSize,
                                    objectTexture.textureHeight * this.map.tileSize);
                            }

                            if (!playerDrawn
                                && (this.player.x >= tileAbsX && this.player.x < tileAbsX + this.map.tileSize
                                    && this.player.y >= tileAbsY && this.player.y < tileAbsY + this.map.tileSize)
                                || (this.player.x < tileAbsX - this.map.tileSize && this.player.x + this.map.tileSize >= tileAbsX
                                    && this.player.y < tileAbsY - this.map.tileSize && this.player.y + this.map.tileSize >= tileAbsY)) {
                                
                                this.player.draw(this.entitiesLayer);
                                playerDrawn = true;
                            }
                        }
                    }

                    if (Settings.isDebugModeEnabled) {
                        for (let i = 0; i < chunk.triggers.length; i++) {
                            let trigger = chunk.triggers[i];
                            let triggerX = this.viewport.x + trigger.x - this.camera.x;
                            let triggerY = this.viewport.y + trigger.y - this.camera.y;

                            this.uiLayer.fillStyle = "rgba(100, 100, 255, 0.6)";
                            this.uiLayer.fillRect(triggerX, triggerY, trigger.width, trigger.height);

                            this.uiLayer.font = "10px Segoe UI";
                            let labelWidth = this.uiLayer.measureText(trigger.command).width;

                            this.uiLayer.fillStyle = "rgba(0, 0, 0, 0.6)";
                            this.uiLayer.fillRect(triggerX + ((trigger.width - labelWidth) / 2) - 5, triggerY + 5, labelWidth + 10, 15);

                            this.uiLayer.fillStyle = "white";
                            this.uiLayer.fillText(trigger.command, triggerX + ((trigger.width - labelWidth) / 2), triggerY + 15);
                        }

                        this.uiLayer.lineWidth = 2;
                        this.uiLayer.strokeStyle = "red";
                        this.uiLayer.strokeRect(
                            this.viewport.x + (chunkX * this.map.chunkSize * 32) - this.camera.x,
                            this.viewport.y + (chunkY * this.map.chunkSize * 32) - this.camera.y,
                            this.map.chunkSize * 32,
                            this.map.chunkSize * 32);
                    }
                }
            }

            if (!playerDrawn) {
                this.player.draw(this.entitiesLayer);
            }

            if (Settings.isDebugModeEnabled) {
                this.entitiesLayer.globalAlpha = 0.75;
                this.entitiesLayer.fillStyle = "purple";
                this.entitiesLayer.fillRect(
                    this.viewport.x + this.player.x - 16 - this.camera.x,
                    this.viewport.y + this.player.y - 32 - this.camera.y,
                    32,
                    32);
                this.entitiesLayer.globalAlpha = 1;
            }
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

        protected drawUILayer(context: CanvasRenderingContext2D) {
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
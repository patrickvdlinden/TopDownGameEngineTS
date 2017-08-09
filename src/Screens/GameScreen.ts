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

                Http.Ajax.get("map.php").then((map: Environment.IMap) => {
                    reporter.reportProgress(25, "Done loading map.");
                    reporter.reportCompleted();
                });
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
            console.log("initialize UI");
            let button = new UI.Button();
            let button1 = button;
            button.autoSize = false;
            button.text = "Test 1";
            button.textSize = 12;
            button.textAlign = UI.TextAligns.Center;
            button.textLineStyles = ((UI.TextLineStyles.Underline | UI.TextLineStyles.Overline) | UI.TextLineStyles.Strikethrough);
            button.bounds = button.bounds.update(10, 100, 200, 50);
            //button.backgroundColor = "red";
            this.controlManager.add(button);

            button = new UI.Button();
            button.autoSize = true;
            button.text = "Test 2";
            button.textSize = 12;
            button.textAlign = UI.TextAligns.Center;
            button.textLineStyles = ((UI.TextLineStyles.Underline | UI.TextLineStyles.Overline) | UI.TextLineStyles.Strikethrough);
            button.bounds = button.bounds.update(120, 140);
            //button.backgroundColor = "red";
            button.backgroundColor = "rgba(180, 180, 0, 0.7)";
            this.controlManager.add(button);

            let textBox = new UI.TextBox();
            textBox.placeholder = "Enter your name";
            textBox.textSize = 12;
            textBox.bounds = textBox.bounds.update(500, 300);
            this.controlManager.add(textBox);

            button1.bringToFront();

            let label = new UI.Label();
            label.text = "Enter your name:";
            label.target = textBox;
            label.bounds = label.bounds.update(300, 300);
            this.controlManager.add(label);
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

        protected onUpdate(lastUpdateTime: number) {
            if (this.isStarted && !this.isVideoPlaying
                && Input.Keyboard.previousState.isKeyUp(Input.Keys.Escape)
                && Input.Keyboard.currentState.isKeyDown(Input.Keys.Escape)) {
                this.manager.add(new MainMenuScreen(this.game));
                this.manager.remove(this);
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

        protected updateControlManager(lastUpdateTime: number): void {
            if (this.isStarted && !this.isVideoPlaying) {
                this.controlManager.update(lastUpdateTime);
            }
        }

        protected drawControlManager(context: CanvasRenderingContext2D): void {
            if (this.isStarted && !this.isVideoPlaying) {
                this.controlManager.draw(context);
            }
        }

        protected drawBackgroundLayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.viewport.width, this.viewport.height);

            context.fillStyle = "red";
            context.fillRect(0, 0, this.viewport.width, this.viewport.height);
        }

        protected drawGroundLayer(context: CanvasRenderingContext2D) {
        }

        protected drawObjectEntitiesLayer(context: CanvasRenderingContext2D) {            
        }
        
        protected drawItemLayer(context: CanvasRenderingContext2D) {
        }

        protected drawUILayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, Settings.screenWidth, Settings.screenHeight);

            if (!this.isVideoPlaying && this.isStarted) {
                this.mainLayer.fillStyle = "#FFFFFF";
                this.mainLayer.fillText("Left Mouse: " + Input.Mouse.currentState.isLeftButtonPressed, 10, 10);
                this.mainLayer.fillText("Middle Mouse: " + Input.Mouse.currentState.isMiddleButtonPressed, 10, 30);
                this.mainLayer.fillText("Right Mouse: " + Input.Mouse.currentState.isRightButtonPressed, 10, 50);
                this.mainLayer.fillText("Focused control: " + (this.controlManager.focusedControl ? this.controlManager.focusedControl.text : ""), 10, 80);
            }
        }
    }
}
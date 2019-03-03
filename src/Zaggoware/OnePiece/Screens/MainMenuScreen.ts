namespace Zaggoware.OnePiece.Screens {
    import GameBase = GameEngine.GameBase;
    import Rectangle = GameEngine.Rectangle;
    import Settings = GameEngine.Settings;
    import ScreenBase = GameEngine.Screens.ScreenBase;
    import ScreenStates = GameEngine.Screens.ScreenStates;
    import BackgroundProgressReporter = GameEngine.Screens.BackgroundProgressReporter;
    import LoadingScreen = GameEngine.Screens.LoadingScreen;
    import BackgroundImageFillStyles = GameEngine.Screens.BackgroundImageFillStyles;
    import Colors = GameEngine.UI.Colors;
    import Button = GameEngine.UI.Button;
    import AudioCycler = GameEngine.Media.AudioCycler;
    import UserSettings = GameEngine.IO.UserSettings;
    import MouseState = GameEngine.Input.MouseState;

    export class MainMenuScreen extends ScreenBase {
        public backgroundMusicCycler: AudioCycler;

        private continueGameButton: Button;
        private newGameButton: any;
        private optionsButton: Button;
        private exitButton: Button;
        private isLoading: boolean = true;

        public constructor(game: GameBase) {
            super(game, "MainMenu");

            this.backgroundColor = Colors.red;
        }

        protected onInitialize(): void {
            console.log("initialize");
            var loadingScreen = new LoadingScreen(this.game);
            loadingScreen.runTasksParallel = false;
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(0, "Loading background music (MainMenu.mp3)...");

                this.backgroundMusicCycler = new AudioCycler([
                    "Resources/Music/MainMenu.mp3",
                    "Resources/Music/one-piece-ost-36-luffys-pace.mp3",
                    "Resources/Music/one-piece-ost-31-angry.mp3",
                    "Resources/Music/one-piece-ost-02-hungry-luffy.mp3"
                ]);
                this.backgroundMusicCycler.volume = .5;
                this.backgroundMusicCycler.shuffle = true;
                this.backgroundMusicCycler.preload(() => {
                    reporter.reportProgress(40, "Done loading background music.");
                    reporter.reportCompleted();
                }, (e: ErrorEvent) => {
                    console.log(e);
                    reporter.reportError(e.error);
                });
            });
            loadingScreen.backgroundTasks.push((reporter: BackgroundProgressReporter) => {
                reporter.reportProgress(50, "Loading main menu...");

                let backgroundImage = new Image();
                this.backgroundImageFillStyle = BackgroundImageFillStyles.CenterCrop;

                backgroundImage.addEventListener("load", () => {
                    this.backgroundImage = backgroundImage;

                    reporter.reportProgress(60, "Loading UI...");

                    this.initializeUI();

                    this.isLoading = false;
                    reporter.reportProgress(100, "Done loading main menu.");
                    reporter.reportCompleted();
                });
                backgroundImage.src = "Background MainMenu.jpg";
            });

            loadingScreen.runInBackground().then(() => {
                this.state = ScreenStates.Visible;
                this.manager.remove(loadingScreen);

                if (UserSettings.instance.musicEnabled) {
                    this.backgroundMusicCycler.play();
                }
            }, (e) => {
                if (this.isLoading) {
                    alert("An error occurred while loading the main menu screen.");
                } else {
                    alert("An error occurred.");
                }

                console.error(e);
            });

            this.manager.add(loadingScreen);
            this.state = ScreenStates.Hidden | ScreenStates.Frozen;
        }

        protected initializeUI() {
            if (Settings.isDebugModeEnabled) {
                console.log("initialize UI");
            }

            this.continueGameButton = new Button();
            this.continueGameButton.text = "Continue Game";
            this.continueGameButton.bounds = new Rectangle(0, 0, 200, 35);
            this.continueGameButton.bounds = this.continueGameButton.bounds.update(
                50,
                (this.viewport.height - this.continueGameButton.height) / 2 - (this.continueGameButton.height * 2) - 10);
            this.continueGameButton.autoSize = false;
            this.continueGameButton.textSize = 18;
            this.continueGameButton.addClickHandler(this.onContinueGameButtonClick);
            this.controlManager.add(this.continueGameButton);

            if (this.game.saveManager.getLastSave() === null) {
                this.continueGameButton.hide();
            }

            this.newGameButton = new Button();
            this.newGameButton.text = "New Game";
            this.newGameButton.bounds = new Rectangle(0, 0, 200, 35);
            this.newGameButton.bounds = this.newGameButton.bounds.update(
                50,
                (this.viewport.height - this.continueGameButton.height) / 2 - this.newGameButton.height - 5);
            this.newGameButton.autoSize = false;
            this.newGameButton.textSize = 18;
            this.newGameButton.addClickHandler(this.onNewGameButtonClick);
            this.controlManager.add(this.newGameButton);

            this.optionsButton = new Button();
            this.optionsButton.text = "Options";
            this.optionsButton.bounds = new Rectangle(0, 0, 200, 35);
            this.optionsButton.bounds = this.optionsButton.bounds.update(
                50,
                (this.viewport.height - this.optionsButton.height) / 2);
            this.optionsButton.autoSize = false;
            this.optionsButton.textSize = 18;
            this.optionsButton.addClickHandler(this.onOptionsButtonClick);
            this.controlManager.add(this.optionsButton);

            this.exitButton = new Button();
            this.exitButton.text = "Exit";
            this.exitButton.bounds = new Rectangle(0, 0, 200, 35);
            this.exitButton.bounds = this.exitButton.bounds.update(
                50,
                (this.viewport.height - this.exitButton.height) / 2 + this.optionsButton.height + 5);
            this.exitButton.autoSize = false;
            this.exitButton.textSize = 18;
            this.exitButton.addClickHandler(this.onExitButtonClick);
            this.controlManager.add(this.exitButton);

            let musicButton = new Button();
            musicButton.text = "Music "+ (UserSettings.instance.musicEnabled ? "On" : "Off");
            musicButton.addClickHandler((m: MouseState) => {
                !this.backgroundMusicCycler.paused ? this.backgroundMusicCycler.pause() : this.backgroundMusicCycler.play();
                musicButton.text = "Music "+ (this.backgroundMusicCycler.paused ? "Off" : "On");

                UserSettings.instance.musicEnabled = !this.backgroundMusicCycler.paused;
            });
            musicButton.bounds = new Rectangle(this.viewport.width - 100, 10);
            this.controlManager.add(musicButton);
        }

        protected onUninitialize(): void {
            this.backgroundMusicCycler.stop();
            this.backgroundMusicCycler = null;
        }

        protected onUpdate(updateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
        }

        private onContinueGameButtonClick = (mouseState: MouseState) => {
            this.manager.add(new GameScreen(this.game));
            this.manager.remove(this);
        }

        private onNewGameButtonClick = (mouseState: MouseState) => {
            this.manager.add(new NewGameScreen(this.game, this));
            this.state = ScreenStates.Frozen | ScreenStates.Hidden;
        }

        private onOptionsButtonClick = (mouseState: MouseState) => {
            this.manager.add(new OptionsScreen(this.game, this, this.backgroundMusicCycler));
            this.state = ScreenStates.Frozen | ScreenStates.Hidden;
        }

        private onExitButtonClick = (mouseState: MouseState) => {
        }
    }
}
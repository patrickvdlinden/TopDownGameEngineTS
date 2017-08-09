///<reference path="ScreenBase.ts" />

module Screens {
    export class MainMenuScreen extends ScreenBase {
        private startGameButton: UI.Button;
        private optionsButton: UI.Button;
        private exitButton: UI.Button;
        private isLoading: boolean = true;

        public constructor(game: Game) {
            super(game, "MainMenu");            
        }

        protected onInitialize(): void {
            this.backgroundImage = new Image();
            this.backgroundImage.src = "http://s1.picswalls.com/wallpapers/2015/09/27/hd-one-piece-wallpaper_011525259_277.jpg";
            this.backgroundImageFillStyle = BackgroundImageFillStyles.CenterCrop;

            this.backgroundImage.addEventListener("load", () => {
                this.startGameButton = new UI.Button();
                this.startGameButton.text = "Start Game";
                this.startGameButton.bounds = new Rectangle(0, 0, 200, 35);
                this.startGameButton.bounds = this.startGameButton.bounds.update(
                    50,
                    (this.viewport.height - this.startGameButton.height) / 2 - this.startGameButton.height - 5);
                this.startGameButton.autoSize = false;
                this.startGameButton.textSize = 18;
                this.startGameButton.addClickHandler(this.onStartGameButtonClick);
                this.controlManager.add(this.startGameButton);

                this.optionsButton = new UI.Button();
                this.optionsButton.text = "Options";
                this.optionsButton.bounds = new Rectangle(0, 0, 200, 35);
                this.optionsButton.bounds = this.optionsButton.bounds.update(
                    50,
                    (this.viewport.height - this.optionsButton.height) / 2);
                this.optionsButton.autoSize = false;
                this.optionsButton.textSize = 18;
                this.optionsButton.addClickHandler(this.onOptionsButtonClick);
                this.controlManager.add(this.optionsButton);

                this.exitButton = new UI.Button();
                this.exitButton.text = "Exit";
                this.exitButton.bounds = new Rectangle(0, 0, 200, 35);
                this.exitButton.bounds = this.exitButton.bounds.update(
                    50,
                    (this.viewport.height - this.exitButton.height) / 2 + this.optionsButton.height + 5);
                this.exitButton.autoSize = false;
                this.exitButton.textSize = 18;
                this.exitButton.addClickHandler(this.onExitButtonClick);
                this.controlManager.add(this.exitButton);

                this.isLoading = false;
            });
        }

        protected onUpdate(lastUpdateTime: number): void {
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            if (this.isLoading) {
                context.fillStyle = "white";
                context.font = "18px Segoe UI";
                context.fillText("Loading...", 100, 100);
            }
        }

        private onStartGameButtonClick = (mouseState: Input.MouseState) => {
            this.manager.add(new GameScreen(this.game));
            this.manager.remove(this);
        }

        private onOptionsButtonClick = (mouseState: Input.MouseState) => {
            // this.manager.add(new OptionsScreen(this.game));
            // this.state = ScreenStates.Frozen | ScreenStates.Hidden;
        }

        private onExitButtonClick = (mouseState: Input.MouseState) => {            
        }
    }
}
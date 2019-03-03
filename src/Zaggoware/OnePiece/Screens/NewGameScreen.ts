namespace Zaggoware.OnePiece.Screens {
    import GameBase = GameEngine.GameBase;
    import Rectangle = GameEngine.Rectangle;
    import Settings = GameEngine.Settings;
    import ScreenBase = GameEngine.Screens.ScreenBase;
    import ScreenStates = GameEngine.Screens.ScreenStates;
    import BackgroundImageFillStyles = GameEngine.Screens.BackgroundImageFillStyles;
    import Button = GameEngine.UI.Button;
    import SaveSlotButton = GameEngine.UI.SaveSlotButton;
    import Label = GameEngine.UI.Label;
    import Padding = GameEngine.UI.Padding;
    import Keyboard = GameEngine.Input.Keyboard;
    import Keys = GameEngine.Input.Keys;

    export class NewGameScreen extends ScreenBase {
        private titleLabel: Label;
        private saveSlotButtons: SaveSlotButton[] = [];
        private backButton: Button;

        constructor(game: GameBase, private parentScreen: ScreenBase) {
            super(game, "NewGame");

            this.backgroundImage = parentScreen.backgroundImage;
            this.backgroundImageFillStyle = parentScreen.backgroundImageFillStyle;
        }

        protected onInitialize(): void {
            if (!window.localStorage) {
                this.parentScreen.state = ScreenStates.Visible;
                this.manager.remove(this);
                return;
            }

            this.backgroundImageFillStyle = BackgroundImageFillStyles.CenterCrop;
            this.initializeUI();
            this.state = ScreenStates.Visible;
        }

        protected onUninitialize(): void {
        }

        protected initializeUI(): void {
            // TODO: Story mode
            // TODO: Marine mode

            for (let i = 0; i < Settings.maxSaveSlots; i++) {
                let button = new SaveSlotButton();

                button.text = "SAVE "+ (i + 1);

                if (this.game.saveManager.isSlotUsed(i)) {
                    let save = this.game.saveManager.getSaveFromSlot(i);
                    button.characterName = save.characterName;
                    button.characterLevel = save.characterLevel;
                    button.location = save.location;
                    button.progress = save.progress;
                    button.timePlayed = save.timePlayed;
                }

                let posX = this.viewport.width / 2;
                let posY = this.viewport.height / 2;
                let width = (this.viewport.width - 110) / 2;
                let height = (this.viewport.height - 210) / 2;

                if (i === 0 || i === 2) {
                    posX = posX - 5 - width;
                } else {
                    posX += 5;
                }

                if (i === 0|| i === 1) {
                    posY = posY - 5 - height;
                } else {
                    posY += 5;
                }

                button.bounds = button.bounds.update(posX, posY, width, height);
                button.addClickHandler(() => this.onSaveSlotButtonClick(i));

                this.saveSlotButtons.push(button);
                this.controlManager.add(button);
            }

            this.titleLabel = new Label();
            this.titleLabel.text = "New Game";
            this.titleLabel.textSize = 18;
            this.titleLabel.padding = new Padding(0, 0);
            this.titleLabel.bounds = this.titleLabel.bounds.update(this.saveSlotButtons[0].bounds.x, 50);
            this.controlManager.add(this.titleLabel);

            this.backButton = new Button();
            this.backButton.text = "[Esc] Back";
            this.backButton.addClickHandler(this.onBackButtonClick);
            this.backButton.addBoundsChangedHandler(this.onBackButtonBoundsChanged);
            this.controlManager.add(this.backButton);
        }

        protected onUpdate(updateTime: number): void {
            if (Keyboard.previousState.isKeyUp(Keys.Escape)
                && Keyboard.currentState.isKeyDown(Keys.Escape)) {
                this.onBackButtonClick();
                return;
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
        }

        private onSaveSlotButtonClick(index: number): void {
            if (this.game.saveManager.isSlotUsed(index)) {
                // TODO: Show dialog -> overwrite?
                return;
            }

            var save = this.game.saveManager.createSaveForSlot(index);
            var gameScreen = GameScreen.startNewGame(this.game);
            save.characterLevel = 1
            save.characterName = "Monkey D. Luffy";
            save.location = "Lady Mary (Alvida's Attack)";
            save.progress = 0;
            save.timePlayed = 0;
            this.game.saveManager.saveToSlot(index, save);

            this.manager.add(gameScreen);
            this.manager.remove(this.parentScreen);
            this.manager.remove(this);
        }

        private onBackButtonClick = () => {
            this.parentScreen.state = ScreenStates.Visible;
            this.manager.remove(this);
        }

        private onBackButtonBoundsChanged = (oldBounds: Rectangle, newBounds: Rectangle) => {
            if (oldBounds.width === 0 && newBounds.width !== 0) {
                this.backButton.bounds = this.backButton.bounds.update(
                    this.viewport.width - newBounds.width - 50,
                    this.viewport.height - 50 - newBounds.height);
            }
        }
    }
}
namespace Zaggoware.OnePiece {
    import GameBase = Zaggoware.GameEngine.GameBase;
    import Settings = Zaggoware.GameEngine.Settings;

    export class Game extends GameBase {
        protected onInitialize(): void {
            super.onInitialize();

            Settings.isDebugModeEnabled = (<any>window).debug || false;

            var mainMenuScreen = new Screens.MainMenuScreen(this);
            this.screenManager.add(mainMenuScreen);
            //mainMenuScreen.state = Screens.ScreenStates.Visible;
        }
    }
}

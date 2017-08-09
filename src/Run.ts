window.onload = () => {
    Settings.isDebugModeEnabled = (<any>window).debug || false;

    if (Settings.isDebugModeEnabled) {
        console.log("onload");
    }

    var container = document.getElementById("GameContainer");
    var game = new Game(container);

    var mainMenuScreen = new Screens.MainMenuScreen(game);
    game.screenManager.add(mainMenuScreen);
    //mainMenuScreen.state = Screens.ScreenStates.Visible;
        
    game.initialize();
    game.start();
};
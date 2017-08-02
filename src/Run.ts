window.onload = () => {
    Settings.isDebugModeEnabled = (<any>window).debug || false;

    if (Settings.isDebugModeEnabled) {
        console.log("onload");
    }

    var container = document.getElementById("GameContainer");
    var game = new Game(container);
    
    game.addInitializeHandler(() => {
        if (Settings.isDebugModeEnabled) {
            console.log("oninitialize");
        }
    }).addStartHandler(() => {
        if (Settings.isDebugModeEnabled) {
            console.log("onstart");
        }
    }).initialize();

    var gameScreen = new Screens.GameScreen(game);
    game.screenManager.add(gameScreen);
    gameScreen.state = Screens.ScreenStates.Visible;

    let button = new UI.Button();
    let button1 = button;
    button.autoSize = false;
    button.text = "Test 1";
    button.textSize = 12;
    button.textAlign = UI.TextAligns.Center;
    button.textLineStyles = ((UI.TextLineStyles.Underline | UI.TextLineStyles.Overline) | UI.TextLineStyles.Strikethrough);
    button.bounds = button.bounds.update(10, 100, 200, 50);
    //button.backgroundColor = "red";
    gameScreen.controlManager.add(button);

    button = new UI.Button();
    button.autoSize = true;
    button.text = "Test 2";
    button.textSize = 12;
    button.textAlign = UI.TextAligns.Center;
    button.textLineStyles = ((UI.TextLineStyles.Underline | UI.TextLineStyles.Overline) | UI.TextLineStyles.Strikethrough);
    button.bounds = button.bounds.update(120, 140);
    //button.backgroundColor = "red";
    button.backgroundColor = "rgba(180, 180, 0, 0.7)";
    gameScreen.controlManager.add(button);

    let textBox = new UI.TextBox();
    textBox.placeholder = "Enter your name";
    textBox.textSize = 12;
    textBox.bounds = textBox.bounds.update(500, 300);
    gameScreen.controlManager.add(textBox);

    button1.bringToFront();

    game.start();
};
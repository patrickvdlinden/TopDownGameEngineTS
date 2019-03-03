namespace Zaggoware.OnePiece.Screens {
    import GameBase = GameEngine.GameBase;
    import Rectangle = GameEngine.Rectangle;
    import Settings = GameEngine.Settings;
    import ScreenBase = GameEngine.Screens.ScreenBase;
    import ScreenStates = GameEngine.Screens.ScreenStates;
    import Control = GameEngine.UI.Control;
    import Button = GameEngine.UI.Button;
    import Label = GameEngine.UI.Label;
    import Padding = GameEngine.UI.Padding;
    import Panel = GameEngine.UI.Panel;
    import SelectBox = GameEngine.UI.SelectBox;
    import Slider = GameEngine.UI.Slider;
    import TextBaselines = GameEngine.UI.TextBaselines;
    import AudioCycler = GameEngine.Media.AudioCycler;
    import UserSettings = GameEngine.IO.UserSettings;
    import Keyboard = GameEngine.Input.Keyboard;
    import Keys = GameEngine.Input.Keys;

    export class OptionsScreen extends ScreenBase {
        private static labelWidth = 200;
        private static rowHeight = 30;

        private panel: Panel;
        private resolutionSelectBox: SelectBox;
        private musicEnabledButton: Button;
        private musicVolumeSlider: Slider;
        private audioEnabledButton: Button;
        private audioVolumeSlider: Slider;
        private backButton: Button;
        private uiPadding: Padding = new Padding(50, 50);

        public constructor(game: GameBase, private parentScreen: ScreenBase, private backgroundMusicCycler: AudioCycler) {
            super(game, "Options");

            this.backgroundImage = parentScreen.backgroundImage;
            this.backgroundImageFillStyle = parentScreen.backgroundImageFillStyle;
        }

        protected onInitialize(): void {
            this.initializeUI();
        }

        protected initializeUI() {
            if (Settings.isDebugModeEnabled) {
                console.log("initialize UI");
            }

            let titleLabel = new Label();
            titleLabel.text = "Options";
            titleLabel.textSize = 18;
            titleLabel.padding = new Padding(0, 0);
            titleLabel.autoSize = false;
            titleLabel.bounds = titleLabel.bounds.update(
                this.uiPadding.left,
                this.uiPadding.top,
                this.viewport.width - this.uiPadding.horizontal,
                30);
            this.controlManager.add(titleLabel);

            this.panel = new Panel();
            this.panel.padding = new Padding(15, 20);
            this.panel.bounds = this.panel.bounds.update(
                this.uiPadding.left,
                this.uiPadding.top + titleLabel.height + 10);
            this.panel.bounds = this.panel.bounds.update(
                this.panel.x,
                this.panel.y,
                this.viewport.width - (this.panel.x * 2),
                this.viewport.height - (this.panel.y * 2));
            this.controlManager.add(this.panel);

            let row = 0;
            this.addLabel(row, "Resolution:");

            this.resolutionSelectBox = new SelectBox();
            this.resolutionSelectBox.addItem("1920 x 1080 (16:9)", { width: 1920, height: 1080 });
            this.resolutionSelectBox.addItem("1600 x 1200 (4:3)", { width: 1600, height: 1200 });
            this.resolutionSelectBox.addItem("1600 x 900 (16:9)", { width: 1600, height: 900 });
            this.resolutionSelectBox.addItem("1280 x 1024 (4:3)", { width: 1280, height: 1024 });
            this.resolutionSelectBox.addItem("1024 x 768 (4:3)", { width: 1024, height: 768 });
            this.resolutionSelectBox.addItem("800 x 600 (4:3)", { width: 800, height: 600 });
            this.selectResolution();

            let resolutionApplyButton = new Button();
            resolutionApplyButton.text = "Apply";
            resolutionApplyButton.addClickHandler(this.onResolutionApplyButtonClick);
            this.addValueControl(row, resolutionApplyButton);
            resolutionApplyButton.x += 210;

            row++;
            this.addLabel(row, "Music enabled:");
            this.musicEnabledButton = new Button();
            this.musicEnabledButton.text = UserSettings.instance.musicEnabled ? "On" : "Off";
            this.musicEnabledButton.addClickHandler(this.onMusicEnabledButtonClick);
            this.addValueControl(row, this.musicEnabledButton, 30);

            row++;
            this.addLabel(row, "Music volume:");
            this.musicVolumeSlider = new Slider();
            this.musicVolumeSlider.value = UserSettings.instance.musicVolume;
            this.musicVolumeSlider.addValueChangedHandler(this.onMusicVolumeValueChanged);
            this.addValueControl(row, this.musicVolumeSlider);

            row++;
            this.addLabel(row, "Audio enabled:");
            this.audioEnabledButton = new Button();
            this.audioEnabledButton.text = UserSettings.instance.audioEnabled ? "On" : "Off";
            this.audioEnabledButton.addClickHandler(this.onAudioEnabledButtonClick);
            this.addValueControl(row, this.audioEnabledButton);

            row++;
            this.addLabel(row, "Audio volume:");
            this.audioVolumeSlider = new Slider();
            this.audioVolumeSlider.value = UserSettings.instance.audioVolume;
            this.audioVolumeSlider.addValueChangedHandler(this.onAudioVolumeValueChanged);
            this.addValueControl(row, this.audioVolumeSlider);

            // TODO: Fix this
            // Add this as late as possible so the dropdown menu will not go behind other controls.
            this.addValueControl(0, this.resolutionSelectBox);

            let resetButton = new Button();
            resetButton.text = "Reset";
            resetButton.addClickHandler(() => {
                var result = confirm("Are you sure you want to reset all settings?");
                if (!result) {
                    return;
                }

                UserSettings.instance.resetDefaults();
                this.initUserSettings();
            });
            resetButton.x = this.viewport.width - this.uiPadding.right - 300;
            resetButton.y = titleLabel.y;

            let importButton = new Button();
            importButton.text = "Import";
            importButton.addClickHandler(() => {
                let str = prompt("Save data (base64 encoded string):");
                if (!str) {
                    return;
                }

                UserSettings.instance.import(str);
                this.initUserSettings();
            });
            importButton.x = this.viewport.width - this.uiPadding.right - 200;
            importButton.y = titleLabel.y;

            let exportButton = new Button();
            exportButton.text = "Export";
            exportButton.addClickHandler(() => {
                let saveData = UserSettings.instance.export();
                prompt("Save data (base64 encoded string):", saveData);
            });
            exportButton.x = this.viewport.width - this.uiPadding.right - 100;
            exportButton.y = titleLabel.y;
            exportButton.addBoundsChangedHandler((oldBounds: Rectangle, newBounds: Rectangle) => {
                if (oldBounds.x !== newBounds.x || (oldBounds.width === 0 && newBounds.width !== 0)) {
                    exportButton.x = this.viewport.right - this.uiPadding.right - newBounds.width;
                    importButton.x = this.viewport.right - this.uiPadding.right - newBounds.width - 10 - exportButton.width;
                    resetButton.x = this.viewport.right - this.uiPadding.right - newBounds.width - 10 - exportButton.width - importButton.width;
                }
            });
            this.controlManager.add(exportButton);
            this.controlManager.add(importButton);
            this.controlManager.add(resetButton);

            this.backButton = new Button();
            this.backButton.text = "[Esc] Back";
            this.backButton.addClickHandler(this.onBackButtonClick);
            this.backButton.addBoundsChangedHandler(this.onBackButtonBoundsChanged);
            this.controlManager.add(this.backButton);
        }

        protected onUninitialize(): void {
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

        private addLabel(row: number, text: string): Label {
            let label = new Label();
            label.text = text;
            label.padding = new Padding(0, 0);
            label.textBaseline = TextBaselines.Middle;
            label.autoSize = false;
            label.bounds = label.bounds.update(
                this.panel.x + this.panel.padding.left,
                (this.panel.y + this.panel.padding.top) + ((OptionsScreen.rowHeight + 10) * row),
                OptionsScreen.labelWidth,
                OptionsScreen.rowHeight);
            this.controlManager.add(label);

            return label;
        }

        private addValueControl(row: number, control: Control, width: number = 200) {
            control.bounds = control.bounds.update(
                this.panel.x + this.panel.padding.left + OptionsScreen.labelWidth,
                (this.panel.y + this.panel.padding.top) + ((OptionsScreen.rowHeight + 10) * row),
                width,
                OptionsScreen.rowHeight);
            this.controlManager.add(control);
        }

        private initUserSettings(): void {
            this.selectResolution();
            this.musicEnabledButton.text = UserSettings.instance.musicEnabled ? "On" : "Off";
            this.musicVolumeSlider.value = UserSettings.instance.musicVolume;
            this.audioEnabledButton.text = UserSettings.instance.audioEnabled ? "On" : "Off";
            this.audioVolumeSlider.value = UserSettings.instance.audioVolume;

            const audioCycler = (<MainMenuScreen>this.parentScreen).backgroundMusicCycler;
            audioCycler.volume = this.musicVolumeSlider.value;
            if (UserSettings.instance.musicEnabled) {
                audioCycler.play();
            } else {
                audioCycler.pause();
            }
        }

        private selectResolution() {
            for (var i=0; i<this.resolutionSelectBox.items.length; i++) {
                const resolution = UserSettings.instance.resolution;
                const item = this.resolutionSelectBox.items[i];

                if (item.value.width === resolution.width && item.value.height === resolution.height) {
                    this.resolutionSelectBox.selectedIndex = i;
                    break;
                }
            }
        }

        private onResolutionApplyButtonClick = () => {
            const item = this.resolutionSelectBox.selectedItem;
            Settings.changeScreenResolution(this.game.container, item.value.width, item.value.height);
            UserSettings.instance.resolution = new Rectangle(0, 0, item.value.width, item.value.height);
        }

        private onMusicEnabledButtonClick = () => {
            UserSettings.instance.musicEnabled = !UserSettings.instance.musicEnabled;
            this.musicEnabledButton.text = UserSettings.instance.musicEnabled ? "On" : "Off";

            const audioCycler = (<MainMenuScreen>this.parentScreen).backgroundMusicCycler;
            if (UserSettings.instance.musicEnabled) {
                audioCycler.play();
            } else {
                audioCycler.pause();
            }
        }

        private onMusicVolumeValueChanged = (oldValue: number, newValue: number) => {
            this.backgroundMusicCycler.volume = newValue;
            UserSettings.instance.musicVolume = newValue;
        }

        private onAudioEnabledButtonClick = () => {
            UserSettings.instance.audioEnabled = !UserSettings.instance.audioEnabled;
            this.audioEnabledButton.text = UserSettings.instance.audioEnabled ? "On" : "Off";
        }

        private onAudioVolumeValueChanged = (oldValue: number, newValue: number) => {
            UserSettings.instance.audioVolume = newValue;
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
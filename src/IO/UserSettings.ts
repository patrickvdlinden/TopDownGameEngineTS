module IO {
    export class UserSettings {
        public static storageKey = "userSettings";
        public static defaultSettingsString = "eyJyZXNvbHV0aW9uIjp7IndpZHRoIjo4MDAsImhlaWdodCI6NjAwfSwibXVzaWNFbmFibGVkIjp0cnVlLCJtdXNpY1ZvbHVtZSI6MSwidmVyc2lvbiI6MSwiYXVkaW9Wb2x1bWUiOjF9";

        private static _instance: UserSettings = null;

        private _settings: { [name: string]: any } = {};
        private eventManager: EventManager;

        public static get instance(): UserSettings {
            if (!UserSettings._instance) {
                UserSettings._instance = new UserSettings();
            } 
            
            return UserSettings._instance;
        }

        private constructor() {
            if (Settings.isDebugModeEnabled) {
                console.log("UserSettings: New instance");
            }

            this.eventManager = new EventManager(this);
            this.initialize();
        }

        public get resolution(): Rectangle {
            let res = this.getOrCreateSetting("resolution", { width: 800, height: 600 });
            return new Rectangle(0, 0, res.width, res.height);
        }

        public set resolution(rectangle: Rectangle) {
            this.saveSetting("resolution", { width: rectangle.width, height: rectangle.height });
        }

        public get musicEnabled(): boolean {
            return this.getOrCreateSetting("musicEnabled", true);
        }

        public set musicEnabled(flag: boolean) {
            this.saveSetting("musicEnabled", flag);
        }

        public get musicVolume(): number {
            return this.getOrCreateSetting("musicVolume", 1);
        }

        public set musicVolume(value: number) {
            value = Math.max(0, Math.min(1, value));
            this.saveSetting("musicVolume", value);
        }

        public get audioEnabled(): boolean {
            return this.getOrCreateSetting("audioEnabled", true);
        }

        public set audioEnabled(flag: boolean) {
            this.saveSetting("audioEnabled", flag);
        }

        public get audioVolume(): number {
            return this.getOrCreateSetting("audioVolume", 1);
        }

        public set audioVolume(value: number) {
            value = Math.max(0, Math.min(1, value));
            this.saveSetting("audioVolume", value);
        }

        public export(): string {
            return btoa(window.localStorage.getItem(UserSettings.storageKey));
        }

        public import(base64string: string): void {
            window.localStorage.setItem(UserSettings.storageKey, atob(base64string));

            this.initialize();
        }

        public resetDefaults(): void {
            this.import(UserSettings.defaultSettingsString);
        }

        public addSettingChangedHandler(handler: IEventHandler2<string, any>): void {
            this.eventManager.registerEventHandler("settingChanged", handler);
        }

        public removeSettingChangedHandler(handler: IEventHandler2<string, any>): void {
            this.eventManager.unregisterEventHandler("settingChanged", handler);
        }

        private initialize() {
            if (Settings.isDebugModeEnabled) {
                console.log("UserSettings: Initializing");
            }
            
            if (!window.localStorage) {
                console.error("LocalStorage is not supported in this browser.");
                return;
            }

            let settingsStr = window.localStorage.getItem(UserSettings.storageKey);
            if (!settingsStr) {
                settingsStr = JSON.stringify(this._settings);
                window.localStorage.setItem(UserSettings.storageKey, settingsStr);
            } else {
                this._settings = JSON.parse(settingsStr);
            }
        }

        private getOrCreateSetting(name: string, defaultValue: any): any {
            if (typeof(this._settings[name]) === "undefined") {
                if (Settings.isDebugModeEnabled) {
                    console.log("UserSettings: Creating setting:", name, "with default value:", defaultValue);
                }

                this.saveSetting(name, defaultValue);
            } else {
                if (Settings.isDebugModeEnabled) {
                    console.log("UserSettings: Get setting:", name, "with value:", this._settings[name]);
                }
            }

            return this._settings[name];
        }

        private saveSetting(name: string, value: any) {
            if (Settings.isDebugModeEnabled) {
                console.log("UserSettings: Saving setting:", name, "with value:", value);
            }

            this._settings[name] = value;

            let settingsStr = JSON.stringify(this._settings);
            window.localStorage.setItem(UserSettings.storageKey, settingsStr);

            this.eventManager.triggerEvent("settingChanged", name, value);
        }
    }
}
class Settings {
    private static _isDebugModeEnabled: boolean = false;
    private static _screenWidth: number = 0;
    private static _screenHeight: number = 0;
    
    public static get isDebugModeEnabled(): boolean {
        return this._isDebugModeEnabled;
    }

    public static set isDebugModeEnabled(flag: boolean) {
        this._isDebugModeEnabled = flag;
    }

    public static get screenWidth(): number {
        return this._screenWidth; //|| window.innerWidth;
    }

    public static get screenHeight(): number {
        return this._screenHeight; //|| window.innerHeight;
    }
    
    public static changeScreenResolution(width: number, height: number) {
        if (this._isDebugModeEnabled) {
            console.log(`Changing screen resolution from ${this._screenWidth}x${this._screenHeight} to ${width}x${height}.`);
        }

        this._screenWidth = width || 0;
        this._screenHeight = height || 0;
    }
}
namespace Zaggoware.GameEngine {
    export class Settings {
        private static _isDebugModeEnabled: boolean = false;
        private static _screenWidth: number = 0;
        private static _screenHeight: number = 0;
        private static _elementIdPrefix: string = "ZGE_";
        private static _maxSaveSlots: number = 4;
    
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

        public static get elementIdPrefix(): string {
            return this._elementIdPrefix;
        }

        public static set elementIdPrefix(idPrefix: string) {
            this._elementIdPrefix = idPrefix;
        }

        public static get maxSaveSlots(): number {
            return this._maxSaveSlots;
        }

        public static set maxSaveSlots(maxSaveSlots: number) {
            this._maxSaveSlots = Math.max(1, maxSaveSlots);
        }

        public static changeScreenResolution(container: HTMLElement, width: number, height: number) {
            if (this._isDebugModeEnabled) {
                console.log(`Changing screen resolution from ${this._screenWidth}x${this._screenHeight} to ${width}x${height}.`);
            }

            container.style.width = width + "px";
            container.style.height = height + "px";

            this._screenWidth = width || 0;
            this._screenHeight = height || 0;
        }
    }
}
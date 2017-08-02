///<reference path="ScreenBase.ts" />

module Screens {
    export class ScreenManager implements IGameComponent, IUpdatable, IDrawable {
        private _screens: Array<ScreenBase> = [];
        private _game: Game;
        private _isInitialized: boolean = false;

        public constructor(game: Game, protected container: HTMLElement) {
            this._game = game;
        }

        public get game(): Game {
            return this._game;
        }

        public get screens(): Array<ScreenBase> {
            return this._screens.slice();
        }

        public contains(screen: ScreenBase): boolean {
            return this._screens.indexOf(screen) >= 0;
        }

        public add(screen: ScreenBase): ScreenBase {
            this._screens.push(screen);

            if (this._isInitialized && !screen.isInitialized) {
                screen.initialize();
            }

            return screen;
        }

        public initialize() {
            if (this._isInitialized) {
                throw new Error("ScreenManager is already initialized.");
            }
            
            for (var i = 0; i < this._screens.length; i++) {
                if (!this._screens[i].isInitialized) {
                    this._screens[i].initialize();
                }
            }

            this._isInitialized = true;
        }

        public update(lastUpdateTime: number): void {
            if (!this._isInitialized) {
                return;
            }
            
            var screensToUpdate = this._screens.slice();
            var index = 0;
            while (screensToUpdate.length > 0) {
                var screen = screensToUpdate[index];

                if (screen.state === ScreenStates.Frozen) {
                    continue;
                }
            
                screen.update(lastUpdateTime);

                screensToUpdate.splice(index, 1);
                index++;
            }
        }

        public draw(): void {
            if (!this._isInitialized) {
                return;
            }

            var screensToDraw = this._screens.slice();
            var index = 0;
            while (screensToDraw.length > 0) {
                var screen = screensToDraw[index];

                if (screen.state === ScreenStates.Hidden) {
                    continue;
                }
            
                screen.draw();

                screensToDraw.splice(index, 1);
                index++;
            }
        }
    }
}
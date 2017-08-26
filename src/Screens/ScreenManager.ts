///<reference path="ScreenBase.ts" />

module Screens {
    export class ScreenManager implements IGameComponent, IInitializable, IUpdatable, IDrawable {
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

            screen.manager = this;

            if (this._isInitialized && !screen.isInitialized) {
                screen.initialize();
            }

            return screen;
        }

        public remove(screen: ScreenBase, uninitializeScreen: boolean = true): boolean {
            var index = this._screens.indexOf(screen);
            if (index === -1) {
                return false;
            }

            this._screens.splice(index, 1);

            if (uninitializeScreen && screen.isInitialized) {
                screen.uninitialize();
            }

            screen.manager = null;

            return true;
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

        public uninitialize() {
            if (!this._isInitialized) {
                throw new Error("ScreenManager is not yet initialized.");
            }

            for (var i = 0; i < this._screens.length; i++) {
                if (this._screens[i].isInitialized) {
                    this._screens[i].uninitialize();
                }
            }

            this._isInitialized = false;
        }

        public update(updateTime: number): void {
            if (!this._isInitialized) {
                return;
            }
            
            var screensToUpdate = this._screens.slice();
            while (screensToUpdate.length > 0) {
                var screen = screensToUpdate[0];

                if ((screen.state & ScreenStates.Frozen) !== ScreenStates.Frozen) {
                    screen.update(updateTime);
                }

                screensToUpdate.splice(0, 1);
            }
        }

        public draw(): void {
            if (!this._isInitialized) {
                return;
            }

            var screensToDraw = this._screens.slice();
            while (screensToDraw.length > 0) {
                var screen = screensToDraw[0];

                if ((screen.state & ScreenStates.Hidden) !== ScreenStates.Hidden) {
                    screen.draw();
                }

                screensToDraw.splice(0, 1);
            }
        }
    }
}
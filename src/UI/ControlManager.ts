module UI {
    export class ControlManager implements IGameComponent, IInitializable, IUpdatable {
        private _game: Game;
        private _context: CanvasRenderingContext2D;
        private controls: Array<Control> = [];
        private exclusiveInputHandling: Control = null;
        private _focusedControl: Control = null;
        private _isInitialized: boolean = false;

        public constructor(game: Game, context: CanvasRenderingContext2D) {
            this._game = game;
            this._context = context;
        }

        public get game(): Game {
            return this._game;
        }

        public get drawContext(): CanvasRenderingContext2D {
            return this._context;
        }

        public get focusedControl(): Control {
            return (this._focusedControl && this._focusedControl.isFocused)
                ? this._focusedControl
                : null;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("ControlManager is already initialized.");
            }

            for (var i = 0; i < this.controls.length; i++) {
                if (!this.controls[i].isInitialized) {
                    this.controls[i].initialize();
                }
            }

            this._isInitialized = true;
        }

        public uninitialize(): void {
            if (!this._isInitialized) {
                throw new Error("ControlManager is not yet initialized.");
            }

            for (var i = 0; i < this.controls.length; i++) {
                if (this.controls[i].isInitialized) {
                    this.controls[i].uninitialize();
                }
            }

            this._isInitialized = false;
        }

        public contains(control: Control): boolean {
            return this.controls.indexOf(control) >= 0;
        }

        public add(control: Control): Control {
            if (this.contains(control)) {
                throw new Error("Control is already added to this manager.");
            }

            if (control.manager !== null) {
                control.manager.remove(control);
            }

            this.controls.unshift(control);
            control.manager = this;

            if (this._isInitialized && !control.isInitialized) {
                control.initialize();
            }

            return control;
        }

        public remove(control: Control, uninitializeControl: boolean = true): boolean {
            let idx = this.controls.indexOf(control);
            if (idx === -1) {
                return false;
            }

            this.controls.splice(idx, 1);

            if (uninitializeControl && control.isInitialized) {
                control.uninitialize();
            }

            control.manager = null;

            return true;
        }

        public getZIndex(control: Control): number {
            let idx = this.controls.indexOf(control);
            if (idx === -1) {
                throw new Error("Control is not added to this manager.");
            }

            return idx;
        }

        public bringToFront(control: Control): this {
            let idx = this.controls.indexOf(control);
            if (idx === -1) {
                throw new Error("Control is not added to this manager.");
            }

            this.controls.splice(idx, 1);
            this.controls.unshift(control);
            
            return this;
        }

        public isOnTop(control: Control): boolean {
            return this.controls.length && this.controls[0] === control;
        }

        // TODO: fix
        public focusControl(control: Control): boolean {
            if (!this.contains(control)) {
                return false;
            }

            for (let i = 0; i < this.controls.length; i++) {
                var c = this.controls[i];
                if (c === control || !c.isFocused) {
                    continue;
                }

                c.releaseFocus();
            }

            this._focusedControl = control;

            return true;
        }

        // TODO: fix
        public focusPreviousControl(): void {
            let idx = this.controls.length - 1;

            if (this.focusedControl !== null) {
                idx = this.controls.indexOf(this.focusedControl) - 1;

                if (idx < 0) {
                    idx = this.controls.length - 1;
                }
            }

            this.focusControl(this.controls[idx]);
        }

        // TODO: fix
        public focusNextControl(): void {
            let idx = 0;

            if (this.focusedControl !== null) {
                idx = this.controls.indexOf(this.focusedControl) + 1;

                if (idx === this.controls.length) {
                    idx = 0;
                }
            }

            this.focusControl(this.controls[idx]);
        }

        public enableExclusiveInputHandling(control: Control) {
            if (!control) {
                throw new Error("Control is empty");
            }

            this.exclusiveInputHandling = control;
        }

        public disableExclusiveInputHandling() {
            this.exclusiveInputHandling = null;
        }

        public update(updateTime: number): void {
            let handleInput = true;
            let controlsToUpdate = this.controls.slice();
            while (controlsToUpdate.length) {
                var control = controlsToUpdate[0];

                if (handleInput && (this.exclusiveInputHandling === null || this.exclusiveInputHandling == control)) {
                    handleInput = control.handleInput(updateTime);
                } else {
                    control.resetInput();
                }

                control.update(updateTime);

                controlsToUpdate.splice(0, 1);
            }
        }

        public draw(context: CanvasRenderingContext2D): void {
            context.restore();
            let controlsToDraw = this.controls.slice().reverse();
            while (controlsToDraw.length) {
                controlsToDraw[0].draw(context);
                controlsToDraw.splice(0, 1);
            }
        }
    }
}
module UI {
    export class ControlManager implements IGameComponent, IUpdatable {
        private _game: Game;
        private _context: CanvasRenderingContext2D;
        private controls: Array<Control> = [];
        private exclusiveInputHandling: Control = null;
        private _focusedControl: Control = null;

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

            if (!control.isInitialized) {
                control.initialize();
            }

            control.invalidate();

            return control;
        }

        public remove(control: Control): boolean {
            let idx = this.controls.indexOf(control);
            if (idx === -1) {
                return false;
            }

            this.controls.splice(idx, 1);
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

        public requestFocus(control: Control): boolean {
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

        public enableExclusiveInputHandling(control: Control) {
            if (!control) {
                throw new Error("Control is empty");
            }

            this.exclusiveInputHandling = control;
        }

        public disableExclusiveInputHandling() {
            this.exclusiveInputHandling = null;
        }

        public update(lastUpdateTime: number): void {
            let handleInput = true;
            let controlsToUpdate = this.controls.slice();
            while (controlsToUpdate.length) {
                var control = controlsToUpdate[0];

                control.update(lastUpdateTime);

                if (handleInput && (this.exclusiveInputHandling === null || this.exclusiveInputHandling == control)) {
                    handleInput = control.handleInput(lastUpdateTime);
                } else {
                    control.resetInput();
                }

                controlsToUpdate.splice(0, 1);
            }
        }

        // public draw(context: CanvasRenderingContext2D): void {
        //     context.restore();
        //     let controlsToDraw = this.controls.slice().reverse();
        //     while (controlsToDraw.length) {
        //         controlsToDraw[0].draw(context);
        //         controlsToDraw.splice(0, 1);
        //     }
        // }
    }
}
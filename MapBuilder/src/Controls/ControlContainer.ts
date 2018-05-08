module MapBuilder.Controls {
    export abstract class ControlContainer extends Control implements IControlContainer, IDockable {
        private _controls: ControlsCollection;

        public invalidate(): void {
            super.invalidate();

            if (this.controls.length > 0) {
                for (let i = 0; i < this.controls.length; i++) {
                    this.controls[i].invalidate();
                }
            }
        }

        public get controls(): IControlCollection {
            return this._controls || (this._controls = this.createControlsCollection());
        }

        protected createControlsCollection(): ControlsCollection {
            return new ControlsCollection(this);
        }
    }
}
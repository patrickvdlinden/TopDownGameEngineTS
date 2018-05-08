module MapBuilder.Controls {
    export class SplitContainerPaneCollection implements ArrayLike<Pane> {
        private _owner: SplitContainer;
        private _containerElement: HTMLElement;
        private _valueCollection: { [hashCode: string]: { index: number, pane: Pane } } = {};
        private _length: number = 0;

        public constructor(owner: SplitContainer) {
            this._owner = owner;
            this._containerElement = owner.element;
        }
        
        [n: number]: Pane;

        public get length(): number {
            return this._length;
        }

        public add(pane: Pane): void {
            if (this.contains(pane)) {
                return;
            }

            this._valueCollection[pane.hashCode.toString()] = {
                index: this._length,
                pane: pane
            };
            this[this._length] = pane;
            this._length++;

            pane.dockMode = DockMode.Top | DockMode.Bottom;

            if (this._containerElement && !this._containerElement.contains(pane.element)) {
                this._containerElement.appendChild(pane.element);
            }

            this._owner.autoCalculateSplitPositions();
        }

        public remove(pane: Pane): void {
            var index = this.indexOf(pane);
            if (index < 0) {
                return;
            }

            delete this[index];
            delete this._valueCollection[pane.hashCode.toString()];
            this._length--;

            // TODO: Re-order [index] array-access.

            pane.element.remove();

            if (this._owner) {
                this._owner.invalidate();
            } else {
                pane.invalidate();
            }
        }

        public contains(pane: Pane): boolean {
            return typeof this._valueCollection[pane.hashCode] !== "undefined" && this._valueCollection[pane.hashCode] !== null;
        }

        public indexOf(control: IControl): number {
            return (this._valueCollection[control.hashCode.toString()] || { index: -1, pane: null }).index;
        }
    }

    export class SplitContainer extends Control {
        private _panes: SplitContainerPaneCollection;
        private _splitterPositions: number[] = [];

        public constructor() {
            super();

            this._panes = new SplitContainerPaneCollection(this);
            this.dockMode = DockMode.All;
        }

        public get paneCount(): number {
            return this._panes.length;
        }

        public get splitterPositions(): number[] {
            return this._splitterPositions.slice();
        }

        public setSplitterPositionFor(index: number, position: number) {
            console.log("setSplitterPositionFor", index, position);

            this._splitterPositions[index] = Math.max(0, Math.min(100, position));

            this.invalidate();
        }

        public get panes(): SplitContainerPaneCollection {
            return this._panes;
        }

        public autoCalculateSplitPositions(invalidate: boolean = true): void {
            const paneWidth = 100 / this._panes.length;

            this._splitterPositions = [];
            for (let i = 1; i < this._panes.length; i++) {
                this._splitterPositions.push(paneWidth * i);
            }

            if (invalidate) {
                this.invalidate();
            }
        }

        protected onInvalidate(): void {
            if (!this._panes) {
                return;
            }

            if ((!this._splitterPositions || this._splitterPositions.length == 0) && this._panes.length > 0) {
                this.autoCalculateSplitPositions(false);
            }

            if (this._splitterPositions.length > 0) {
                let paneWidth = this._splitterPositions[0];
                let paneX = 0;

                console.log("this._splitterPositions:", this._splitterPositions);
                console.log("paneWidth:", paneWidth, "paneX:", paneX);
                for (let i = 0; i < this._panes.length; i++) {
                    this._panes[i].invalidate();

                    if (i === this._panes.length - 1) {
                        paneWidth = 100 - this._splitterPositions[i - 1];
                    }

                    this._panes[i].element.style.width = paneWidth + "%";
                    this._panes[i].element.style.left = paneX + "%";

                    if (i < this._splitterPositions.length) {
                        paneWidth = this._splitterPositions[i] - paneWidth;
                        paneX += this._splitterPositions[i];
                    }

                    console.log("paneWidth:", paneWidth, "paneX:", paneX);
                }
            }
        }

        protected createElement(): HTMLElement {
            const element = document.createElement("div");
            element.classList.add("splitContainer");

            this._splitterPositions = [];

            if (this._panes && this._panes.length > 0) {
                this.autoCalculateSplitPositions(false);
            }

            return element;
        }
    }
}
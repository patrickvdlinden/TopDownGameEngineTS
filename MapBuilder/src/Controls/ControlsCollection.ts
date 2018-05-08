/// <reference path="IControl.ts" />
/// <reference path="IControlCollection.ts" />

module MapBuilder.Controls {
    interface IHashCodeCollection {
        [hashCode: string]: IHashCodeCollectionValue;
    }

    interface IHashCodeCollectionValue {
        index: number;
        control: IControl;
    }

    export class ControlsCollection implements IControlCollection {
        private _owner: IControl;
        private _containerElement: HTMLElement;
        private _length: number = 0;
        private _valueCollection: IHashCodeCollection = {};

        public constructor(owner: IControl, containerElement?: HTMLElement) {
            this._owner = owner;
            this._containerElement = containerElement || owner.element;
        }

        [index: number]: IControl;

        public get length(): number {
            return this._length;
        }

        public add(control: IControl): void {
            if (this.contains(control)) {
                return;
            }

            this._valueCollection[control.hashCode.toString()] = {
                index: this._length,
                control: control
            };
            this[this._length] = control;
            this._length++;

            if (this._containerElement && !this._containerElement.contains(control.element)) {
                this._containerElement.appendChild(control.element);
            }

            if (this._owner) {
                this._owner.invalidate();
            } else {
                control.invalidate();
            }
        }

        public remove(control: IControl): void {
            var index = this.indexOf(control);
            console.log("remove:", index, control, this._valueCollection);;
            if (index < 0) {
                return;
            }

            delete this[index];
            delete this._valueCollection[control.hashCode.toString()];
            this._length--;

            // TODO: Re-order [index] array-access.

            console.log("REMOVE START");
            control.element.remove();

            if (this._owner) {
                this._owner.invalidate();
            } else {
                control.invalidate();
            }
        }

        public contains(control: IControl): boolean {
            const hashCodeString = control.hashCode.toString();
            return typeof (this._valueCollection[hashCodeString]) !== "undefined" && this._valueCollection[hashCodeString] !== null;
        }

        public indexOf(control: IControl): number {
            return (this._valueCollection[control.hashCode.toString()] || { index: -1, control: null }).index;
        }
    }
}
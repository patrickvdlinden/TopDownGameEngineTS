module IO {
    export class SaveManager {
        private static slotsKey = "slots";
        private static savePrefixKey = "save";

        private _slots: Date[] = [];
        private saves: ISave[] = [];

        public constructor() {
            if (!window.localStorage) {
                console.error("LocalStorage is not supported in this browser.");
                return;
            }

            var slotsStr = window.localStorage.getItem(SaveManager.slotsKey);
            if (!slotsStr) {
                this._slots = [];
                for (var i=0; i<Settings.maxSaveSlots; i++) {
                    this._slots.push(null);
                }

                slotsStr = JSON.stringify(this._slots);
                window.localStorage.setItem(SaveManager.slotsKey, slotsStr);
            } else {
                this._slots = [];

                let slots = JSON.parse(slotsStr);
                for (var i=0; i<Settings.maxSaveSlots; i++) {
                    if (typeof(slots[i]) === "undefined") {
                        slots[i] = null;
                    }

                    if (slots[i] === null) {
                        this._slots[i] = null;
                        continue;
                    }

                    this._slots[i] = new Date(Date.parse(slots[i]));
                }
            }
        }

        public get slots(): Date[] {
            return this._slots.slice();
        }

        public isSlotUsed(index: number) {
            this.checkIndex(index);

            return typeof(this._slots[index]) !== "undefined"
                && this._slots[index] !== null;
        }

        public getSaveFromSlot(index: number) {
            this.checkIndex(index);

            return this.isSlotUsed(index)
                ? (this.saves[index] || this.load(index))
                : null;
        }

        public createSaveForSlot(index: number): ISave {
            this.checkIndex(index);

            this.saves[index] = <ISave>{
                saveDate: new Date()
            };

            this.save(index, this.saves[index]);

            return this.saves[index];
        }

        public saveToSlot(index: number, save: ISave): void {
            this.checkIndex(index);

            this.saves[index] = save;
            this.save(index, save);
        }

        public getLastSave(): ISave {
            let lastSaveDate: Date = null;
            let lastSavedSlotIndex: number = -1;

            for (var i=0; i<this._slots.length; i++) {
                if (this._slots[i] === null) {
                    continue;
                }

                if (lastSaveDate === null || this._slots[i].getTime() > lastSaveDate.getTime()) {
                    lastSaveDate = this._slots[i];
                    lastSavedSlotIndex = i;
                }
            }

            return this.saves[lastSavedSlotIndex] || this.load(lastSavedSlotIndex);
        }

        private checkIndex(index: number) {
            if (index < 0 || index >= this._slots.length) {
                throw new Error("Index out of bounds.");
            }
        }

        private save(index: number, save: ISave): void {
            const saveStr = JSON.stringify(save);
            window.localStorage.setItem(SaveManager.savePrefixKey + index, saveStr);

            this._slots[index] = new Date();
            const slotsStr = JSON.stringify(this._slots);
            window.localStorage.setItem(SaveManager.slotsKey, slotsStr);
        }

        private load(index: number): ISave {
            const saveStr = window.localStorage.getItem(SaveManager.savePrefixKey + index);
            const save = <ISave>JSON.parse(saveStr);

            this.saves[index] = save;

            return save;
        }
    }
}
namespace Zaggoware.GameEngine.Collections {
    export class Dictionary<TKey, TValue> {
        private _keys: TKey[] = [];
        private _values: TValue[] = [];
        private _collection: KeyValuePair<TKey, TValue>[] = [];
        private _version = -1;

        public get count(): number {
            return this._collection.length;
        }

        public get keys(): TKey[] {
            return this._keys.slice();
        }

        public get values(): TValue[] {
            return this._values.slice();
        }

        public get(key: TKey): TValue {
            const index = this.indexOf(key);
            if (index !== -1) {
                return this._values[index];
            }

            return null;
        }

        public getAt(index: number): KeyValuePair<TKey, TValue> {
            this.throwIfIndexIsOutOfBounds(index);

            return this._collection[index];
        }

        public getKeyAt(index: number): TKey {
            this.throwIfIndexIsOutOfBounds(index);

            return this._keys[index];
        }

        public getValueAt(index: number): TValue {
            this.throwIfIndexIsOutOfBounds(index);

            return this._values[index];
        }

        public indexOf(key: TKey): number {
            return this._keys.indexOf(key);
        }

        public insert(item: KeyValuePair<TKey, TValue>): void {
            return this.insertInternal(0, item);
        }

        public insertAt(index: number, item: KeyValuePair<TKey, TValue>): void {
            if (index === this._collection.length) {
                this.addInternal(item);
                return;
            }

            this.throwIfIndexIsOutOfBounds(index);
            this.insertInternal(index, item);
        }

        public add(key: TKey, value: TValue): void {
            if (this.containsKey(key)) {
                throw new Error("Error: Duplicate key in dictionary.");
            }

            this.addInternal(new KeyValuePair(key, value));
        }

        public remove(key: TKey): void {
            const index = this.indexOf(key);
            if (index !== -1) {
                this.removeInternal(index);
            }
        }

        public removeAt(index: number): void {
            this.throwIfIndexIsOutOfBounds(index);

            this.removeInternal(index);
        }

        public containsKey(key: TKey): boolean {
            return this._keys.indexOf(key) !== -1;
        }

        private insertInternal(index: number, item: KeyValuePair<TKey, TValue>): void {
            if (index === 0) {
                this._keys.unshift(item.key);
                this._values.unshift(item.value);
                this._collection.unshift(item);
            } else {
                var keysLeft = this._keys.slice(0, index);
                var keysRight = this._keys.slice(0, index);
            }

            this._version++;
        }

        private addInternal(item: KeyValuePair<TKey, TValue>): void {
            this._keys.push(item.key);
            this._values.push(item.value);
            this._collection.push(item);
            this._version++;
        }

        private removeInternal(index: number): void {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            this._collection.splice(index, 1);
            this._version++;
        }

        private throwIfIndexIsOutOfBounds(index: number) {
            if (index < 0 || index >= this._collection.length) {
                throw new Error("Error: Index out of bounds.");
            }
        }
    }
}
namespace Zaggoware.GameEngine.Collections {
    export class KeyValuePair<TKey, TValue> {
        private _key: TKey;
        private _value: TValue;

        public constructor(key: TKey, value: TValue) {
            this._key = key;
            this._value = value;
        }

        public get key(): TKey {
            return this._key;
        }

        public get value(): TValue {
            return this._value;
        }
    }
}
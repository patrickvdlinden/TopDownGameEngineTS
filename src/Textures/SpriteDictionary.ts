module Textures {
    export class SpriteDictionary {
        private _dictionary: { [name: string]: Sprite } = {};
        private _array: Sprite[] = [];

        public get count(): number {
            return this._array.length;
        }

        public get(name: string): Sprite {
            return this._dictionary[name];
        }

        public getAt(index: number): Sprite {
            return this._array[index];
        }

        public add = (entitySprite: Sprite): Sprite => {
            this._dictionary[entitySprite.name] = entitySprite;
            this._array.push(entitySprite);

            return entitySprite;
        }

        public remove = (name: string): void => {
            if (!this._dictionary[name]) {
                return;
            }

            const index = this._array.indexOf(this._dictionary[name]);
            if (index >= 0) {
                this._array.splice(index, 1);
                this._dictionary[name] = undefined;
                delete this._dictionary[name];
            }
        }

        public contains(name: string): boolean {
            return typeof(this._dictionary[name]) !== "undefined" && this._dictionary[name] !== null;
        }
    }
}
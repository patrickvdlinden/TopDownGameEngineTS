namespace Zaggoware.GameEngine.Textures {
    export class SpritesheetStateManager implements IUpdatable {
        private _dictionary: { [name: string]: SpriteState } = {};
        private _array: SpriteState[] = [];

        public get count(): number {
            return this._array.length;
        }

        public get(name: string): SpriteState {
            return this._dictionary[name];
        }

        public getAt(index: number): SpriteState {
            return this._array[index];
        }

        public add = (entitySprite: SpriteState): SpriteState => {
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

        public update(updateTime: number): void {
            for (let i = 0; i < this.count; i++) {
                let sprite = this.getAt(i);
                if (sprite.animationMap.length <= 1) {
                    continue;
                }

                sprite.update(updateTime);
            }
        }

        public contains(name: string): boolean {
            return typeof(this._dictionary[name]) !== "undefined" && this._dictionary[name] !== null;
        }
    }
}
module Textures {
    export class Sprite {
        private _name: string;
        private _animationBounds: Rectangle[] = [];
        private _textureIndex: number = 0;
        private _animationInterval: number = 20;
        private updateTime: number = 0;

        public constructor(name: string, bounds: Rectangle[] = null, animationInterval: number = 0) {
            this._name = name;

            if (bounds) {
                this._animationBounds = bounds;
            }
            if (animationInterval >= 0) {
                this._animationInterval = animationInterval;
            }
        }

        public get name(): string {
            return this._name;
        }

        public get animationMap(): Rectangle[] {
            return this._animationBounds;
        }

        public set animationMap(map: Rectangle[]) {
            this._animationBounds = map;
        }

        public get textureIndex(): number {
            return this._textureIndex;
        }

        public get animationInterval(): number {
            return this._animationInterval;
        }

        public set animationInterval(interval: number) {
            this._animationInterval = Math.max(0, interval);
        }

        public get currentTextureBounds(): Rectangle {
            if (this._animationBounds.length === 0) {
                return null;
            }

            return this._animationBounds[this._textureIndex];
        }

        public update(updateTime: number): void {
            this.updateTime += updateTime;

            if (this.updateTime < this._animationInterval) {
                return;
            }

            this.updateTime = 0;

            if (this._animationBounds.length === 0) {
                return;
            }

            this._textureIndex++;
            if (this._textureIndex >= this._animationBounds.length) {
                this._textureIndex = 0;
            }
        }
    }
}
module Entities {
    export abstract class EntityBase implements IGameComponent, IUpdatable, IDrawableWithContext {
        private _game: Game;

        public constructor(game: Game) {
            this._game = game;
        }

        public get game(): Game {
            return this._game;
        }

        public update(lastUpdateTime: number): void {
            if (!this.onUpdate(lastUpdateTime)) {
                return;
            }
        }

        public draw(context: CanvasRenderingContext2D): void {
            context.save();

            if (!this.onDraw(context)) {
                context.restore();
                return;
            }

            context.restore();
        }

        protected abstract onUpdate(lastUpdateTime: number): boolean;
        protected abstract onDraw(context: CanvasRenderingContext2D): boolean;
    }
}
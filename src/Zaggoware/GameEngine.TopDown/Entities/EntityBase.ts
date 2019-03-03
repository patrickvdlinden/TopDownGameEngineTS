namespace Zaggoware.GameEngine.TopDown.Entities {
    export abstract class EntityBase implements IGameComponent, IUpdatable, IDrawableWithContext {
        private _game: GameBase;

        public constructor(game: GameBase) {
            this._game = game;
        }

        public get game(): GameBase {
            return this._game;
        }

        public update(updateTime: number): void {
            if (!this.onUpdate(updateTime)) {
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

        protected abstract onUpdate(updateTime: number): boolean;
        protected abstract onDraw(context: CanvasRenderingContext2D): boolean;
    }
}
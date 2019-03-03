namespace Zaggoware.GameEngine {
    export interface ITextureAnimation extends ArrayLike<Array<number>> {
        readonly length: number;
        readonly [index: number]: Array<number>;
    }
}
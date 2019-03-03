 namespace Zaggoware.GameEngine.TopDown.Environment {
    export interface IChunk {
        triggers?: Array<ITrigger>;
        tiles: ITileCollectionY;
        objects: IObjectCollectionY;
    }
 }
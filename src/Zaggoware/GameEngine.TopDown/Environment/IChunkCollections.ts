///<reference path="ITileCollections.ts" />

namespace Zaggoware.GameEngine.TopDown.Environment {
    export interface IChunkCollectionY {
        [y: number]: IChunkCollectionX;
    }

    export interface IChunkCollectionX {
        [x: number]: IChunk;
    }
}
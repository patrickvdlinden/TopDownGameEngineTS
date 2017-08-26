///<reference path="ITileCollections.ts" />

module Environment {
    export interface IChunkCollectionY {
        [y: number]: IChunkCollectionX;
    }

    export interface IChunkCollectionX {
        [x: number]: IChunk;
    }
}
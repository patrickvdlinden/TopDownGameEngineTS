module Environment {
    export interface IMap {
        chunkSize: number;
        tileSize: number;
        chunks: IChunkCollectionY;
    }
}
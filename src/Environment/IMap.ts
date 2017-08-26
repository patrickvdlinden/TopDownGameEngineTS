module Environment {
    export interface IMap {
        tileSize: number;
        chunkSize: number;
        chunks: IChunkCollectionY;
        tilesets: ITilesetCollection;
    }
}
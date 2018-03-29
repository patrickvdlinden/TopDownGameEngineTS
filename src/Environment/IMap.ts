module Environment {
    export interface IMap {
        tileSize: number;
        chunkSize: number;
        chunks: IChunkCollectionY;
        tilesets: ITilesetCollection;

        // For in-game usage only.
        tilesOccupiedByObject?: {
            [chunkY: string]: {
                [chunkX: string]: {
                    [tileY: string]: {
                        [tileX: string]: boolean
                    }
                }
            }
        };
    }
}
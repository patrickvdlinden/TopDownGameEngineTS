module Environment {
    export interface ITileset {
        name: string;
        textureFilePath: string;
        tileSize: number;
        tiles: ITileDescriptorCollection;
        animatedTiles: Array<string>;
    }
}
module Environment {
    export interface ITile {
        textureX: number;
        textureY: number;
        passable: boolean;
        animation: ITextureAnimation;
    }
}
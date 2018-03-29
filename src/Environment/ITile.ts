module Environment {
    export interface ITileDescriptor {
        name: string;
        type: string;
        label: string;
        passable: boolean;
    }

    export interface ITileTexture {
        textureX?: number;
        textureY?: number;
    }

    export interface IStaticTileDescriptor extends ITileDescriptor, ITileTexture {
    }

    export interface IAnimatedTileDescriptor  extends ITileDescriptor {
        animation?: Array<ITileTexture>;
        interval?: number;
    }

    export interface ITile {
        tilesetName: string;
        tileName: string;
        passable: boolean;
    }
}
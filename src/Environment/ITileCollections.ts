module Environment {
    export interface ITileDescriptorCollection {
        [name: string]: ITileDescriptor;
    }

    export interface ITileCollectionY {
        [y: number]: ITileCollectionX;
    }

    export interface ITileCollectionX {
        [x: number]: ITile;
    }
}
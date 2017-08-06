module Environment {
    export interface ITileCollectionY {
        [y: number]: ITileCollectionX;
    }

    export interface ITileCollectionX {
        [x: number]: ITile;
    }
}
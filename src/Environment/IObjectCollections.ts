module Environment {
    export interface IObjectDescriptorCollection {
        [name: string]: IObjectDescriptor;
    }

    export interface IObjectCollectionY {
        [y: number]: IObjectCollectionX;
    }

    export interface IObjectCollectionX {
        [x: number]: IObject;
    }
}
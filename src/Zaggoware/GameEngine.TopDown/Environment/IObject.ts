namespace Zaggoware.GameEngine.TopDown.Environment {
    export interface IObjectDescriptor {
        name: string;
        type: string;
        label: string;
        collisionX: number;
        collisionY: number;
        collisionWidth: number;
        collisionHeight: number;
    }

    export interface IObjectTexture {
        textureX?: number;
        textureY?: number;
        textureWidth?: number;
        textureHeight?: number;
    }

    export interface IStaticObjectDescriptor extends IObjectDescriptor, IObjectTexture {
    }

    export interface IObject {
        tilesetName: string;
        objectName: string;
    }
}
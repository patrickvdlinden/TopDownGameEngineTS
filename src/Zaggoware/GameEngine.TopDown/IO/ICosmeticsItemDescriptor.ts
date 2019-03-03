namespace Zaggoware.GameEngine.TopDown.IO {
    export interface ICosmeticsItemDescriptor {
        name: string;
        type: Entities.Cosmetics.CosmeticsItemTypes;
        textureOffsetX: number;
        textureOffsetY: number;
    }
}
module IO {
    export interface ICosmeticsItemDescriptor {
        name: string;
        type: Entities.Cosmetics.CharacterCosmeticsItemTypes;
        textureOffsetX: number;
        textureOffsetY: number;
    }
}
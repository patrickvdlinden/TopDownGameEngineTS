namespace Zaggoware.GameEngine.TopDown.Entities.Cosmetics {
    import ICosmeticsItemDescriptor = IO.ICosmeticsItemDescriptor;

    export class CosmeticsItem implements ICosmeticsItemDescriptor {
        public name: string;
        public type: Cosmetics.CosmeticsItemTypes;
        public textureOffsetX: number;
        public textureOffsetY: number;

        public constructor(name: string, type: CosmeticsItemTypes, textureOffsetX: number, textureOffsetY: number) {
            this.name = name;
            this.type = type;
            this.textureOffsetX = textureOffsetX;
            this.textureOffsetY = textureOffsetY;
        }
    }
}
module Entities {
    export class CharacterCosmeticsItem implements IO.ICharacterCosmeticsItemDescriptor {
        public name: string;
        public type: CharacterCosmeticsItemTypes;
        public textureOffsetX: number;
        public textureOffsetY: number;

        public constructor(name: string, type: CharacterCosmeticsItemTypes, textureOffsetX: number, textureOffsetY: number) {
            this.name = name;
            this.type = type;
            this.textureOffsetX = textureOffsetX;
            this.textureOffsetY = textureOffsetY;
        }
    }
}
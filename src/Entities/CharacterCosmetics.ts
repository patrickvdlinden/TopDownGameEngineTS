module Entities {
    export class CharacterCosmetics {
        public legsAndFeetTexture: Textures.Texture;
        public bodyAndArmsTexture: Textures.Texture;
        public headAndHairTexture: Textures.Texture;
        public hatsTetxure: Textures.Texture;

        private _legsAndFeet: CharacterCosmeticsItem;
        private _bodyAndArms: CharacterCosmeticsItem;
        private _headAndHair: CharacterCosmeticsItem;
        private _hat: CharacterCosmeticsItem;

        public constructor() {
            // TODO: Move texture loading to a texture manager, to prevent 'double' loading.
            // TODO: Load textures only when the cosmetic layers are actually being used.
            this.legsAndFeetTexture = new Textures.Texture("Resources/Textures/Entities/LegsAndFeet.png");
            this.legsAndFeetTexture.initialize();

            this.bodyAndArmsTexture = new Textures.Texture("Resources/Textures/Entities/BodyAndArms.png");
            this.bodyAndArmsTexture.initialize();

            this.headAndHairTexture = new Textures.Texture("Resources/Textures/Entities/HeadAndHair.png");
            this.headAndHairTexture.initialize();

            this.hatsTetxure = new Textures.Texture("Resources/Textures/Entities/Hats.png");
            this.hatsTetxure.initialize();
        }

        public get legsAndFeet(): CharacterCosmeticsItem {
            return this._legsAndFeet;
        }

        public set legsAndFeet(item: CharacterCosmeticsItem) {
            this._legsAndFeet = item;
        }

        public get bodyAndArms(): CharacterCosmeticsItem {
            return this._bodyAndArms;
        }

        public set bodyAndArms(item: CharacterCosmeticsItem) {
            this._bodyAndArms = item;
        }

        public get headAndHair(): CharacterCosmeticsItem {
            return this._headAndHair;
        }

        public set headAndHair(item: CharacterCosmeticsItem) {
            this._headAndHair = item;
        }

        public get hat(): CharacterCosmeticsItem {
            return this._hat;
        }

        public set hat(item: CharacterCosmeticsItem) {
            this._hat = item;
        }
    }
}
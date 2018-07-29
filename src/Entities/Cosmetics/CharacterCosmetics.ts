module Entities.Cosmetics {
    export class CharacterCosmetics {
        public legsAndFeetTexture: Textures.Texture;
        public bodyAndArmsTexture: Textures.Texture;
        public headAndHairTexture: Textures.Texture;
        public hatsTetxure: Textures.Texture;

        private _legsAndFeet: CosmeticsItem;
        private _bodyAndArms: CosmeticsItem;
        private _headAndHair: CosmeticsItem;
        private _hat: CosmeticsItem;

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

        public get legsAndFeet(): CosmeticsItem {
            return this._legsAndFeet;
        }

        public set legsAndFeet(item: CosmeticsItem) {
            this._legsAndFeet = item;
        }

        public get bodyAndArms(): CosmeticsItem {
            return this._bodyAndArms;
        }

        public set bodyAndArms(item: CosmeticsItem) {
            this._bodyAndArms = item;
        }

        public get headAndHair(): CosmeticsItem {
            return this._headAndHair;
        }

        public set headAndHair(item: CosmeticsItem) {
            this._headAndHair = item;
        }

        public get hat(): CosmeticsItem {
            return this._hat;
        }

        public set hat(item: CosmeticsItem) {
            this._hat = item;
        }
    }
}
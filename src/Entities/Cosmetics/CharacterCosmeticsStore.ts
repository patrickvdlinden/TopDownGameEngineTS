module Entities.Cosmetics {
    export class CharacterCosmeticsStore {
        private static _legsAndFeet: Collections.Dictionary<string, CosmeticsItem>;
        private static _bodyAndArms: Collections.Dictionary<string, CosmeticsItem>;
        private static _headAndHair: Collections.Dictionary<string, CosmeticsItem>;
        private static _hats: Collections.Dictionary<string, CosmeticsItem>;
        private static _capes: Collections.Dictionary<string, CosmeticsItem>;

        public static get legsAndFeet(): Collections.Dictionary<string, CosmeticsItem> {
            return this._legsAndFeet || (this._legsAndFeet = new Collections.Dictionary<string, CosmeticsItem>());
        }

        public static get bodyAndArms(): Collections.Dictionary<string, CosmeticsItem> {
            return this._bodyAndArms || (this._bodyAndArms = new Collections.Dictionary<string, CosmeticsItem>());
        }

        public static get headAndHair(): Collections.Dictionary<string, CosmeticsItem> {
            return this._headAndHair || (this._headAndHair = new Collections.Dictionary<string, CosmeticsItem>());
        }

        public static get hats(): Collections.Dictionary<string, CosmeticsItem> {
            return this._hats || (this._hats = new Collections.Dictionary<string, CosmeticsItem>());
        }

        public static get capes(): Collections.Dictionary<string, CosmeticsItem> {
            return this._capes || (this._capes = new Collections.Dictionary<string, CosmeticsItem>());
        }
        
        public static initialize(): void {
            // KidLuffy
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyHair, CharacterCosmeticsItemTypes.HeadAndHair, 96, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyShirt, CharacterCosmeticsItemTypes.BodyAndArms, 96, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 96, 0));

            // Luffy
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHat, CharacterCosmeticsItemTypes.Hats, 0, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatGreen, CharacterCosmeticsItemTypes.Hats, 96, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatBlue, CharacterCosmeticsItemTypes.Hats, 192, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatYellow, CharacterCosmeticsItemTypes.Hats, 288, 0));
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHair, CharacterCosmeticsItemTypes.HeadAndHair, 0, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyShirt, CharacterCosmeticsItemTypes.BodyAndArms, 0, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 0, 0));

            // Shanks
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksHair, CharacterCosmeticsItemTypes.HeadAndHair, 0, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksShirt, CharacterCosmeticsItemTypes.BodyAndArms, 0, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 0, 128));

            // Zoro
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroHair, CharacterCosmeticsItemTypes.HeadAndHair, 192, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroShirt, CharacterCosmeticsItemTypes.BodyAndArms, 192, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 192, 0));

            // Benn Beckman
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanHair, CharacterCosmeticsItemTypes.HeadAndHair, 96, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanShirt, CharacterCosmeticsItemTypes.BodyAndArms, 96, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 96, 128));

            // Yassop
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.YassopHair, CharacterCosmeticsItemTypes.HeadAndHair, 288, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.YassopShirt, CharacterCosmeticsItemTypes.BodyAndArms, 288, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.YassopPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 288, 128));

            // Woop Slap
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapHair, CharacterCosmeticsItemTypes.HeadAndHair, 0, 512));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapHat, CharacterCosmeticsItemTypes.Hats, 0, 512));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapShirt, CharacterCosmeticsItemTypes.BodyAndArms, 0, 512));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapPantsAndShoes, CharacterCosmeticsItemTypes.LegsAndFeet, 0, 512));

            // Pirate Bandanas
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaOrangeYellow, Entities.CharacterCosmeticsItemTypes.Hats, 0, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaYellowRed, Entities.CharacterCosmeticsItemTypes.Hats, 96, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaDarkGrayPurple, Entities.CharacterCosmeticsItemTypes.Hats, 192, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaBlueOrange, Entities.CharacterCosmeticsItemTypes.Hats, 288, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaGreen, Entities.CharacterCosmeticsItemTypes.Hats, 384, 256));

            // Pirate Shirts
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtOrangeYellow, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 0, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtYellowRed, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 96, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtDarkGrayPurple, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 192, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtBlueOrange, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 288, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtGreen, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 384, 256));

            // Pirate Pants & Shoes
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesGreen, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 0, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesLightGray, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 96, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesOlive, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 192, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesBrown, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 288, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesBlue, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 384, 256));

            // Higuma
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaHair, Entities.CharacterCosmeticsItemTypes.HeadAndHair, 0, 384));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaShirt, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 0, 384));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaPantsAndShoes, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 0, 384));

            // Bandit Bandanas
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.BanditBandanaLightGray, Entities.CharacterCosmeticsItemTypes.Hats, 96, 384));

            // Bandit Shirts
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.BanditShirtLightGray, Entities.CharacterCosmeticsItemTypes.BodyAndArms, 96, 384));

            // Bandit Pants & Shoes
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.BanditPantsAndShoesWhaleBlue, Entities.CharacterCosmeticsItemTypes.LegsAndFeet, 96, 384));
        }

        private static addToStore(store: Collections.Dictionary<string, CosmeticsItem>, item: CosmeticsItem): void {
            store.add(item.name, item);
        }
    }
}
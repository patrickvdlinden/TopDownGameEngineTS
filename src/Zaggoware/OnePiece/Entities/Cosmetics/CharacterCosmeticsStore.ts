/// <reference path="../../../GameEngine.TopDown/Entities/Cosmetics/CosmeticItem.ts" />

namespace Zaggoware.OnePiece.Entities.Cosmetics {
    import Dictionary = GameEngine.Collections.Dictionary;
    import CosmeticsItem = GameEngine.TopDown.Entities.Cosmetics.CosmeticsItem;
    import CosmeticsItemTypes = GameEngine.TopDown.Entities.Cosmetics.CosmeticsItemTypes;

    export class CharacterCosmeticsStore {
        private static _legsAndFeet: Dictionary<string, CosmeticsItem>;
        private static _bodyAndArms: Dictionary<string, CosmeticsItem>;
        private static _headAndHair: Dictionary<string, CosmeticsItem>;
        private static _hats: Dictionary<string, CosmeticsItem>;
        private static _capes: Dictionary<string, CosmeticsItem>;

        public static get legsAndFeet(): Dictionary<string, CosmeticsItem> {
            return this._legsAndFeet || (this._legsAndFeet = new Dictionary<string, CosmeticsItem>());
        }

        public static get bodyAndArms(): Dictionary<string, CosmeticsItem> {
            return this._bodyAndArms || (this._bodyAndArms = new Dictionary<string, CosmeticsItem>());
        }

        public static get headAndHair(): Dictionary<string, CosmeticsItem> {
            return this._headAndHair || (this._headAndHair = new Dictionary<string, CosmeticsItem>());
        }

        public static get hats(): Dictionary<string, CosmeticsItem> {
            return this._hats || (this._hats = new Dictionary<string, CosmeticsItem>());
        }

        public static get capes(): Dictionary<string, CosmeticsItem> {
            return this._capes || (this._capes = new Dictionary<string, CosmeticsItem>());
        }
        
        public static initialize(): void {
            // KidLuffy
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyHair, CosmeticsItemTypes.HeadAndHair, 96, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyShirt, CosmeticsItemTypes.BodyAndArms, 96, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.KidLuffyPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 96, 0));

            // Luffy
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHat, CosmeticsItemTypes.Hats, 0, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatGreen, CosmeticsItemTypes.Hats, 96, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatBlue, CosmeticsItemTypes.Hats, 192, 0));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHatYellow, CosmeticsItemTypes.Hats, 288, 0));
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyHair, CosmeticsItemTypes.HeadAndHair, 0, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyShirt, CosmeticsItemTypes.BodyAndArms, 0, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.LuffyPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 0, 0));

            // Shanks
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksHair, CosmeticsItemTypes.HeadAndHair, 0, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksShirt, CosmeticsItemTypes.BodyAndArms, 0, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.ShanksPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 0, 128));

            // Zoro
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroHair, CosmeticsItemTypes.HeadAndHair, 192, 0));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroShirt, CosmeticsItemTypes.BodyAndArms, 192, 0));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.ZoroPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 192, 0));

            // Benn Beckman
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanHair, CosmeticsItemTypes.HeadAndHair, 96, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanShirt, CosmeticsItemTypes.BodyAndArms, 96, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.BennBeckmanPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 96, 128));

            // Yassop
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.YassopHair, CosmeticsItemTypes.HeadAndHair, 288, 128));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.YassopShirt, CosmeticsItemTypes.BodyAndArms, 288, 128));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.YassopPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 288, 128));

            // Woop Slap
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapHair, CosmeticsItemTypes.HeadAndHair, 0, 512));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapHat, CosmeticsItemTypes.Hats, 0, 512));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapShirt, CosmeticsItemTypes.BodyAndArms, 0, 512));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.WoopSlapPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 0, 512));

            // Pirate Bandanas
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaOrangeYellow, CosmeticsItemTypes.Hats, 0, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaYellowRed, CosmeticsItemTypes.Hats, 96, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaDarkGrayPurple, CosmeticsItemTypes.Hats, 192, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaBlueOrange, CosmeticsItemTypes.Hats, 288, 256));
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.PirateBandanaGreen, CosmeticsItemTypes.Hats, 384, 256));

            // Pirate Shirts
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtOrangeYellow, CosmeticsItemTypes.BodyAndArms, 0, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtYellowRed, CosmeticsItemTypes.BodyAndArms, 96, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtDarkGrayPurple, CosmeticsItemTypes.BodyAndArms, 192, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtBlueOrange, CosmeticsItemTypes.BodyAndArms, 288, 256));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.PirateShirtGreen, CosmeticsItemTypes.BodyAndArms, 384, 256));

            // Pirate Pants & Shoes
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesGreen, CosmeticsItemTypes.LegsAndFeet, 0, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesLightGray, CosmeticsItemTypes.LegsAndFeet, 96, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesOlive, CosmeticsItemTypes.LegsAndFeet, 192, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesBrown, CosmeticsItemTypes.LegsAndFeet, 288, 256));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.PiratePantsAndShoesBlue, CosmeticsItemTypes.LegsAndFeet, 384, 256));

            // Higuma
            this.addToStore(this.headAndHair, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaHair, CosmeticsItemTypes.HeadAndHair, 0, 384));
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaShirt, CosmeticsItemTypes.BodyAndArms, 0, 384));
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.HigumaPantsAndShoes, CosmeticsItemTypes.LegsAndFeet, 0, 384));

            // Bandit Bandanas
            this.addToStore(this.hats, new CosmeticsItem(CharacterCosmeticsItemNames.BanditBandanaLightGray, CosmeticsItemTypes.Hats, 96, 384));

            // Bandit Shirts
            this.addToStore(this.bodyAndArms, new CosmeticsItem(CharacterCosmeticsItemNames.BanditShirtLightGray, CosmeticsItemTypes.BodyAndArms, 96, 384));

            // Bandit Pants & Shoes
            this.addToStore(this.legsAndFeet, new CosmeticsItem(CharacterCosmeticsItemNames.BanditPantsAndShoesWhaleBlue, CosmeticsItemTypes.LegsAndFeet, 96, 384));
        }

        private static addToStore(store: Dictionary<string, CosmeticsItem>, item: CosmeticsItem): void {
            store.add(item.name, item);
        }
    }
}
/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class Pirate extends Character {
        public constructor(private index: number, viewport: Viewport, camera: Camera) {
            super("Pirate " + index, viewport, camera);
        }

        protected onInitialize(): void {
            let hat: string,
                bodyAndArms: string,
                legsAndFeet: string;

            switch (this.index) {
                case 1:
                    hat = CharacterCosmeticsItemNames.PirateBandanaYellowRed;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtYellowRed;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesLightGray;
                    break;
                
                case 2:
                    hat = CharacterCosmeticsItemNames.PirateBandanaDarkGrayPurple;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtDarkGrayPurple;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesOlive;
                    break;
                
                case 3:
                    hat = CharacterCosmeticsItemNames.PirateBandanaBlueOrange;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtBlueOrange;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesBrown;
                    break;
                
                case 4:
                    hat = CharacterCosmeticsItemNames.PirateBandanaGreen;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtGreen;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesBlue;
                    break;
                
                default:
                    hat = CharacterCosmeticsItemNames.PirateBandanaOrangeYellow;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtOrangeYellow;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesGreen;
                    break;
            }

            this.cosmetics.hat = CharacterCosmeticsStore.hats.get(hat);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(bodyAndArms);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(legsAndFeet);
        }
    }
}
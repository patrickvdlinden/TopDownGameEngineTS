/// <reference path="../Character.ts" />

module Entities.Characters {
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
                    hat = Cosmetics.CharacterCosmeticsItemNames.PirateBandanaYellowRed;
                    bodyAndArms = Cosmetics.CharacterCosmeticsItemNames.PirateShirtYellowRed;
                    legsAndFeet = Cosmetics.CharacterCosmeticsItemNames.PiratePantsAndShoesLightGray;
                    break;
                
                case 2:
                    hat = Cosmetics.CharacterCosmeticsItemNames.PirateBandanaDarkGrayPurple;
                    bodyAndArms = Cosmetics.CharacterCosmeticsItemNames.PirateShirtDarkGrayPurple;
                    legsAndFeet = Cosmetics.CharacterCosmeticsItemNames.PiratePantsAndShoesOlive;
                    break;
                
                case 3:
                    hat = Cosmetics.CharacterCosmeticsItemNames.PirateBandanaBlueOrange;
                    bodyAndArms = Cosmetics.CharacterCosmeticsItemNames.PirateShirtBlueOrange;
                    legsAndFeet = Cosmetics.CharacterCosmeticsItemNames.PiratePantsAndShoesBrown;
                    break;
                
                case 4:
                    hat = Cosmetics.CharacterCosmeticsItemNames.PirateBandanaGreen;
                    bodyAndArms = Cosmetics.CharacterCosmeticsItemNames.PirateShirtGreen;
                    legsAndFeet = Cosmetics.CharacterCosmeticsItemNames.PiratePantsAndShoesBlue;
                    break;
                
                default:
                    hat = Cosmetics.CharacterCosmeticsItemNames.PirateBandanaOrangeYellow;
                    bodyAndArms = Cosmetics.CharacterCosmeticsItemNames.PirateShirtOrangeYellow;
                    legsAndFeet = Cosmetics.CharacterCosmeticsItemNames.PiratePantsAndShoesGreen;
                    break;
            }

            this.cosmetics.hat = Cosmetics.CharacterCosmeticsStore.hats.get(hat);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(bodyAndArms);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(legsAndFeet);
        }
    }
}
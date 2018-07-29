/// <reference path="../Character.ts" />

module Entities.Characters {
    export class Bandit extends Character {
        public constructor(private index: number, viewport: Viewport, camera: Camera) {
            super("Bandit " + index, viewport, camera);
        }

        protected onInitialize(): void {
            let hat: string,
                bodyAndArms: string,
                legsAndFeet: string;

            switch (this.index) {
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
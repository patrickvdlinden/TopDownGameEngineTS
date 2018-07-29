/// <reference path="../Character.ts" />

module Entities.Characters {
    export class Higuma extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Higuma", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.HigumaHair);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.HigumaShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.HigumaPantsAndShoes);
        }
    }
}
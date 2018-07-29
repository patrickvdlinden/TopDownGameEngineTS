/// <reference path="../Character.ts" />

module Entities.Characters {
    export class Shanks extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Shanks", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.ShanksHair);
            this.cosmetics.hat = Cosmetics.CharacterCosmeticsStore.hats.get(Cosmetics.CharacterCosmeticsItemNames.LuffyHat);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.ShanksShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.ShanksPantsAndShoes);
        }
    }
}
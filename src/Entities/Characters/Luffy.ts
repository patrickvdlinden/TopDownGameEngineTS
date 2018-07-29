/// <reference path="../Character.ts" />

module Entities.Characters {
    export class Luffy extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Luffy", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.LuffyHair);
            this.cosmetics.hat = Cosmetics.CharacterCosmeticsStore.hats.get(Cosmetics.CharacterCosmeticsItemNames.LuffyHat);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.LuffyShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.LuffyPantsAndShoes);
        }
    }
}
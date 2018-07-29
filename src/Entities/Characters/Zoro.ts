/// <reference path="../Character.ts" />

module Entities.Characters {
    export class Zoro extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Zoro", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.ZoroHair);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.ZoroShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.ZoroPantsAndShoes);
        }
    }
}
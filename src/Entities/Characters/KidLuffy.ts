/// <reference path="../Character.ts" />

module Entities.Characters {
    export class KidLuffy extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Kid Luffy", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.KidLuffyHair);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.KidLuffyShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.KidLuffyPantsAndShoes);
        }
    }
}
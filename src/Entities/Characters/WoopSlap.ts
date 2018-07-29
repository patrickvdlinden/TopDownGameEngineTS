/// <reference path="../Character.ts" />

module Entities.Characters {
    export class WoopSlap extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Woop Slap", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.WoopSlapHair);
            this.cosmetics.hat = Cosmetics.CharacterCosmeticsStore.hats.get(Cosmetics.CharacterCosmeticsItemNames.WoopSlapHat);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.WoopSlapShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.WoopSlapPantsAndShoes);
        }
    }
}
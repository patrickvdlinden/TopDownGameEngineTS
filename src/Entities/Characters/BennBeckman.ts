/// <reference path="../Character.ts" />

module Entities.Characters {
    export class BennBeckman extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Benn Beckman", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = Cosmetics.CharacterCosmeticsStore.headAndHair.get(Cosmetics.CharacterCosmeticsItemNames.BennBeckmanHair);
            this.cosmetics.bodyAndArms = Cosmetics.CharacterCosmeticsStore.bodyAndArms.get(Cosmetics.CharacterCosmeticsItemNames.BennBeckmanShirt);
            this.cosmetics.legsAndFeet = Cosmetics.CharacterCosmeticsStore.legsAndFeet.get(Cosmetics.CharacterCosmeticsItemNames.BennBeckmanPantsAndShoes);
        }
    }
}
/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class Shanks extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Shanks", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = CharacterCosmeticsStore.headAndHair.get(CharacterCosmeticsItemNames.ShanksHair);
            this.cosmetics.hat = CharacterCosmeticsStore.hats.get(CharacterCosmeticsItemNames.LuffyHat);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(CharacterCosmeticsItemNames.ShanksShirt);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(CharacterCosmeticsItemNames.ShanksPantsAndShoes);
        }
    }
}
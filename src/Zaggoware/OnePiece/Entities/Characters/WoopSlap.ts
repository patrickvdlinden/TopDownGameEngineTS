/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class WoopSlap extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Woop Slap", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = CharacterCosmeticsStore.headAndHair.get(CharacterCosmeticsItemNames.WoopSlapHair);
            this.cosmetics.hat = CharacterCosmeticsStore.hats.get(CharacterCosmeticsItemNames.WoopSlapHat);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(CharacterCosmeticsItemNames.WoopSlapShirt);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(CharacterCosmeticsItemNames.WoopSlapPantsAndShoes);
        }
    }
}
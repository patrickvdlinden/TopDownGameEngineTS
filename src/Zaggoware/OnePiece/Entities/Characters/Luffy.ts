/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />
/// <reference path="../Cosmetics/CharacterCosmeticsItemNames.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class Luffy extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Luffy", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = CharacterCosmeticsStore.headAndHair.get(CharacterCosmeticsItemNames.LuffyHair);
            this.cosmetics.hat = CharacterCosmeticsStore.hats.get(CharacterCosmeticsItemNames.LuffyHat);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(CharacterCosmeticsItemNames.LuffyShirt);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(CharacterCosmeticsItemNames.LuffyPantsAndShoes);
        }
    }
}
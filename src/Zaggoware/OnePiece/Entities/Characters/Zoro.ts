/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class Zoro extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Zoro", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = CharacterCosmeticsStore.headAndHair.get(CharacterCosmeticsItemNames.ZoroHair);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(CharacterCosmeticsItemNames.ZoroShirt);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(CharacterCosmeticsItemNames.ZoroPantsAndShoes);
        }
    }
}
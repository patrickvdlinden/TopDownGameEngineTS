/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />
/// <reference path="../Cosmetics/CharacterCosmeticsItemNames.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class BennBeckman extends Character {
        public constructor(viewport: Viewport, camera: Camera) {
            super("Benn Beckman", viewport, camera);
        }

        protected onInitialize(): void {
            this.cosmetics.headAndHair = CharacterCosmeticsStore.headAndHair.get(CharacterCosmeticsItemNames.BennBeckmanHair);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(CharacterCosmeticsItemNames.BennBeckmanShirt);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(CharacterCosmeticsItemNames.BennBeckmanPantsAndShoes);
        }
    }
}
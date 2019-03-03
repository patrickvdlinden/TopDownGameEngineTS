/// <reference path="../Cosmetics/CharacterCosmeticsStore.ts" />

namespace Zaggoware.OnePiece.Entities.Characters {
    import Viewport = GameEngine.Viewport;
    import Camera = GameEngine.Camera;
    import Character = GameEngine.TopDown.Entities.Character;

    import CharacterCosmeticsStore = Entities.Cosmetics.CharacterCosmeticsStore;
    import CharacterCosmeticsItemNames = Entities.Cosmetics.CharacterCosmeticsItemNames;

    export class Bandit extends Character {
        public constructor(private index: number, viewport: Viewport, camera: Camera) {
            super("Bandit " + index, viewport, camera);
        }

        protected onInitialize(): void {
            let hat: string,
                bodyAndArms: string,
                legsAndFeet: string;

            switch (this.index) {
                default:
                    hat = CharacterCosmeticsItemNames.PirateBandanaOrangeYellow;
                    bodyAndArms = CharacterCosmeticsItemNames.PirateShirtOrangeYellow;
                    legsAndFeet = CharacterCosmeticsItemNames.PiratePantsAndShoesGreen;
                    break;
            }

            this.cosmetics.hat = CharacterCosmeticsStore.hats.get(hat);
            this.cosmetics.bodyAndArms = CharacterCosmeticsStore.bodyAndArms.get(bodyAndArms);
            this.cosmetics.legsAndFeet = CharacterCosmeticsStore.legsAndFeet.get(legsAndFeet);
        }
    }
}
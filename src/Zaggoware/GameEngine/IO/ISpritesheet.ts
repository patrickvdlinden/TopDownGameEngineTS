namespace Zaggoware.GameEngine.IO {
    export interface ISpritesheet {
        name: string;
        textureFile: string;
        sprites: { 
            [group: string]: {
                 interval: number;
                 intervalMultiplier: {
                    [spriteGroup: string]: number;
                 };
                 states: {
                     [state: string]: number[][];
                 };
            };
        };
    }
}
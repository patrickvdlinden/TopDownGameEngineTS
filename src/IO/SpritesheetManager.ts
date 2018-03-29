module IO {
    export class SpritesheetManager {
        private static spritesheets: Textures.Spritesheet[] = [];
        private static loadedTextureFiles: HTMLImageElement;

        public static loadSpritesheet(path: string): IPromise<Textures.Spritesheet> {
            return new SimplePromise((fulfill: (value?: Textures.Spritesheet) => void, reject: (reason?: any) => void) => {
                if (SpritesheetManager.spritesheets)

                Http.Ajax.get(path).then((data: ISpritesheet) => {
                    var spritesheet = new Textures.Spritesheet(data.name, data.textureFile);
                    fulfill(spritesheet);
                }, (reason: any) => {
                    reject(reason);
                })
            });
        }
    }
}
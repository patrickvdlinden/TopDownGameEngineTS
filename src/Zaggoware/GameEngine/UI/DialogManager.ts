namespace Zaggoware.GameEngine.UI {
    export class DialogManager implements IGameComponent, IInitializable, IUpdatable, IDrawable {
        private _game: GameBase;
        private _context: CanvasRenderingContext2D;
        private dialogs: Array<Dialog> = [];
        private _isInitialized: boolean = false;

        public constructor(game: GameBase, context: CanvasRenderingContext2D) {
            this._game = game;
            this._context = context;
        }

        public get game(): GameBase {
            return this._game;
        }

        public get drawContext(): CanvasRenderingContext2D {
            return this._context;
        }

        public get hasActiveDialog(): boolean {
            // TODO: Implement
            return false;
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public initialize(): void {
            if (this._isInitialized) {
                throw new Error("DialogManager is already initialized.");
            }

            for (var i = 0; i < this.dialogs.length; i++) {
                if (!this.dialogs[i].isInitialized) {
                    this.dialogs[i].initialize();
                }
            }

            this._isInitialized = true;
        }

        public uninitialize(): void {
            if (!this._isInitialized) {
                throw new Error("DialogManager is not yet initialized.");
            }

            for (var i = 0; i < this.dialogs.length; i++) {
                if (this.dialogs[i].isInitialized) {
                    this.dialogs[i].uninitialize();
                }
            }

            this._isInitialized = false;
        }

        public contains(dialog: Dialog): boolean {
            return this.dialogs.indexOf(dialog) >= 0;
        }

        public add(dialog: Dialog): Dialog {
            if (this.contains(dialog)) {
                throw new Error("Dialog is already added to this manager.");
            }

            if (dialog.manager !== null) {
                dialog.manager.remove(dialog);
            }

            this.dialogs.unshift(dialog);
            dialog.manager = this;

            if (this._isInitialized && !dialog.isInitialized) {
                dialog.initialize();
            }

            return dialog;
        }

        public remove(dialog: Dialog, uninitializeDialog: boolean = true): boolean {
            let idx = this.dialogs.indexOf(dialog);
            if (idx === -1) {
                return false;
            }

            this.dialogs.splice(idx, 1);

            if (uninitializeDialog && dialog.isInitialized) {
                dialog.uninitialize();
            }

            dialog.manager = null;

            return true;
        }

        public getZIndex(dialog: Dialog): number {
            let idx = this.dialogs.indexOf(dialog);
            if (idx === -1) {
                throw new Error("Dialog is not added to this manager.");
            }

            return idx;
        }

        public bringToFront(dialog: Dialog): this {
            let idx = this.dialogs.indexOf(dialog);
            if (idx === -1) {
                throw new Error("Dialog is not added to this manager.");
            }

            this.dialogs.splice(idx, 1);
            this.dialogs.unshift(dialog);
            
            return this;
        }

        public isOnTop(dialog: Dialog): boolean {
            return this.dialogs.length && this.dialogs[0] === dialog;
        }

        public update(updateTime: number): void {
            let handleInput = true;
            let dialogsToUpdate = this.dialogs.slice();
            while (dialogsToUpdate.length) {
                var dialog = dialogsToUpdate[0];

                // if (handleInput) {
                //     handleInput = dialog.handleInput(updateTime);
                // } else {
                //     dialog.resetInput();
                // }

                dialog.update(updateTime);

                dialogsToUpdate.splice(0, 1);
            }
        }

        public draw(): void {
            this._context.restore();
            let dialogsToDraw = this.dialogs.slice().reverse();
            while (dialogsToDraw.length) {
                dialogsToDraw[0].draw(this._context);
                dialogsToDraw.splice(0, 1);
            }
        }
    }
}
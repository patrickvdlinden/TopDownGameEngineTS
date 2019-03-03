namespace Zaggoware.GameEngine.TopDown.Entities {
    import Keys = Input.Keys;
    import KeyboardState = Input.KeyboardState;
    import Keyboard = Input.Keyboard;

    export class Player implements IUpdatable, IDrawableWithContext {
        private viewport: Viewport;
        private camera: Camera;
        private _character: Character;
        private lastPressedMovementKeys: Keys[] = [];

        private get lastPressedMovementKey(): Keys {
            return this.lastPressedMovementKeys.length > 0 ? this.lastPressedMovementKeys[this.lastPressedMovementKeys.length - 1] : null;
        }

        public constructor(viewport: Viewport, camera: Camera) {
            this.viewport = viewport;
            this.camera = camera;

            // TODO: Refactor to previous-/currentState in update().
            Keyboard.addKeyDownHandler((key: Keys, keyboardState: KeyboardState) => {
                var moveKeys = [Keys.W, Keys.A, Keys.S, Keys.D];
                if (moveKeys.indexOf(key) !== -1) {
                    let idx = this.lastPressedMovementKeys.indexOf(key);
                    if (idx !== -1) {
                        this.lastPressedMovementKeys.splice(idx, 1);
                    }

                    this.lastPressedMovementKeys.push(key);
                }
            });

            // TODO: Refactor to previous-/currentState in update().
            Keyboard.addKeyUpHandler((key: Keys, keyboardState: KeyboardState) => {
                var moveKeys = [Keys.W, Keys.A, Keys.S, Keys.D];
                if (moveKeys.indexOf(key) !== -1) {
                    if (key === this.lastPressedMovementKey) {
                        this.lastPressedMovementKeys.pop();
                    } else {
                        let idx = this.lastPressedMovementKeys.indexOf(key);
                        if (idx !== -1) {
                            this.lastPressedMovementKeys.splice(idx, 1);
                        }
                    }
                }
            });
        }

        public get character(): Character {
            return this._character;
        }

        public set character(entity: Character) {
            this._character = entity;
        }

        public get x(): number {
            return this._character ? this._character.x : -1;
        }

        public set x(value: number) {
            if (!this._character) {
                return;
            }

            this._character.x = value;
        }

        public get y(): number {
            return this._character ? this._character.y : -1;
        }

        public set y(value: number) {
            if (!this._character) {
                return;
            }

            this._character.y = value;
        }

        public update(updateTime: number): void {
            if (!this._character) {
                return;
            }

            let prevKeyboard = Keyboard.previousState;
            let currentKeyboard = Keyboard.currentState;

            let isRunning = false;
            let shouldMove = false;

            this.character.state = CharacterStates.Standing;

            // TODO: Retrieve movement key bindings.
            //
            // Example:
            //
            // In initialize/constructor:
            // this.movementKeyBindings = UserSettings.instance.keyBindings.movement;
            //
            // In update:
            // if (this.movementKeyBindings.contains(this.lastPressedMovementKey)) {
            //     const moveDirection = <KeyAction>this.movementKeyBindings.actionForKey(this.lastPressedMovementKey);
            //     if (this.character.faceDirection !== this.moveToFaceDirectionMap[moveDirection]) {
            //         this.character.faceDirection = this.moveToFaceDirectionMap[moveDirection];
            //     }
            //
            //     shouldMove = true;
            // }
            //

            if (this.lastPressedMovementKey === Keys.S) {
                if (this.character.faceDirection !== FaceDirections.Down) {
                    this.character.faceDirection = FaceDirections.Down;
                }

                shouldMove = true;
            }

            if (this.lastPressedMovementKey === Keys.A) {
                if (this.character.faceDirection !== FaceDirections.Left) {
                    this.character.faceDirection = FaceDirections.Left;
                }

                shouldMove = true;
            }

            if (this.lastPressedMovementKey === Keys.W) {
                if (this.character.faceDirection !== FaceDirections.Up) {
                    this.character.faceDirection = FaceDirections.Up;
                }

                shouldMove = true;
            }

            if (this.lastPressedMovementKey === Keys.D) {
                if (this.character.faceDirection !== FaceDirections.Right) {
                    this.character.faceDirection = FaceDirections.Right;
                }

                shouldMove = true;
            }

            if (shouldMove && currentKeyboard.isKeyDown(Keys.Shift)) {
                isRunning = true;
            }

            this._character.update(updateTime);

            if (shouldMove) {
                this.character.move(updateTime, isRunning);
            }
        }

        public draw(context: CanvasRenderingContext2D): void {
            if (!this._character) {
                return;
            }

            context.save();
            this._character.draw(context);
            context.restore();
        }
    }
}
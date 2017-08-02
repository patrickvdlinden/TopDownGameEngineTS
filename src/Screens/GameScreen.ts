///<reference path="ScreenBase.ts" />

module Screens {
    export class GameScreen extends ScreenBase {
        protected backgroundLayerElement: HTMLCanvasElement;
        protected groundLayerElement: HTMLCanvasElement;
        protected objectEntityLayerElement: HTMLCanvasElement;
        protected itemLayerElement: HTMLCanvasElement;
        protected uiLayerElement: HTMLCanvasElement;

        protected backgroundLayer: CanvasRenderingContext2D;
        protected groundLayer: CanvasRenderingContext2D;
        protected objectEntityLayer: CanvasRenderingContext2D;
        protected itemLayer: CanvasRenderingContext2D;
        protected uiLayer: CanvasRenderingContext2D;

        private _camera: Camera;

        public constructor(game: Game, title: string = null) {
            super(game, "GameScreen", title);
        }

        public get camera(): Camera {
            return this._camera;
        }

        protected onInitialize() {
            this.backgroundLayerElement = this.createCanvasElement("BackgroundLayer", Settings.screenWidth, Settings.screenHeight);
            this.groundLayerElement = this.createCanvasElement("GroundLayer", Settings.screenWidth, Settings.screenHeight);
            this.objectEntityLayerElement = this.createCanvasElement("ObjectEntityLayer", Settings.screenWidth, Settings.screenHeight);
            this.itemLayerElement = this.createCanvasElement("ItemLayer", Settings.screenWidth, Settings.screenHeight);

            this.backgroundLayer = this.backgroundLayerElement.getContext("2d");
            this.groundLayer = this.groundLayerElement.getContext("2d");
            this.objectEntityLayer = this.objectEntityLayerElement.getContext("2d");
            this.itemLayer = this.itemLayerElement.getContext("2d");

            this._camera = new Camera();

            // draw background once.
            this.drawBackgroundLayer(this.backgroundLayer);
        }

        protected createCanvasElement(name: string, width: number, height: number): HTMLCanvasElement {
            var canvasElement = document.createElement("canvas");
            canvasElement.id = name;
            canvasElement.width = width;
            canvasElement.height = height;

            this.game.container.appendChild(canvasElement);

            return canvasElement;
        }

        protected onUpdate(lastUpdateTime: number) {
        }

        protected onDraw() {
            if (!this.isInitialized) {
                return;
            }
            
            this.drawGroundLayer(this.groundLayer);
            this.drawObjectEntitiesLayer(this.objectEntityLayer);
            this.drawItemLayer(this.itemLayer);
            this.drawUILayer(this.mainLayer);
        }

        protected drawBackgroundLayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.viewport.width, this.viewport.height);

            context.fillStyle = "red";
            context.fillRect(0, 0, this.viewport.width, this.viewport.height);
        }

        protected drawGroundLayer(context: CanvasRenderingContext2D) {
        }

        protected drawObjectEntitiesLayer(context: CanvasRenderingContext2D) {            
        }
        
        protected drawItemLayer(context: CanvasRenderingContext2D) {
        }

        protected drawUILayer(context: CanvasRenderingContext2D) {
            context.clearRect(0, 0, Settings.screenWidth, Settings.screenHeight);

            this.mainLayer.fillStyle = "#FFFFFF";
            this.mainLayer.fillText("Left Mouse: " + Input.Mouse.currentState.isLeftButtonPressed, 10, 10);
            this.mainLayer.fillText("Middle Mouse: " + Input.Mouse.currentState.isMiddleButtonPressed, 10, 30);
            this.mainLayer.fillText("Right Mouse: " + Input.Mouse.currentState.isRightButtonPressed, 10, 50);
            this.mainLayer.fillText("Focused control: " + (this.controlManager.focusedControl ? this.controlManager.focusedControl.text : ""), 10, 80);
        }
    }
}
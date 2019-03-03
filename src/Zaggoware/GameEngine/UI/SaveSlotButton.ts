namespace Zaggoware.GameEngine.UI {
    export class SaveSlotButton extends Button {
        public location: string;
        public characterName: string;
        public characterLevel: number;
        public timePlayed: number;
        public progress: number;

        public constructor() {
            super();

            this.autoSize = false;
            this.bounds = new Rectangle(0, 0, 350, 200);
        }

        protected onInitialize(): void {
            super.onInitialize();
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            super.onDraw(context);
        }

        protected drawText(context: CanvasRenderingContext2D) {
            if (!this.location || this.location.length === 0) {
                this.textAlign = TextAligns.Center;
                this.textSize = 48;
                super.drawText(context);
                return;
            }

            context.textBaseline = TextBaselines.Top;
            context.textAlign = "left";
            context.fillStyle = "white";
            context.font = `24px ${this.fontFamily}`;
            // Don't call super.drawText

            // context.save();
            // context.beginPath();
            // context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
            // context.clip();
            // context.fillText(
            //     this.location,
            //     this.x + this.padding.left + 60,
            //     this.y + this.padding.top);
            // context.restore();
        }
    }
}
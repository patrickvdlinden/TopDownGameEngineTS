module SpritesheetBuilder {
    export enum DockMode {
        None = 0,
        Top = 1,
        Right = 2,
        Bottom = 4,
        Left = 8,
        CenterFill = 16
    }

    export class Pane {
        private _element: HTMLElement;
        private _title: string;
        private _dockMode: DockMode = DockMode.None;
        private _top: number;
        private _left: number;
        private _width: number;
        private _height: number;

        public constructor(title: string) {
            this._title = title;
        }

        public get isVisible(): boolean {
            return this._element && !this._element.classList.contains("hidden");
        }

        public show(): void {
            if (this._element && !this.isVisible) {
                this._element.classList.remove("pane--hidden");
            }
        }

        public hide(): void {
            if (this.isVisible) {
                this._element.classList.add("pane--hidden");
            }
        }
    }
}
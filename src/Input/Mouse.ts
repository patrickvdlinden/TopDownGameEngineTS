module Input {
    export class Mouse {
        private static container: HTMLElement;
        private static viewport: Viewport;
        private static _previousState: MouseState;
        private static _currentState: MouseState;
        private static lastKnownMousePosition: { x: number, y: number } = { x: -1, y: -1 };
        private static isLeftButtonPressed = false;
        private static isMiddleButtonPressed = false;
        private static isRightButtonPressed = false;
        
        public static hook(container: HTMLElement, viewport: Viewport) {
            this.container = container;
            this.viewport = viewport;

            container.onmousemove = this.onMouseMove;
            container.onmousedown = this.onMouseDown;
            container.onmouseup = this.onMouseUp;
            container.oncontextmenu = this.onContextMenu;
        }

        public static unhook() {
            this.container.onmousemove = null;
            this.container.onmousedown = null;
            this.container.onmouseup = null;
            this.container.oncontextmenu = null;
            this.container = null;
        }

        public static get previousState(): MouseState {
            return this._previousState;
        }

        public static get currentState(): MouseState {
            return this._currentState || new MouseState(0, 0, false, false, false);
        }

        public static updateState() {
            this._previousState = this.currentState;
            this._currentState = new Input.MouseState(
                this.lastKnownMousePosition.x - this.viewport.x,
                this.lastKnownMousePosition.y - this.viewport.y,
                this.isLeftButtonPressed,
                this.isMiddleButtonPressed,
                this.isRightButtonPressed
            );
        }

        private static onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();

            Mouse.lastKnownMousePosition = {
                x: ev.pageX - Mouse.container.offsetLeft,
                y: ev.pageY - Mouse.container.offsetTop
            };
        }

        private static onMouseDown = (ev: MouseEvent) => {
            ev.preventDefault();

            const buttonId = typeof ev.buttons !== "undefined" ? ev.buttons : (ev.which || ev.button);

            Mouse.isLeftButtonPressed = (buttonId & MouseButtons.Left) === MouseButtons.Left;
            Mouse.isMiddleButtonPressed = (buttonId & MouseButtons.Middle) === MouseButtons.Middle;
            Mouse.isRightButtonPressed = (buttonId & MouseButtons.Right) === MouseButtons.Right;
        }

        private static onMouseUp = (ev: MouseEvent) => {
            ev.preventDefault();

            const buttonId = typeof ev.buttons !== "undefined" ? ev.buttons : (ev.which || ev.button);

            Mouse.isLeftButtonPressed = (buttonId & MouseButtons.Left) === MouseButtons.Left;
            Mouse.isMiddleButtonPressed = (buttonId & MouseButtons.Middle) === MouseButtons.Middle;
            Mouse.isRightButtonPressed = (buttonId & MouseButtons.Right) === MouseButtons.Right;
        }

        private static onContextMenu = (ev: PointerEvent): boolean => {
            ev.preventDefault();

            return false;
        }
    }
}
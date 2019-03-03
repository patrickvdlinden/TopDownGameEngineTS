namespace Zaggoware.GameEngine.TopDown.Environment {
    export interface ITrigger {
        x: number;
        y: number;
        width: number;
        height: number;
        command: string;
    }
}
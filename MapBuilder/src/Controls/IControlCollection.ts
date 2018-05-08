module MapBuilder.Controls {
    export interface IControlCollection extends ArrayLike<IControl> {
        add(control: IControl): void;
        remove(control: IControl): void;
        contains(control: IControl): boolean;
        indexOf(control: IControl): number;
    }
}
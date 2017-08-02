module Screens {
    export interface IScreenComponent<T extends ScreenBase> extends IUpdatable, IDrawable {
        getScreen(): T
    }
}
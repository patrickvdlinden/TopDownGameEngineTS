namespace Zaggoware.GameEngine {
    export interface IEventHandler {
        (): void;
    }

    export interface IEventHandler1<T> {
        (arg: T): void;
    }

    export interface IEventHandler2<T1, T2> {
        (arg1: T1, arg2: T2): void;
    }

    export interface IEventHandler3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3): void;
    }

    export interface IEventHandler4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): void;
    }
}
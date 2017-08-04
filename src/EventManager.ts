interface IEventHandlerDictionay {
    [name: string]: Array<Function>;
}

class EventManager {
    private eventHandlers: IEventHandlerDictionay = {};

    public constructor(private sender: any) {
    }

    public registerEventHandler(name: string, handler: IEventHandler): void;
    public registerEventHandler<T1>(name: string, handler: IEventHandler1<T1>): void;
    public registerEventHandler<T1, T2>(name: string, handler: IEventHandler2<T1, T2>): void;
    public registerEventHandler<T1, T2, T3>(name: string, handler: IEventHandler3<T1, T2, T3>): void;
    public registerEventHandler<T1, T2, T3, T4>(name: string, handler: IEventHandler4<T1, T2, T3, T4>): void;
    public registerEventHandler(name: string, handler: Function): void {
        this.throwIfNotHandler(handler);

        if (!this.eventHandlers.hasOwnProperty(name)) {
            this.eventHandlers[name] = [];
        }

        var idx = this.eventHandlers[name].indexOf(handler);
        if (idx === -1) {
            this.eventHandlers[name].push(handler);
        }
    }

    public unregisterEventHandler(name: string, handler: IEventHandler): void;
    public unregisterEventHandler<T1>(name: string, handler: IEventHandler1<T1>): void;
    public unregisterEventHandler<T1, T2>(name: string, handler: IEventHandler2<T1, T2>): void;
    public unregisterEventHandler<T1, T2, T3>(name: string, handler: IEventHandler3<T1, T2, T3>): void;
    public unregisterEventHandler<T1, T2, T3, T4>(name: string, handler: IEventHandler4<T1, T2, T3, T4>): void;
    public unregisterEventHandler(name: string, handler: Function): void {
        this.throwIfNotHandler(handler);

        if (!this.eventHandlers.hasOwnProperty(name)) {
            return;
        }

        var idx = this.eventHandlers[name].indexOf(handler);
        if (idx !== -1) {
            this.eventHandlers[name].splice(idx, 1);
        }
    }

    public triggerEvent(name: string, ...args: any[]): void {
        if (Settings.isDebugModeEnabled) {
            console.log(name);
        }
        
        if (!this.eventHandlers.hasOwnProperty(name)) {
            return;
        }

        for (let i = 0; i < this.eventHandlers[name].length; i++) {
            if (args && args.length) {
                this.eventHandlers[name][i].apply(this.sender, args);
            } else {
                this.eventHandlers[name][i].apply(this.sender);
            }
        }
    }

    private throwIfNotHandler(handler: any): void {
        if (typeof(handler) !== "function") {
            throw new TypeError("Handler is not a function.");
        }
    }
}
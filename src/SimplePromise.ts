class SimplePromise<T> implements IPromise<T> {
    private state: PromiseStates = PromiseStates.Pending;
    private result: T;
    private errorReason: any;
    private onfulfill: (value?: T) => void;
    private onreject: (reason?: any) => void;
    
    public constructor(executor: (fulfill: (value?: T) => void, reject: (reason?: any) => void) => void) {
        executor(this.internalFulfill, this.internalReject);
    }

    public then(onfulfill: (value?: T) => void, onreject?: (reason?: any) => void): IPromise<T> {
        this.onfulfill = onfulfill;

        if (onreject) {
            this.onreject = onreject;
        }

        return this;
    }

    public fulfill(onfulfill: (value: T) => void): IPromise<T> {
        this.onfulfill = onfulfill;

        return this;
    }

    public reject(onreject?: (reason?: any) => void): IPromise<T> {
        this.onreject = onreject;

        if (this.state === PromiseStates.Rejected) {
            this.onreject(this.errorReason);
        }

        return this;
    }

    private internalFulfill = (result?: T) => {
        this.result = result;
        this.state = PromiseStates.Fulfilled;

        if (this.onfulfill) {
            this.onfulfill(result);
        }
    }

    private internalReject = (error: any) => {
        this.errorReason = error;
        this.state = PromiseStates.Rejected;

        if (this.onreject) {
            this.onreject(error);
        }
    }
}
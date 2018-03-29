interface IPromise<T> {
    then(onfulfill: (value?: T) => void, onreject?: (reason?: any) => void): IPromise<T>;
}
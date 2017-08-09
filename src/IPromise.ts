interface IPromise<T> {
    fulfill(onfulfill: (value?: T) => void): IPromise<T>;
    reject(onreject: (reason?: any) => void): IPromise<T>;
    then(onfulfill: (value?: T) => void, onreject?: (reason?: any) => void): IPromise<T>;
}
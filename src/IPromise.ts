interface IPromise<T> {
    success(onsuccess: (value?: T) => void): IPromise<T>;
    fail(onfail: (reason?: any) => void): IPromise<T>;
    done(onsuccess: (value?: T) => void, onfail?: (reason?: any) => void): IPromise<T>;
}
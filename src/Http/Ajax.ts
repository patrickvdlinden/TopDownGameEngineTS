module Http {
    enum AjaxPromiseStates {
        Pending = 0,
        Fulfilled = 1,
        Rejected = 2
    }

    export class AjaxPromise<T> implements IPromise<T> {
        private state: AjaxPromiseStates = AjaxPromiseStates.Pending;
        private result: T;
        private errorReason: any;
        private onsuccess: (value?: T) => void;
        private onfail: (reason?: any) => void;
        
        public constructor(executor: (fulfill: (value?: T) => void, reject: (reason?: any) => void) => void) {
            executor(this.fulfill, this.reject);
        }

        public done(onsuccess: (value?: T) => void, onfail?: (reason?: any) => void): IPromise<T> {
            this.onsuccess = onsuccess;

            if (onfail) {
                this.onfail = onfail;
            }

            return this;
        }

        public success(onsuccess: (value: T) => void): IPromise<T> {
            this.onsuccess = onsuccess;

            return this;
        }

        public fail(onfail?: (reason?: any) => void): IPromise<T> {
            this.onfail = onfail;

            if (this.state === AjaxPromiseStates.Rejected) {
                this.onfail(this.errorReason);
            }

            return this;
        }

        private fulfill = (result?: T) => {
            this.result = result;
            this.state = AjaxPromiseStates.Fulfilled;

            if (this.onsuccess) {
                this.onsuccess(result);
            }
        }

        private reject = (error: any) => {
            this.errorReason = error;
            this.state = AjaxPromiseStates.Rejected;

            if (this.onfail) {
                this.onfail(error);
            }
        }
    }

    export class Ajax {
        private static _asyncEnabled: boolean = true;
        private static xmlHttpVersionCache: string;

        public static get asyncEnabled(): boolean {
            return this._asyncEnabled;
        }

        public static set asyncEnabled(flag: boolean) {
            this._asyncEnabled = flag;
        }

        public static send<TResult>(url: string, method: string, data: string): AjaxPromise<TResult> {
            return new AjaxPromise((fulfill: (value?: TResult) => void, reject: (reason?: any) => void) => {
                let request = this.createRequest();
                request.open(method, url, this.asyncEnabled);
                request.onload = () => {
                    var result = JSON.parse(request.responseText);
                    // TODO: convert to result object.
                    fulfill(result);
                };
                request.onerror = (ev: ErrorEvent) => {
                    reject(ev.error);
                };
                request.send(data);
            });
        }

        public static get<TResult>(url: string, data?: any): AjaxPromise<TResult> {
            let query = this.buildQuery(data);
        
            return this.send(url + (query.length > 0 ? "?" + query.join("&") : ""), "GET", null);
        }

        public static post<TResult>(url: string, data: any): AjaxPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "POST", query.join("&"));
        }

        public static put<TResult>(url: string, data: any): AjaxPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "PUT", query.join("&"));
        }

        public static delete<TResult>(url: string, data: any): AjaxPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "DELETE", query.join("&"));
        }

        private static createRequest(): XMLHttpRequest {
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            }

            throw new Error("XMLHttpRequest is not supported.");
            // if (this.xmlHttpVersionCache !== null) {
            //     return new ActiveXObject(this.xmlHttpVersionCache);
            // }

            // let versions = [
            //     "MSXML2.XmlHttp.6.0",
            //     "MSXML2.XmlHttp.5.0",
            //     "MSXML2.XmlHttp.4.0",
            //     "MSXML2.XmlHttp.3.0",
            //     "MSXML2.XmlHttp.2.0",
            //     "Microsoft.XmlHttp"
            // ];
            // let xhr: ActiveXObject = null;
            // let version: string = null;

            // for (let i = 0; i < versions.length; i++) {
            //     try {
            //         xhr = new ActiveXObject(versions[i]);
            //         version = versions[i];
            //         break;
            //     } catch (e) {
            //         xhr = null;
            //         version = null;
            //     }
            // }

            // if (xhr !== null) {
            //     this.xmlHttpVersionCache = version;
            // } else {
            //     throw new Error("AJAX is not supported.");
            // }

            // return xhr;
        }

        private static buildQuery(data: any): Array<string> {
            let query = [];
            for (var key in data) {
                if (!data.hasOwnProperty(key)) {
                    continue;
                }

                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }

            return query;
        }
    }
}
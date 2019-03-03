namespace Zaggoware.GameEngine.Http {
    export class Ajax {
        private static _asyncEnabled: boolean = true;
        private static xmlHttpVersionCache: string;

        public static get asyncEnabled(): boolean {
            return this._asyncEnabled;
        }

        public static set asyncEnabled(flag: boolean) {
            this._asyncEnabled = flag;
        }

        public static send<TResult>(url: string, method: string, data: string): IPromise<TResult> {
            return new SimplePromise((fulfill: (value?: TResult) => void, reject: (reason?: any) => void) => {
                let request = this.createRequest();
                request.open(method, url, this.asyncEnabled);
                request.onload = () => {
                    var result = JSON.parse(request.responseText);
                    // TODO: convert to result object.
                    fulfill(result);
                };
                request.onerror = (ev) => {
                    return reject(ev.message || ev);
                };
                request.send(data);
            });
        }

        public static get<TResult>(url: string, data?: any): IPromise<TResult> {
            let query = this.buildQuery(data);
        
            return this.send(url + (query.length > 0 ? "?" + query.join("&") : ""), "GET", null);
        }

        public static post<TResult>(url: string, data: any): IPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "POST", query.join("&"));
        }

        public static put<TResult>(url: string, data: any): IPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "PUT", query.join("&"));
        }

        public static delete<TResult>(url: string, data: any): IPromise<TResult> {
            let query = this.buildQuery(data);

            return this.send(url, "DELETE", query.join("&"));
        }

        private static createRequest(): XMLHttpRequest {
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            }

            throw new Error("XMLHttpRequest is not supported.");
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
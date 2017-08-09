///<reference path="ScreenBase.ts" />

module Screens {
    export interface IBackgroundLoadAction {
        (reporter: BackgroundProgressReporter, model: any): any;
    }

    export class BackgroundProgressReporter {
        public constructor(private loadingScreen: LoadingScreen, private onreject: (reason?: any) => void, private taskStatuses: Array<boolean>, private taskIndex: number) {
        }

        public reportProgress(percentage: number, description: string) {
            this.loadingScreen.percentage = Math.max(0, Math.min(100, percentage));
            this.loadingScreen.description = description;
        }

        public reportCompleted() {
            this.taskStatuses[this.taskIndex] = true;
        }

        public reportError(error: any) {
            console.error(error);
            this.onreject(error);
        }
    }

    export class LoadingScreen extends ScreenBase {
        private _runTasksParallel: boolean = true;
        private _backgroundTasks: Array<IBackgroundLoadAction> = [];
        private taskStatuses: Array<any> = [];
        private _percentage: number = 0;
        private _description: string = null;

        private red: number = 255;
        private green: number = 255;
        private blue: number = 255;
        private redDirection: number = -1;
        private greenDirection: number = -1;
        private blueDirection: number = -1;
        
        public constructor(game: Game) {
            super(game, "LoadingScreen");

            this.backgroundColor = "black";
        }

        public get runTasksParallel(): boolean {
            return this._runTasksParallel;
        }

        public set runTasksParallel(flag: boolean) {
            this._runTasksParallel = flag;
        }

        public get backgroundTasks(): Array<IBackgroundLoadAction> {
            return this._backgroundTasks;
        }

        public set backgroundTasks(tasks: Array<IBackgroundLoadAction>) {
            this._backgroundTasks = tasks;
        }

        public get percentage(): number {
            return this._percentage;
        }

        public set percentage(percentage: number) {
            this._percentage = percentage;
        }

        public get description(): string {
            return this._description;
        }

        public set description(description: string) {
            this._description = description;
        }

        public runInBackground<T = never>(models?: any[]): IPromise<T> {
            if (Settings.isDebugModeEnabled) {
                console.log("LoadingScreen: invoke runInBackground, models:", models);
            }

            return new SimplePromise((fulfill: (value?: T) => void, reject: (reason?: any) => void) => {
                setTimeout(() => {
                    if (Settings.isDebugModeEnabled) {
                        console.log("LoadingScreen: Starting all tasks, parallel:", this.runTasksParallel);
                    }

                    let currentTask = -1;
                    let checkStatusInterval = -1;
                    checkStatusInterval = setInterval(() => {
                        if ((currentTask === -1 || this.taskStatuses[currentTask] || this.runTasksParallel) && currentTask < this.backgroundTasks.length - 1) {
                            currentTask++;

                            const model = models && models[currentTask] ? models[currentTask] : undefined;
                            let reporter = new BackgroundProgressReporter(this, reject, this.taskStatuses, currentTask);

                            if (Settings.isDebugModeEnabled) {
                                console.log("LoadingScreen: Starting task with index:", currentTask);
                            }

                            if (this.runTasksParallel) {
                                // Scope-safe
                                setTimeout(
                                    ((t, r, m) => {
                                        return () => {
                                            try {
                                                this.backgroundTasks[t](r, m);
                                            } catch(e) {
                                                reject(e);
                                            }
                                        };
                                    })(currentTask, reporter, model),
                                    0);
                            } else {
                                try {
                                    this.backgroundTasks[currentTask](reporter, model);
                                } catch(e) {
                                    reject(e);
                                }
                            }
                        }

                        let tasksCompleted = 0;
                        for (let i = 0; i < this.backgroundTasks.length; i++) {
                            tasksCompleted += (this.taskStatuses[i] ? 1 : 0);
                        }

                        if (tasksCompleted === this.backgroundTasks.length) {
                            if (Settings.isDebugModeEnabled) {
                                console.log("LoadingScreen: All tasks are completed");
                            }

                            clearInterval(checkStatusInterval);
                            fulfill();
                        }
                    });
                });
            });
        }

        protected onInitialize(): void {
        }
        
        protected onUpdate(lastUpdateTime: number): void {
            lastUpdateTime = 1;

            if (this.redDirection < 0) {
                this.red -= 1 * lastUpdateTime;

                if (this.red <= 0) {
                    this.redDirection = 1;
                    this.red = 0;
                }
            } else {
                this.red += 1 * lastUpdateTime;

                if (this.red >= 255) {
                    this.redDirection = -1;
                    this.red = 255;
                }
            }

            if (this.greenDirection < 0) {
                this.green -= 2 * lastUpdateTime;

                if (this.green <= 0) {
                    this.greenDirection = 1;
                    this.green = 0;
                }
            } else {
                this.green += 2 * lastUpdateTime;

                if (this.green >= 255) {
                    this.greenDirection = -1;
                    this.green = 255;
                }
            }

            if (this.blueDirection < 0) {
                this.blue -= 3 * lastUpdateTime;

                if (this.blue <= 0) {
                    this.blueDirection = 1;
                    this.blue = 0;
                }
            } else {
                this.blue += 3 * lastUpdateTime;

                if (this.blue >= 255) {
                    this.blueDirection = -1;
                    this.blue = 255;
                }
            }
        }

        protected onDraw(context: CanvasRenderingContext2D): void {
            const text1 = "Loading...";
            let text2 = "";

            if (this._percentage) {
                text2 += ` ${this._percentage}%`;
            }

            if (this._description) {
                text2 += ` (${this._description})`;
            }

            if (text2) {
                text2 = text2.substr(1);
            }

            context.fillStyle = `rgb(${Math.round(this.red)}, ${Math.round(this.green)}, ${Math.round(this.blue)})`;
            context.font = "24px Segoe UI";
            context.fillText(text1, 100, 100);
            context.fillText(text2, 100, 130);
        }
    }
}
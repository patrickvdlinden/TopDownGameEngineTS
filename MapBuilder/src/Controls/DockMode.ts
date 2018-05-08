module MapBuilder.Controls {
    export enum DockMode {
        None = 0,
        Top = 1,
        Right = 2,
        Bottom = 4,
        Left = 8,
        All = (Top | (Right | (Bottom | Left)))
    }

    export class DockModeStringHelper {
        public static toString(dockMode: DockMode): string {
            let string = "";

            if (dockMode === DockMode.None) {
                return DockMode[DockMode.None];
            }

            if (typeof DockMode[dockMode] === "undefined") {
                let strings = [];

                if ((dockMode & DockMode.Top) === DockMode.Top) {
                    strings.push(DockMode[DockMode.Top]);
                }

                if ((dockMode & DockMode.Right) === DockMode.Right) {
                    strings.push(DockMode[DockMode.Right]);
                }

                if ((dockMode & DockMode.Bottom) === DockMode.Bottom) {
                    strings.push(DockMode[DockMode.Bottom]);
                }

                if ((dockMode & DockMode.Left) === DockMode.Left) {
                    strings.push(DockMode[DockMode.Left]);
                }

                string = strings.join(" ");
            } else {
                // TODO: join dockMode's to string.
                return DockMode[dockMode].toLowerCase();
            }

            return string;
        }
    }
}
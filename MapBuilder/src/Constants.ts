module MapBuilder {
    export class Constants {
        public static ResourcesPath = "Resources";
        public static TexturesPath = Constants.ResourcesPath + "/Textures";
        public static MapsPath = Constants.ResourcesPath + "/Maps";
        
        public static zoomScales: number[] = [
            0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.14, 0.15,
            0.17, 0.19, 0.21, 0.24, 0.27, 0.3, 0.34, 0.38, 0.42, 0.47, 0.53, 0.59, 0.66, 0.75,
            0.85, 1, 1.125, 1.25, 1.4, 1.6, 1.8, 2, 2.25, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 15, 17, 19, 21, 24, 27, 30, 32
        ];
    }
}
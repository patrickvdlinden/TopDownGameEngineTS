module Environment {
    export class MapLoader {
        public static load(name: string): IPromise<IMap> {
            return Http.Ajax.get(name + ".json");
        }
    }
}
module IO {
    export interface ISave {
        location: string;
        characterName: string;
        characterLevel: number;
        timePlayed: number;
        progress: number;
        saveDate: Date;
    }
}
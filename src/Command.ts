abstract class Command {
    private _name: string;

    protected constructor(name: string) {
        this._name = name;        
    }

    public get name(): string {
        return this._name;
    }

    public abstract execute(game: Game, args: string[]): void;
}
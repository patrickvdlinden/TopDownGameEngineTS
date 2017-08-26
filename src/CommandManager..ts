class CommandManager {
    private _commands: Array<Command> = [];

    public constructor(private game: Game) {
    }

    public register(command: Command): void {
        this._commands.push(command);
    }

    public unregister(command: Command): void {
        const index = this._commands.indexOf(command);
        if (index !== -1) {
            this._commands.splice(index, 1);
        }
    }

    public execute(commandString: string): void {
        if (!commandString) {
            throw new Error("commandString cannot be empty.");
        }

        const parts = commandString.split(" ");
        const commandName = parts[0];
        const args = parts.length > 1 ? parts.slice(1) : [];

        for (let i = 0; i < this._commands.length; i++) {
            let command = this._commands[i];
            if (command.name === commandName) {
                command.execute(this.game, args);
                return;
            }
        }

        throw new Error("Command not found: "+ commandName);
    }

    public tryExecute(commandString: string): boolean {
        if (!commandString) {
            return false;
        }
        
        const parts = commandString.split(" ");
        const commandName = parts[0];
        const args = parts.length > 1 ? parts.slice(1) : [];

        for (let i = 0; i < this._commands.length; i++) {
            let command = this._commands[i];
            if (command.name === commandName) {
                command.execute(this.game, args);
                return true;
            }
        }

        return false;
    }
}
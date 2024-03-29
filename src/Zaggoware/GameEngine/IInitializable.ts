namespace Zaggoware.GameEngine {
    export interface IInitializable {
        isInitialized: boolean;
        
        initialize(): void;
        uninitialize(): void;
    }
}
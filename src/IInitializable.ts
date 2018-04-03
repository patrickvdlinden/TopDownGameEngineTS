interface IInitializable {
    isInitialized: boolean;
    
    initialize(): void;
    uninitialize(): void;
}
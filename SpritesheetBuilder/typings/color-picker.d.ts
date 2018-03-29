declare class CP {
    public static __instance__: CP[];

    public target: Element;
    public picker: Element;
    public visible: boolean;

    constructor(node: Element);
    constructor(node: Element, events: string);
    constructor(node: Element, enabled: boolean);
    constructor(node: Element, events: string, enabled: boolean);

    /**
     * Converts specified HSV-color to RGB-color.
     * @param hsv Array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     * @returns An array of numbers containing the RGB-color: [0] = Red, [1] = Green, [2] = Blue.
     */
    public static HSV2RGB(hsv: number[]): number[];

    /**
     * Converts specified HSV-color to HEX-color.
     * @param hsv Array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     * @returns A HEX-color string without the # (hash).
     */
    public static HSV2HEX(hsv: number[]): string;

    /**
     * Converts specified RGB-color to HSV-color.
     * @param rgb Array of numbers containing the RGB-color: [0] = Red, [1] = Green, [2] = Blue.
     * @returns An array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     */
    public static RGB2HSV(rgb: number[]): number[];

    /**
     * Converts specified RGB-color to HEX-color.
     * @param rgb Array of numbers containing the RGB-color: [0] = Red, [1] = Green, [2] = Blue.
     * @returns A HEX-color string without the # (hash).
     */
    public static RGB2HEX(rgb: number[]): string;

    /**
     * Converts specified HEX-color to HSV-color.
     * @param hex A HEX-color string without the # (hash).
     * @returns An array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     */
    public static HEX2HSV(hex: string): number[];

    /**
     * Converts specified HEX-color to RGB-color.
     * @param hex A HEX-color string without the # (hash).
     * @returns An array of numbers containing the RGB-color: [0] = Red, [1] = Green, [2] = Blue.
     */
    public static HEX2RGB(hex: string): number[];

    /**
     * Cycle through all CP instances.
     * @param callback Callback for each CP instance.
     */
    public static each(callback: ($: CP) => void): void;

    /**
     * Parses the raw color string to HSV-color.
     * @param colorString The raw color string. For example: 'rgba(255, 255, 255)'.
     * @returns An array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     */
    public static parse(colorString: any): number[];

    /**
     * Adds an event hook with specified handler.
     * @param event The event name.
     * @param listener The event listener.
     * @returns The current color picker instance.
     */
    public on(event: string, listener: Function): CP;
    
    /**
     * Adds an event hook with specified handler and identifier.
     * @param event The event name.
     * @param listener The event listener.
     * @param id The identifier.
     * @returns The current color picker instance.
     */
    public on(event: string, listener: Function, id: string): CP;

    /**
     * Removes all hooks from specified event.
     * @param event The event name.
     * @returns The current color picker instance.
     */
    public off(event: string): CP;

    /**
     * Removes all hooks from specified event with specified identifier.
     * @param event The event name.
     * @param id The identifier.
     * @returns The current color picker instance.
     */
    public off(event: string, id: string): CP;

    /**
     * Triggers an event and all its attached hooks.
     * @param event The event name.
     * @param args The arguments to pass to the event.
     * @param id The identifier.
     * @returns The current color picker instance.
     */
    public trigger(event: string, args?: any[], id?: string): CP;

    /**
     * Gets hidden color data from the target element.
     * @param key The custom color data key.
     */
    public get(key: string): any;

    /**
     * Sets custom color data to the target element.
     * @param hsv Array of numbers containing the HSV-color: [0] = Hue, [1] = Saturation, [2] = Value.
     */
    public set(hsv: number[]): any;

    /**
     * Sets custom color data to the target element.
     * @param colorString The raw color string. For example: 'rgba(255, 255, 255)'.
     */
    public set(colorString: string): any;

    /**
     * Sets custom color data to the target element.
     * @param color The custom color data.
     */
    public set(color: any): any;

    /**
     * Returns all event hooks currently attached to the color picker.
     */
    public hooks(): any;

    public create(): CP;

    public destroy(): CP;

    /**
     * Shows the color picker.
     * @returns The current color picker instance.
     */
    public enter(): CP;

    /**
     * Hides the color picker.
     * @returns The current color picker instance.
     */
    public exit(): CP;

    /**
     * Fits the color picker to the visible area in window.
     * @returns The current color picker instance.
     */
    public fit(): CP;

    /**
     * Fits the color picker to the visible area in window with specified offset.
     * @param offsetXY Array with numbers containing the XY-offset: [0] = X, [1] = Y.
     * @returns The current color picker instance.
     */
    public fit(offsetXY: number[]): CP;
}
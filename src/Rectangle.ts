class Rectangle {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _right: number;
    private _bottom: number;
    private _centerX: number;
    private _centerY: number;

    public constructor();
    public constructor(x: number, y: number);
    public constructor(x: number, y: number, width: number, height: number);
    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.update(x, y, width || 0, height || 0);
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get left(): number {
        return this._x;
    }

    public get right(): number {
        return this._right;
    }

    public get bottom(): number {
        return this._bottom;
    }

    public get centerX(): number {
        return this._centerX;
    }

    public get centerY(): number {
        return this._centerY;
    }

    public update(x: number, y: number): this;
    public update(x: number, y: number, width: number, height: number): this;
    public update(x: number, y: number, width: number = 0, height: number = 0): this {
        this._x = x || 0;
        this._y = y || 0;
        this._width = width || this._width;
        this._height = height || this._height;
        this._right = this._x + this._width;
        this._bottom = this.y + this._height;
        this._centerX = this._width / 2;
        this._centerY = this._height / 2;

        return this;
    }

    public isInBounds(x: number, y: number): boolean {
        return x >= this.x && y >= this.y && x <= this.right && y <= this.bottom;
    }

    public collides(rectangle: Rectangle): boolean {
        // TODO:
        return false;
    }
}
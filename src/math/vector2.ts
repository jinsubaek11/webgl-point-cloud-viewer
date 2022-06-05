
export default class Vector2 {
	private _x: number
	private _y: number

	public constructor(x:number=0, y:number=0) {
		this._x = x
		this._y = y
	}

	public get x():number {
		return this._x
	}

	public get y():number {
		return this._y
	}

	public set x(x:number) {
		this._x = x
	}

	public set y(y:number) {
		this._y = y
	}

    public subtract = (a:Vector2): Vector2 => {
        this._x -= a.x
        this._y -= a.y
        
        return this
    }

	public toArray():number[] {
		return [this._x, this._y]
	}
}
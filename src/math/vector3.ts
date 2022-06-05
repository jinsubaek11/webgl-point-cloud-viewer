import Quaternion from "./quaternion"

export default class Vector3 {
	private _x: number
	private _y: number
	private _z: number

	public constructor(x:number=0, y:number=0, z:number=0) {
		this._x = x
		this._y = y
		this._z = z
	}

	public get x():number {
		return this._x
	}

	public get y():number {
		return this._y
	}

	public get z():number {
		return this._z
	}

	public set x(x:number) {
		this._x = x
	}

	public set y(y:number) {
		this._y = y
	}

	public set z(z:number) {
		this._z = z
	}

    public subtract = (a:Vector3): Vector3 => {
        this._x -= a.x
        this._y -= a.y
        this._z -= a.z
        
        return this
    }

    public getLength():number {
        const x = this._x
        const y = this._y
        const z = this._z

        const length = Math.sqrt(x*x + y*y + z*z)

        return length
    }

	public toArray():number[] {
		return [this._x, this._y, this._z]
	}

	public applyQuaternion(q:Quaternion):Vector3 {
		const x = this._x, y = this._y, z = this._z
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w

		const ix = qw * x + qy * z - qz * y
		const iy = qw * y + qz * x - qx * z
		const iz = qw * z + qx * y - qy * x
		const iw = -qx * x -qy * y - qz * z

		this._x = ix * qw + iw * -qx + iy * -qz -iz * -qy
		this._y = iy * qw + iw * -qy + iz * -qx -ix * -qz
		this._z = iz * qw + iw * -qz + ix * -qy -iy * -qx

		return this
	}
}
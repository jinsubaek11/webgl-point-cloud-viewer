import { degreeToRadian } from "./util"
import Vector3 from "./vector3"

export default class Quaternion {
	private _x: number
	private _y: number
	private _z: number
	private _w: number

	public constructor() {
		this._x = 0
		this._y = 0
		this._z = 0
		this._w = 0
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

	public get w():number {
		return this._w
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

	public set w(w:number) {
		this._w = w
	}

	public static axisToQuaternion(angle: number, vec: Vector3):Quaternion {
		const quatRotation = new Quaternion()
		const rad = degreeToRadian(angle)
		const sinA = Math.sin(rad/2)
		const length = vec.getLength()
		
		if (length < 0.00001) {
			return quatRotation
		}

		const nx = vec.x/length
		const ny = vec.y/length
		const nz = vec.z/length

		quatRotation.x = nx * sinA
		quatRotation.y = ny * sinA
		quatRotation.z = nz * sinA
		quatRotation.w = Math.cos(rad/2)

		return quatRotation
	}
}
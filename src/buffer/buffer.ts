import GlUtilities from "../utilities/gl"

export default class Buffer {
	private _gl: WebGLRenderingContext = GlUtilities.context
	private _buffer: WebGLBuffer = {}
	private _data: ArrayBuffer = new Float32Array
	private _targetBufferType:number 
	private _elementSize: number
	private _dataType: number
	private _typeSize: number
	private _normalized: boolean
	private _offset: number
	private _stride: number

	public constructor(
		data:number[], elementSize: number, dataType:number = GlUtilities.context.FLOAT, 
		normalized: boolean = false, targetBufferType: number = GlUtilities.context.ARRAY_BUFFER, offset:number = 0
		) {
		const gl = this._gl
		this._elementSize = elementSize
		this._dataType = dataType
		this._targetBufferType = targetBufferType
		this._normalized = normalized
		this._offset = offset

		switch (dataType) {
			case gl.FLOAT:
				this._data = new Float32Array(data)
				this._typeSize = 4
				break;
			case gl.INT:
				this._data = new Int32Array(data)
				this._typeSize = 4
				break;
			case gl.UNSIGNED_INT:
				this._data = new Uint32Array(data)
				this._typeSize = 4
				break;
			case gl.SHORT:
				this._data = new Int16Array(data)
				this._typeSize = 2
				break;
			case gl.UNSIGNED_SHORT:
				this._data = new Uint16Array(data)
				this._typeSize = 2
				break;
			case gl.BYTE:
				this._data = new Int8Array(data)
				this._typeSize = 1
				break;
			case gl.UNSIGNED_BYTE:
				this._data = new Uint8Array(data)
				this._typeSize = 1
				break
			default:
				throw new Error(`Unrecognize data type ${dataType}`)		
		}
		this._stride = this._elementSize * this._typeSize

		this.create()
	}

	public get elementSize(): number {
		return this._elementSize
	}

	public get dataType(): number {
		return this._dataType
	}

	public get normalized(): boolean {
		return this._normalized
	}

	public get stride(): number {
		return this._stride
	}

	public get offset(): number {
		return this._offset
	}

	public get buffer(): WebGLBuffer {
		return this._buffer
	}

	private create():void {
		const gl = this._gl
		const buffer = gl.createBuffer()
		gl.bindBuffer(this._targetBufferType,buffer)
		gl.bufferData(this._targetBufferType, this._data, gl.STATIC_DRAW)

		gl.bindBuffer(this._targetBufferType, null)

		if (buffer) {
			this._buffer = buffer
		}
	}

	public bind():void {
		const gl = this._gl

		gl.bindBuffer(this._targetBufferType, this._buffer)
	}

}
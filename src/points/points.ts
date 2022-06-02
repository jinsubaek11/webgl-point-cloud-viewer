import Program from "../program/program"
import Buffer from '../buffer/buffer'
import GlUtilities from "../utilities/gl"

interface BufferInfo {
	[name:string]: Buffer
}

export default class Points {
	private _gl: WebGLRenderingContext = GlUtilities.context
	// private _data: number[]
	private _position: number[] = []
	private _intensity: number[] = []
	private _color: number[]  = []
	private _bufferInfo: BufferInfo
	private _uniformInfo: any 
	private _programInfo: Program
	private _mode: number
	
	public constructor(program: Program, data:number[], mode:number=GlUtilities.context.POINTS) {
		const gl = this._gl
		this._mode = mode
		// this._data = data

		this.seperateData(data)

		this._programInfo = program
		this._bufferInfo = {
			aPosition: new Buffer(this._position, 3, gl.FLOAT),
			aIntensity: new Buffer(this._intensity, 1, gl.FLOAT),
			aColor: new Buffer(this._color, 3, gl.UNSIGNED_BYTE, true)
		}
		this._uniformInfo = {}
	}

	private seperateData(data:number[]):void {
		const elementSize = 7

		for (let i = 0; i < data.length; i+=elementSize) {
			this._position.push(data[0+i],data[1+i],data[2+i])
			this._intensity.push(data[3+i])
			this._color.push(data[4+i],data[5+i],data[6+i])
		}
	}

	public setAttributes():void {
		const gl = this._gl
		
		for (const attributeName in this._programInfo.attributeInfo) {
			const index = this._programInfo.attributeInfo[attributeName]
			const size = this._bufferInfo[attributeName].elementSize
			const type = this._bufferInfo[attributeName].dataType
			const normalized = this._bufferInfo[attributeName].normalized
			const stride = this._bufferInfo[attributeName].stride
			const offset = this._bufferInfo[attributeName].offset

			this._bufferInfo[attributeName].bind()
			gl.enableVertexAttribArray(index)
			gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
		}
	}	

	public drawObject():void {
		const gl = this._gl
		const positionBuffer = this._bufferInfo.aPosition
		
		// this._programInfo.use()
		positionBuffer.bind()
		gl.drawArrays(this._mode, 0, this._position.length / positionBuffer.elementSize)
	}
}
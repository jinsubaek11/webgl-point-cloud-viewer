import GlUtilities from "../utilities/gl"
import Shader from "../shaders/shader"

type AttributeInfo = {[name:string]:number}
type UniformInfo = {[name:string]: WebGLUniformLocation }

export default class Program {
	private _gl: WebGLRenderingContext = GlUtilities.context
	private _vertexShader: WebGLShader
	private _fragmentShader: WebGLShader
	private _program: WebGLProgram = {}
	private _attributes: AttributeInfo = {}
	private _uniforms: UniformInfo = {}

	public constructor(vertexSource:string, fragmentSource:string) {
		if (!vertexSource || !fragmentSource) {
			throw new Error("Shader source is required")
		}

		this._vertexShader = Shader.create(vertexSource, this._gl.VERTEX_SHADER)
		this._fragmentShader = Shader.create(fragmentSource, this._gl.FRAGMENT_SHADER)

		this.initialize()
		this.detectAttributes()
		this.detectUniforms()
	}

	public get attributeInfo(): AttributeInfo {
		return this._attributes
	}

	public get uniformInfo(): UniformInfo {
		return this._uniforms
	}

	public use() {
		const gl = this._gl

		gl.useProgram(this._program)
	}

	private initialize() {
		const gl = this._gl

		const program = gl.createProgram()

		if (!program) {
			throw new Error('Failed create program')
		}

		gl.attachShader(program, this._vertexShader)
		gl.attachShader(program, this._fragmentShader)

		gl.linkProgram(program)

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error("Failed link program")
		}

		this._program = program
	}

	private detectAttributes() {
		const gl = this._gl

		const attribCounts = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES)

		for (let i = 0; i < attribCounts; i++) {
			const info = gl.getActiveAttrib(this._program, i)

			if (!info) break;

			this._attributes[info.name] = gl.getAttribLocation(this._program, info.name)
		}
	}

	private detectUniforms() {
		const gl = this._gl

		const uniformCounts = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS)

		for (let i = 0; i < uniformCounts; i++) {
			const info = gl.getActiveUniform(this._program, i)
			
			if (!info) break;
			
			const location = gl.getUniformLocation(this._program, info.name)

			if (location) {
				this._uniforms[info.name] = location
			}
		}
	}
}

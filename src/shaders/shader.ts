import GlUtilities from "../utilities/gl"

export default class Shader {
	public static create(source: string, type:number):WebGLShader {
		const gl = GlUtilities.context
		const shader = gl.createShader(type)

		if (!shader) {
			throw new Error("Failed create shader")
		}

		gl.shaderSource(shader, source)
		gl.compileShader(shader)

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw new Error(`Failed compile  ${type} shader`)
		}

		return shader
	}
}
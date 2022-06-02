
import { veretxSource } from './shaders/sources/vertexSource';
import { fragmentSource } from './shaders/sources/fragmentSource';
import GlUtilities from './utilities/gl';
import './style.css';
import Program from './program/program';
import Points from './points/points';
import { getData } from './utilities/util';



class App {
	private _gl: WebGLRenderingContext
	private _program: Program
	private _objects: Points[] = []

	public constructor() {
		this._gl = GlUtilities.context
		this._program = new Program(veretxSource, fragmentSource)
		this._objects = []

		this.setTestData()
	}

	public get objects():Points[] {
		return this._objects
	}

	public setTestData() {
		const interval = setInterval(() => {
			console.log(this._objects.length)

			if (this._objects.length === 10) clearTimeout(interval)

			this.updateObjects(new Points(this._program, getData()))
		},500)
	}

	public updateObjects(points: Points) {
		this._objects.push(points)
	}

	public start():void {
		this.loop()
	}


	private loop():void {
		const gl = this._gl

		gl.viewport(0,0,gl.canvas.clientWidth, gl.canvas.clientHeight)
		gl.clearColor(0,0,0,1)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	
		this._program.use()

		this._objects.forEach(obj => {
			obj.setAttributes()
			obj.drawObject()
		})	
		requestAnimationFrame(this.loop.bind(this))
	}
}

const app = new App()
app.start()


// const interval = setInterval(() => {
// 	console.log(app.objects.length)
// 	if (app.objects.length === 10) clearTimeout(interval)

// 	app.updatePoints()
// 	objects.push(new Points(program, getData()))
// },100)

 







// const objects = Array(500).fill(0).map(v => new SimObject(program, getData()))
// const obj1 = new SimObject(program, [
// 	-0.5, 0, 0,0,123,142,233,
// 	-0.3, 0.3, 0,0,113,42,133,
// 	 0, 0, 0,0,223,242,133,
// ], gl.TRIANGLES)
// const obj2 = new SimObject(program, [
// 	0.5, 0, 0,0,23,22,13,
// 	0.3, 0.3, 0,0,123,142,233,
// 	0, 0, 0,0,123,142,133,
// ],gl.TRIANGLES)
// console.log(program.attributeInfo, program.uniformInfo)
// console.log(objects)

// const draw = () => {
// 	resize()
// 	gl.clearColor(0,0,0,1)
// 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
// 	gl.viewport(0,0,gl.canvas.clientWidth, gl.canvas.clientHeight)
	
// }

// draw()


// interface PointDataType {
// 	x: string;
// 	y: string;
// 	z: string;
// 	i: string;
// 	r: string;
// 	g: string;
// 	b: string;
// }

// const pointData: PointDataType[] = [];

// // fetch('/points/bildstein_station1_xyz_intensity_rgb.txt')
// fetch('/points/test.txt')
// 	.then((res) => {
// 		const reader = res.body?.getReader();
// 		return new ReadableStream({
// 			start(controller) {
// 				return pump();
// 				function pump() {
// 					return reader?.read().then(({ done, value }) => {
// 						if (done) {
// 							controller.close();
// 							return;
// 						}

// 						controller.enqueue(value);
// 						return pump();
// 					});
// 				}
// 			},
// 		});
// 	})
// 	.then((stream) => new Response(stream))
// 	.then((response) => response.blob())
// 	.then((blob) => blob.text())
// 	.then((data) => {
// 		parseTxt(data);
// 		console.log(pointData);
// 	});

// 	let testData:number[];

// function parseTxt(data: string) {
// 	const dataArr = data
// 		.split(' ')
// 		.map((v) => {
// 			if (v.includes('\r\n')) {
// 				return v.split('\r\n');
// 			}
			
// 			// if (v.includes('\r')) {
// 			// 	return v.split('\r');
// 			// }

// 			return v;
// 		})
// 		.flat().map(v => Number(v));
// 		testData = dataArr
// 		loop()
// 	console.log(dataArr);

// 	for (let i = 0; i < dataArr.length; i += 7) {
// 		const obj = {
// 			x: dataArr[i],
// 			y: dataArr[i + 1],
// 			z: dataArr[i + 2],
// 			i: dataArr[i + 3],
// 			r: dataArr[i + 4],
// 			g: dataArr[i + 5],
// 			b: dataArr[i + 6],
// 		};

// 		pointData.push(obj);
// 	}
// }

// const app = new App()
// app.start()


// const canvas = document.querySelector('canvas')
// const gl = canvas?.getContext('webgl')
// gl.canvas.width = canvas.clientWidth
// gl.canvas.height = canvas.clientHeight

// if (!gl) {
// 	throw new Error('no webgl')
// }

// // const positions = [
// // 	// 40.,0.0,0.0, 
// // 	// 0.,80.,0.0, 
// // 	// -40.,0.0,0.0,
// // 	40.,0.0,0.0, 0,0,0,0,
// // 	0.,80.,0.0, 0,0,0,0,
// // 	-40.,0.0,0.0, 0,0,0,0,
// // ]

// const positions = Array(100000).fill(0).map(v => [
// 	(Math.random()-.5) * 2, (Math.random()-.5) * 2, (Math.random()-.5) * 2, 0, Math.random() * 255, Math.random() * 255,Math.random() * 255,
// ]).flat()

// // console.log(positions)
// const pointBuffer = gl.createBuffer()
// gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// const vertexShader = gl.createShader(gl.VERTEX_SHADER)
// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

// gl.shaderSource(vertexShader, veretxSource)
// gl.shaderSource(fragmentShader, fragmentSource)

// gl.compileShader(vertexShader)
// gl.compileShader(fragmentShader)

// if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
// 	throw new Error('Failed compile vertexShader')
// }

// if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
// 	throw new Error('Failed compile fragmentShader')
// }

// const program = gl.createProgram()

// gl.attachShader(program, vertexShader)
// gl.attachShader(program, fragmentShader)

// gl.linkProgram(program)

// if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
// 	throw new Error('Failed link program')
// }

// gl.enableVertexAttribArray(0)
// const aPosLocation = gl.getAttribLocation(program, 'aPosition')
// console.log(aPosLocation)
// gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 7*4,0)
// gl.enableVertexAttribArray(1)
// const aColorLocation = gl.getAttribLocation(program, 'aColor')
// gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, true, 7*4, 4)

// // gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
// // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// function loop() {

// 	gl.viewport(0,0,gl.canvas.width, gl.canvas.height)
// 	gl.clearColor(0,0,0,1)
// 	gl.clear(gl.COLOR_BUFFER_BIT)
	
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(testData), gl.STATIC_DRAW)
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
	
// 	gl.useProgram(program)
	
// 	gl.drawArrays(gl.POINTS, 0, positions.length/7)
// 	// gl.drawArrays(gl.POINTS, 0, 10000)

// 	requestAnimationFrame(loop)
// }

// loop()


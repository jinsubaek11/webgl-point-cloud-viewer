import EventListener from './eventListener/eventListener';
import Quaternion from './math/quaternion';
import Matrix4x4 from './math/matrix4x4';
import GlUtilities from './utilities/gl';
import Program from './program/program';
import Points from './points/points';
import Vector3 from './math/vector3';
import { fragmentSource } from './shaders/sources/fragmentSource';
import { veretxSource } from './shaders/sources/vertexSource';
import { cross, normalize,  } from './math/util';
import { getData } from './utilities/util';
import { parse } from 'pcd-format'
import './style.css';


const Float32ToHex = (float32:number) => {
    const getHex = (i:number) => ('00' + i.toString(16)).slice(-2);
    var view = new DataView(new ArrayBuffer(4))
    view.setFloat32(0, float32);
    return Array.apply(null, { length: 4 }).map((_, i) => getHex(view.getUint8(i))).join('');
}

interface Coordinates {
	x:number
	y:number
	z:number
}

class App {
	private _gl: WebGLRenderingContext
	private _program: Program
	private _objects: Points[] = []
	private _events: EventListener

	private _max: Coordinates = { x:Number.MIN_SAFE_INTEGER , y:Number.MIN_SAFE_INTEGER, z:Number.MIN_SAFE_INTEGER } 
	private _min: Coordinates = { x:Number.MAX_SAFE_INTEGER , y:Number.MAX_SAFE_INTEGER, z:Number.MAX_SAFE_INTEGER }
 
	public constructor() {
		this._gl = GlUtilities.context
		this._program = new Program(veretxSource, fragmentSource)
		this._events = new EventListener()

		this._objects = []
		this._events.bind()
		this.setTestData()
	}

	public get objects():Points[] {
		return this._objects
	}

	public setTestData():void {
		let num = 0;
		let j = 0
		// let i = 0;
		// for (let j = 1; j < 8; j++) {
			for (let i = 0; i < 11; i++) {
				fetch(`./pcd/tosca_hires/cat${i}.pcd`).then(res => res.arrayBuffer()).then(res => {
				// fetch(`./pcd/office/office${i}.pcd`).then(res => res.arrayBuffer()).then(res => {
				// fetch(`./pcd/hand_gestures/hand_${j}/image_000${i}.pcd`).then(res => res.arrayBuffer()).then(res => {
					const pcd = parse(res, false)

					for (let i = 0; i < pcd.points.length; i++) {
						const rgb = Number('0x' + Float32ToHex(pcd.points[i].rgb))
						const r = (rgb>>16) & 0x0000ff
						const g = (rgb>>8) & 0x0000ff
						const b = (rgb) & 0x0000ff
						
						pcd.points[i].r = r
						pcd.points[i].g = g
						pcd.points[i].b = b

						if (this._min.x > pcd.points[i].x ) {
							this._min.x = pcd.points[i].x
						}

						if (this._min.y > pcd.points[i].y ) {
							this._min.y = pcd.points[i].y
						}

						if (this._min.z > pcd.points[i].z ) {
							this._min.z = pcd.points[i].z
						}

						if (this._max.x < pcd.points[i].x ) {
							this._max.x = pcd.points[i].x
						}

						if (this._max.y < pcd.points[i].y ) {
							this._max.y = pcd.points[i].y
						}

						if (this._max.z < pcd.points[i].z ) {
							this._max.z = pcd.points[i].z
						}
					}

					this.updateObjects(new Points(this._program, pcd.points))
					num += this._objects[this._objects.length-1].positionLength
					console.log(num)
				}).catch(err => console.log(err))
			// }
		}
		// const interval = setInterval(() => {
		// 	if (this._objects.length === 5) clearTimeout(interval)

		// 	this.updateObjects(new Points(this._program, getData()))
		// },500)

		// const obj1 = new Points(this._program, [
		// 	-100, 0, 0,0,123,142,233,
		// 	-300, 300, 0,0,113,42,133,
		// 	 0, 0, 0,0,223,242,133,
		// ], this._gl.TRIANGLES)
		// const obj2 = new Points(this._program, [
		// 	500, 0, 0,0,23,22,13,
		// 	300, 300, 0,0,123,142,233,
		// 	0, 0, 0,0,123,142,133,
		// ],this._gl.TRIANGLES)

		// this.updateObjects(obj1)
		// this.updateObjects(obj2)
	}

	public updateObjects(points: Points):void {
		this._objects.push(points)
	}

	public start():void {
		this.loop()
		console.log(this._program.uniformInfo)
	}

	private loop():void {
		const gl = this._gl

		gl.viewport(0,0,gl.canvas.width, gl.canvas.height)
		gl.clearColor(0,0,0,1)

		gl.enable(gl.DEPTH_TEST)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		const midX = (this._max.x + this._min.x) * 0.5
		const midY = (this._max.y + this._min.y) * 0.5
		const midZ = (this._max.z + this._min.z) * 0.5
		// const camPos = new Vector3(0,0,1)
		const camPos = new Vector3(0,0,400)
		const target = new Vector3(0, 0, 0)
		const up = new Vector3(0,1,0)

		const qh = Quaternion.axisToQuaternion(-this._events.angles.horizontal, up)
		camPos.applyQuaternion(qh)

		const axisX = normalize(cross(camPos, up))

		const qv = Quaternion.axisToQuaternion(this._events.angles.vertical, axisX)
		camPos.applyQuaternion(qv)

		let camera = Matrix4x4.lookAt(camPos, target, up)
		camera = Matrix4x4.multiply(Matrix4x4.translation(0,0,midZ), camera)

		const defaultHalfScreenSize = this._max.x > this._max.y ? this._max.x * this._events.zoom : this._max.y * this._events.zoom

		let viewMatrix = Matrix4x4.inverse(camera)
		const projectionMatrix = Matrix4x4.orthograpic(
			-defaultHalfScreenSize, defaultHalfScreenSize, defaultHalfScreenSize, -defaultHalfScreenSize, 10, 2000)
		// const projectionMatrix = Matrix4x4.perspective(75, gl.canvas.width/gl.canvas.height, 10,6000)
		const viewProjectionMatrix = Matrix4x4.multiply(projectionMatrix,viewMatrix)

		gl.uniformMatrix4fv(this._program.uniformInfo.transformMatrix,false,  Matrix4x4.identity()) 
		gl.uniformMatrix4fv(this._program.uniformInfo.viewProjectionMatrix,false, viewProjectionMatrix)

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



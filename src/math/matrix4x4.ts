import { cross, degreeToRadian, normalize } from "./util"
import Vector3 from "./vector3"


export default class Matrix4x4 {
    private _data: number[]

    public constructor() {
        this._data = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]

    }

    public get data(): number[] {
        return this._data
    }

    public static identity():number[] {
        return new Matrix4x4().data
    }

    public static translation(x:number=0, y:number=0, z:number=0):number[] {
        const matrix = new Matrix4x4().data

        matrix[12] = x
        matrix[13] = y
        matrix[14] = z

        return matrix
    }

    public static translate(target: number[], x:number=0, y:number=0, z:number=0):number[] {
        const tm = Matrix4x4.translation(x,y,z)
        const matrix = Matrix4x4.multiply(target, tm)

        return matrix
    }

    public static rotationX(deg:number):number[] {
        const matrix = new Matrix4x4().data
        const rad = degreeToRadian(deg)
        const c = Math.cos(rad)
        const s = Math.sin(rad)

        matrix[5] = c
        matrix[6] = s
        matrix[9] = -s
        matrix[10] = c

        return matrix
    }

    public static rotateX(target:number[], deg:number):number[] {
        const rm = Matrix4x4.rotationX(deg)
        const matrix = Matrix4x4.multiply(target, rm)
       
        return matrix
    }

    public static rotationY(deg:number):number[] {
        const matrix = new Matrix4x4().data
        const rad = degreeToRadian(deg)
        const c = Math.cos(rad)
        const s = Math.sin(rad)

        matrix[0] = c
        matrix[2] = s
        matrix[8] = -s
        matrix[10] = c

        return matrix
    }

    public static rotateY(target:number[], deg:number):number[] {
        const rm = Matrix4x4.rotationY(deg)
        const matrix = Matrix4x4.multiply(target, rm)
       
        return matrix
    }

    public static rotationZ(deg:number):number[] {
        const matrix = new Matrix4x4().data
        const rad = degreeToRadian(deg)
        const c = Math.cos(rad)
        const s = Math.sin(rad)

        matrix[0] = c
        matrix[1] = -s
        matrix[4] = s
        matrix[5] = c

        return matrix
    }

    public static rotateZ(target:number[], deg:number):number[] {
        const rm = Matrix4x4.rotationZ(deg)
        const matrix = Matrix4x4.multiply(target, rm)
       
        return matrix
    }

    public static scale(x:number=1, y:number=1, z:number=1):number[] {
        const matrix = new Matrix4x4().data

        matrix[0] = x
        matrix[5] = y
        matrix[10] = z

        return matrix
    }

    public static scaling(target:number[], x:number, y:number, z:number):number[] {
        const sm = Matrix4x4.scale(x,y,z)
        const matrix = Matrix4x4.multiply(target, sm)

        return matrix
    }

    public static multiply(a:number[],b:number[]):number[] {
            const matrix = new Matrix4x4().data
    
            const b00 = b[4 * 0 + 0]
            const b01 = b[4 * 0 + 1]
            const b02 = b[4 * 0 + 2]
            const b03 = b[4 * 0 + 3]
            const b10 = b[4 * 1 + 0]
            const b11 = b[4 * 1 + 1]
            const b12 = b[4 * 1 + 2]
            const b13 = b[4 * 1 + 3]
            const b20 = b[4 * 2 + 0]
            const b21 = b[4 * 2 + 1]
            const b22 = b[4 * 2 + 2]
            const b23 = b[4 * 2 + 3]
            const b30 = b[4 * 3 + 0]
            const b31 = b[4 * 3 + 1]
            const b32 = b[4 * 3 + 2]
            const b33 = b[4 * 3 + 3]
    
            const a00 = a[4 * 0 + 0]
            const a01 = a[4 * 0 + 1]
            const a02 = a[4 * 0 + 2]
            const a03 = a[4 * 0 + 3]
            const a10 = a[4 * 1 + 0]
            const a11 = a[4 * 1 + 1]
            const a12 = a[4 * 1 + 2]
            const a13 = a[4 * 1 + 3]
            const a20 = a[4 * 2 + 0]
            const a21 = a[4 * 2 + 1]
            const a22 = a[4 * 2 + 2]
            const a23 = a[4 * 2 + 3]
            const a30 = a[4 * 3 + 0]
            const a31 = a[4 * 3 + 1]
            const a32 = a[4 * 3 + 2]
            const a33 = a[4 * 3 + 3]
    
            matrix[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30
            matrix[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31
            matrix[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32
            matrix[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33
            matrix[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30
            matrix[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31
            matrix[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32
            matrix[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33
            matrix[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30
            matrix[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31
            matrix[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32
            matrix[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33
            matrix[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30
            matrix[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31
            matrix[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32
            matrix[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33
    
            return matrix
    }

    public static inverse(m:number[]):number[] {
        const matrix = new Matrix4x4().data

        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];

        const tmp_0  = m22 * m33;
        const tmp_1  = m32 * m23;
        const tmp_2  = m12 * m33;
        const tmp_3  = m32 * m13;
        const tmp_4  = m12 * m23;
        const tmp_5  = m22 * m13;
        const tmp_6  = m02 * m33;
        const tmp_7  = m32 * m03;
        const tmp_8  = m02 * m23;
        const tmp_9  = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;
    
        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        
        if ((m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3) === 0) return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        matrix[0] = d * t0
        matrix[1] = d * t1
        matrix[2] = d * t2
        matrix[3] = d * t3
        matrix[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
        matrix[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
        matrix[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
        matrix[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
        matrix[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
        matrix[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
        matrix[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
        matrix[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
        matrix[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
        matrix[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
        matrix[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
        matrix[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))

        return matrix
    }

    public static transpose(m:number[]):number[] {
        return [
            m[0], m[4] , m[8], m[12],
            m[1], m[5] , m[9], m[13],
            m[2], m[6] , m[10], m[14],
            m[3], m[7] , m[11], m[15],
        ]
    }

    public static lookAt(pos:Vector3, target:Vector3, up:Vector3):number[] {       
        const axisZ = normalize(pos.subtract(target))
        const axisX = normalize(cross(up,axisZ))
        const axisY = normalize(cross(axisZ,axisX))

    return [
        axisX.x, axisX.y, axisX.z, 0,
        axisY.x, axisY.y, axisY.z, 0,
        axisZ.x, axisZ.y, axisZ.z, 0,
        pos.x, pos.y, pos.z, 1
    ]


    }
    public static perspective(fov:number, aspectRatio:number, near:number, far:number):number[] {
        const fovRad = degreeToRadian(fov)
        const focalLength = 1 / Math.tan(fovRad*0.5)

        return [
            focalLength/aspectRatio, 0, 0, 0,
            0, focalLength, 0, 0,
            0, 0, (near + far) / (near - far), -1,
            0, 0, (2 * near * far) / (near - far), 0
        ]
    }

    public static orthograpic(left:number, right:number, top:number, bottom:number, near:number, far:number):number[] {
        return [
            2/(right-left), 0, 0, 0,
            0, 2/(top-bottom), 0, 0,
            0, 0, 2/(far-near), 0,
            -(right+left)/(right-left), -(top+bottom)/(top-bottom), (far+near)/(far-near), 1
        ]
    } 
}
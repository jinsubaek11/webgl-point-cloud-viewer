import Vector2 from "./vector2"
import Vector3 from "./vector3"

export const degreeToRadian = (deg:number) => {
    const radian = deg * Math.PI / 180

    return radian
}

export const cross = (a:Vector3, b:Vector3) => {
    const vector = new Vector3()

    vector.x = a.y*b.z - a.z*b.y
    vector.y = a.z*b.x - a.x*b.z
    vector.z = a.x*b.y - a.y*b.x

    return vector
}

export const dot = (a:Vector3, b:Vector3) => {
    const scalar = a.x*b.x + a.y*b.y + a.z*b.z
    
    return scalar
}

export const normalize = (a:Vector3) => {
    const EPS = 0.00001
    const length = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z)

    if (length < EPS) {
        return new Vector3()
    }

    const vector = new Vector3()

    vector.x = a.x/length
    vector.y = a.y/length
    vector.z = a.z/length

    return vector
}
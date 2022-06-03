export const degreeToRadian = (deg:number) => {
    const radian = deg * Math.PI / 180

    return radian
}

export const cross = (a:number[], b:number[]) => {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2], 
        a[0]*b[1] - a[1]*b[0]
    ]
}

export const dot = (a:number[], b:number[]) => {
    
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

export const subtract = (a:number[], b:number[]) => {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    ]
}

export const normalize = (a:number[]) => {
    const length = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2])

    if (length > 0.00001) {
        return [a[0]/length, a[1]/length, a[2]/length];
      } else {
        return [0, 0, 0];
      }
}
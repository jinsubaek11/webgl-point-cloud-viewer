export const fragmentSource = `
precision mediump float;

varying vec3 vColor;

void main() {
    //vec3 color = vec3(vColor.r/255., vColor.g/255., vColor.b/255.);
    gl_FragColor = vec4(vColor,1.0);
}

`
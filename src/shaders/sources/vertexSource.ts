export const veretxSource = `
attribute vec3 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

void main() {

   gl_Position = vec4(aPosition, 1.0);
   // gl_Position = vec4(aPosition * 0.01, 1.0);
    //gl_Position = vec4(0.5,0.5,0.5,1.0);
    gl_PointSize = 2.;

    vColor = aColor;
}
`
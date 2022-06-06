export const veretxSource = `
attribute vec3 aPosition;
attribute vec3 aColor;

uniform mat4 transformMatrix;
uniform mat4 viewProjectionMatrix;

varying vec3 vColor;

void main() {

    vec4 position = viewProjectionMatrix * transformMatrix * vec4(aPosition, 1.0);
    // position.x += sin(10.);
    gl_Position = position;
    gl_PointSize = 2.;

    vColor = aColor;
}
`
#version 300 es

precision highp float;

in int vertexData; // 00NN NXYZ

uniform mat4 cameraProjection;
uniform mat4 cameraRotation;
uniform vec3 cameraPosition;

void main() {
    vec3 vertexPosition = vec3((vertexData >> 2) & 1, (vertexData >> 1) & 1, vertexData & 1) ;

    vec4 finalPosition = vec4(vertexPosition - 0.5, 0.5) * (cameraRotation * cameraProjection);

    // gl_Position = vec4(vertexPosition, 1.0);
    gl_Position = finalPosition;
}
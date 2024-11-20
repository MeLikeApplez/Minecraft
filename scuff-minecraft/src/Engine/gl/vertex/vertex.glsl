#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
precision mediump float;

// vertex data
in vec3 vertexPosition;
in vec3 vertexColor;

// mesh data
in vec3 meshOffset;

// texture/color data
out vec3 fragmentColor;

// camera data
uniform vec3 cameraPosition;
uniform mat4 cameraProjection;
uniform mat4 cameraRotation;
uniform mat4 viewMatrix;

void main() {
    vec4 finalPosition = vec4(vertexPosition - cameraPosition + meshOffset, 1.0) * (cameraRotation * cameraProjection);
    // vec4 finalPosition = vec4(vertexPosition - cameraPosition + meshOffset, 1.0) * (cameraProjection * viewMatrix);

    fragmentColor = vertexColor;
    gl_Position = finalPosition;
}
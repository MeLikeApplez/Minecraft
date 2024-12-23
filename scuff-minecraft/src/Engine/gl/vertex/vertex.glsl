#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
precision highp float;

// vertex data
in int vertexData; // 00NN NXYZ
flat out int fragVertexData;

// mesh data
in vec3 blockOffset;

// texture/color data
in vec2 aTexCoord;
out vec2 vTexCoord;

in vec2 faceTextureNZ;
in vec2 faceTexturePZ;
in vec2 faceTexturePY;
in vec2 faceTextureNY;
in vec2 faceTextureNX;
in vec2 faceTexturePX;

out vec2 fragFaceTextureNZ;
out vec2 fragFaceTexturePZ;
out vec2 fragFaceTexturePY;
out vec2 fragFaceTextureNY;
out vec2 fragFaceTextureNX;
out vec2 fragFaceTexturePX;

// camera data
uniform vec3 cameraPosition;
uniform mat4 cameraProjection;
uniform mat4 cameraRotation;
uniform mat4 viewMatrix;

void main() {
    vec3 vertexPosition = vec3((vertexData >> 2) & 1, (vertexData >> 1) & 1, vertexData & 1) - cameraPosition + blockOffset;
    vec4 finalPosition = vec4(vertexPosition, 0.5) * (cameraRotation * cameraProjection);
    // vec4 finalPosition = vec4(vertexPosition - cameraPosition + meshOffset, 1.0) * (cameraProjection * viewMatrix);

    fragVertexData = vertexData;

    fragFaceTextureNZ = faceTextureNZ;
    fragFaceTexturePZ = faceTexturePZ;
    fragFaceTexturePY = faceTexturePY;
    fragFaceTextureNY = faceTextureNY;
    fragFaceTextureNX = faceTextureNX;
    fragFaceTexturePX = faceTexturePX;

    gl_Position = finalPosition;
    vTexCoord = aTexCoord;
}
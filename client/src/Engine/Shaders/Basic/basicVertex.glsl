#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
precision highp float;

// vertex data
in int vertexData; // 00NN NXYZ
flat out int fragVertexData;
out vec3 fragVertexPosition;
out vec3 fragVertexFaceNormal;
out vec3 fragVertexNormal;

// block data
in vec3 blockOffset;
uniform vec2 chunkOffset;

// texture data
in vec2 vertexTexCoords;
out vec2 atlasTexCoords;

in vec2 faceTextureNZ;
in vec2 faceTexturePZ;
in vec2 faceTexturePY;
in vec2 faceTextureNY;
in vec2 faceTextureNX;
in vec2 faceTexturePX;

out vec2 fragFaceTexture;

// camera data
uniform mat4 cameraProjection;
uniform mat4 cameraRotation;
uniform vec3 cameraPosition;

const vec3 NORMALS[6] = vec3[6](
    vec3(1, 0, 0),
    vec3(-1, 0, 0),
    vec3(0, 1, 0),
    vec3(0, -1, 0),
    vec3(0, 0, 1),
    vec3(0, 0, -1)
);

void main() {
    vec3 vertexPosition = vec3((vertexData >> 2) & 1, (vertexData >> 1) & 1, vertexData & 1) ;
    vertexPosition.x += chunkOffset.x;
    vertexPosition.z += chunkOffset.y;
    
    vec4 finalPosition = vec4(vertexPosition - cameraPosition + blockOffset, 0.5) * (cameraRotation * cameraProjection);

    fragVertexData = vertexData;

    int normalId = (vertexData >> 3) & 7;

    switch(normalId) {
        case 0:
            fragFaceTexture = faceTexturePX;
            break;
        case 1:
            fragFaceTexture = faceTextureNX;
            break;
        case 2:
            fragFaceTexture = faceTexturePY;
            break;
        case 3:
            fragFaceTexture = faceTextureNY;
            break;
        case 4:
            fragFaceTexture = faceTexturePZ;
            break;
        case 5:
            fragFaceTexture = faceTextureNZ;
            break;
    }

    fragVertexFaceNormal = normalize((vertexPosition + blockOffset) * mat3(cameraProjection));
    fragVertexNormal = NORMALS[normalId];
    fragVertexPosition = vertexPosition;

    atlasTexCoords = vertexTexCoords;
    gl_Position = finalPosition;
}
 
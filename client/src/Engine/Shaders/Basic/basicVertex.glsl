#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
// https://learnwebgl.brown37.net/12_shader_language/glsl_data_types.html
precision highp float;

// vertex data
// in lowp int vertexData; // 00NN NXYZ
in lowp int vertexData; // 0000 0XYZ
flat out int fragVertexData;
out vec3 fragVertexPosition;
out vec3 fragVertexFaceNormal;
out vec3 fragVertexNormal;

// block data
in highp int blockData;
flat out highp int fragBlockData;
in vec3 blockOffset;
uniform vec2 chunkOffset;

// texture data
in vec2 vertexTexCoords;
out vec2 atlasTexCoords;

in lowp int faceDirection;

// in vec2 faceTextureNZ;
// in vec2 faceTexturePZ;
// in vec2 faceTexturePY;
// in vec2 faceTextureNY;
// in vec2 faceTextureNX;
// in vec2 faceTexturePX;

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
    vec3 offset = vec3((blockData >> 16) & 15, (blockData >> 20) & 255, (blockData >> 28) & 15);

    fragVertexData = vertexData;
    fragFaceTexture = vec2(blockData & 31, (blockData >> 5) & 31);

    int normalIndex = (blockData >> 10) & 7;

    // Rotation chart
    // Q1 => (a, b)
    // Q2 => (b, -a)
    // Q3 => (-a, -b)
    // Q4 => (-b, a)
    switch(normalIndex) {
        case 0: // (1, 0, 0)
            vertexPosition = vec3(1.0 - vertexPosition.y, vertexPosition.z, 1.0 - vertexPosition.x);
            break;
        case 1: // (-1, 0, 0)
            vertexPosition = vec3(vertexPosition.y, vertexPosition.z, vertexPosition.x);
            break;
        case 2: // (0, 1, 0)
            vertexPosition = vec3(1.0 - vertexPosition.z, vertexPosition.y + 1.0, 1.0 - vertexPosition.x);
            break;
        case 4: // (0, 0, 1)
            vertexPosition = vec3(1.0 - vertexPosition.x, vertexPosition.z, vertexPosition.y);
            break;
        case 5: // (0, 0, -1)
            vertexPosition = vec3(vertexPosition.x, vertexPosition.z, 1.0 - vertexPosition.y);
            break;
    }

    vertexPosition.x += chunkOffset.x;
    vertexPosition.z += chunkOffset.y;

    vec4 finalPosition = vec4(vertexPosition - cameraPosition + offset, 0.5) * (cameraRotation * cameraProjection);

    fragBlockData = blockData;
    fragVertexFaceNormal = normalize((vertexPosition + offset) * mat3(cameraProjection));
    fragVertexNormal = NORMALS[normalIndex];
    fragVertexPosition = vertexPosition;

    atlasTexCoords = vertexTexCoords;
    gl_Position = finalPosition;
}
 
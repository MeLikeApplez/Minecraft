#version 300 es

precision highp float;

out vec4 outputColor;
flat in int fragVertexData; // 00NN NXYZ

// atlas
uniform int atlasWidth;
uniform int atlasHeight;

// texture
const float MAX_SQUARE_SIZE = 16.0;
uniform sampler2D uSampler2D;
in vec2 vTexCoord;

in vec2 fragFaceTextureNZ;
in vec2 fragFaceTexturePZ;
in vec2 fragFaceTexturePY;
in vec2 fragFaceTextureNY;
in vec2 fragFaceTextureNX;
in vec2 fragFaceTexturePX;

const vec3 NORMALS[6] = vec3[6](
    vec3(0, 0, 1),
    vec3(0, 0, -1),
    vec3(0, 1, 0),
    vec3(0, -1, 0),
    vec3(-1, 0, 0),
    vec3(1, 0, 0)
);

void main() {
    int normalId = (fragVertexData >> 3) & 7;

    vec2 faceTexture = vec2(0.0, 0.0);
    switch(normalId) {
        case 0:
            faceTexture = fragFaceTextureNZ;
            break;
        case 1:
            faceTexture = fragFaceTexturePZ;
            break;
        case 2:
            faceTexture = fragFaceTexturePY;
            break;
        case 3:
            faceTexture = fragFaceTextureNY;
            break;
        case 4:
            faceTexture = fragFaceTextureNX;
            break;
        case 5:
            faceTexture = fragFaceTexturePX;
            break;
    }

    int hideX = (int(faceTexture.x) >> 5) &  1;
    int hideY = (int(faceTexture.y) >> 5) &  1;

    if(hideX == 1 || hideY == 1) discard;

    float atlasWidthCrop = float(atlasWidth) / MAX_SQUARE_SIZE;
    float atlasHeightCrop = float(atlasHeight) / MAX_SQUARE_SIZE;
    vec2 uvTexCoord = vec2(vTexCoord.x / atlasWidthCrop, vTexCoord.y / atlasHeightCrop);

    uvTexCoord.x = uvTexCoord.x + (faceTexture.x / atlasWidthCrop);
    uvTexCoord.y = uvTexCoord.y + (faceTexture.y / atlasHeightCrop);

    vec4 outputTexture = texture(uSampler2D, uvTexCoord);

    if(outputTexture.a <= 0.1) discard;

    outputColor = outputTexture;
    // outputColor = vec4(1.0, 0.0, 0.0, 1.0);
    // outputColor = vec4(NORMALS[normalId], 1.0);
}


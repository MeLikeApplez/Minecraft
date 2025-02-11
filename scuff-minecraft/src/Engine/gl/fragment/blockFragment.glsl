#version 300 es

precision highp float;

// vertex data
flat in int fragVertexData;
in vec3 fragVertexPosition;
in vec3 fragVertexFaceNormal;
in vec3 fragVertexNormal;

uniform vec3 sunPosition;

// texture data
uniform float atlasCropWidth;
uniform float atlasCropHeight;
in vec2 atlasTexCoords;
uniform sampler2D uSampler2D;
in vec2 fragFaceTexture;

out vec4 outputColor;
    
void main() {
    vec2 uvTexCoords = vec2(atlasTexCoords.x / atlasCropWidth, atlasTexCoords.y / atlasCropHeight);

    if(fragFaceTexture.x > 32.0) discard;

    uvTexCoords.x = uvTexCoords.x + (fragFaceTexture.x / atlasCropWidth);
    uvTexCoords.y = uvTexCoords.y + (fragFaceTexture.y / atlasCropHeight);

    vec4 outputTexture = texture(uSampler2D, uvTexCoords);

    if(outputTexture.a < 0.4) discard;    

    // outputTexture = vec4(1.0, 0.0, 0.0, 1.0);
    // outputTexture = vec4(abs(fragVertexNormal), 1.0);

    // float brightness = max(dot(fragVertexFaceNormal, normalize(sunPosition)), 0.0);
    float brightness = max(dot(fragVertexNormal, normalize(sunPosition)), 0.0);

    // outputTexture.rgb = (outputTexture.rgb * 0.0) + (outputTexture.rgb * brightness * 0.9);
    outputTexture.rgb = (outputTexture.rgb * 0.5) + (outputTexture.rgb * brightness * 0.5);

    
    outputColor = outputTexture;
    // outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}


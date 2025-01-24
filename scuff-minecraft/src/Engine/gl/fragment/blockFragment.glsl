#version 300 es

precision highp float;

// vertex data
flat in int fragVertexData;
in vec3 fragVertexNormal;

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

    // vec3 lightPos = vec3(-16.0, 16.0, 16.0);
    // float brightness = dot(fragVertexNormal, normalize(lightPos));

    // outputTexture.rgb *= brightness;
    
    outputColor = outputTexture;
    // outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}


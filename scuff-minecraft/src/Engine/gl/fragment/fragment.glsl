#version 300 es

precision highp float;

in vec3 fragmentColor;
out vec4 outputColor;

in vec2 vTexCoord;
uniform sampler2D uSampler2D;

void main() {
    // outputColor = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 outputTexture = texture(uSampler2D, vTexCoord);

    if(outputTexture.a <= 0.5) discard;

    outputColor = outputTexture;
}


#version 300 es

precision highp float;

in vec3 fragmentColor;
out vec4 outputColor;

void main() {
    outputColor = vec4(1.0, 0.0, 0.0, 1.0);
    // outputColor = vec4(fragmentColor, 1.0);
}


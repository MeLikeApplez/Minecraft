#version 300 es

precision highp float;

uniform vec3 skyColor;

out vec4 outputColor;

void main() {
    outputColor = vec4(skyColor / 255.0, 1.0);
}
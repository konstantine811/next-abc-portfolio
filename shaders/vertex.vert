precision mediump float;
#define AMP 1.2
#define FREQ 0.05
#define PI 3.14159265359
varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform vec2 uMouseMove;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);


void main () {
    vUv = uv;
    vec3 pos = position;
    float noiseFreq = 1.5;
    float noiseAmp = 0.25;
    float dist = distance(vUv, uMouseMove);
    float decay = clamp(dist * 5.00, 1.0, 10.0);
    float ripple = sin(-PI * FREQ * dist + uTime) * (AMP / decay);
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.6 - dist, pos.y, pos.z);
    pos.z += snoise3(noisePos) * noiseAmp * ripple;
    vWave = ripple + pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
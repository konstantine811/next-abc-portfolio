precision mediump float;


varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
    float wave = vWave * 0.1;
    vec3 texture = texture2D(uTexture, vUv + wave * 0.1).rgb;
    gl_FragColor = vec4(texture, 1.0);
}
uniform float size;
uniform sampler2D elevTexture;
uniform vec2 mouseUV;

varying vec2 vUv;
varying float vVisible;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float elv = texture2D(elevTexture, vUv).r;
    vec3 vNormal = normalMatrix * normal;
    vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
    mvPosition.z += 0.15 * elv;
    // get disathce fo vertex to mouse
    float dist = distance(mouseUV, vUv);
    float displace = 0.0;
    float distanceFactor = 0.05;
    if(dist < distanceFactor) {
        displace = (distanceFactor - dist) * 30.0;
    }
    mvPosition.z += displace;


    vec4 p = projectionMatrix * mvPosition;
    gl_Position = p;
    gl_PointSize = size;
}
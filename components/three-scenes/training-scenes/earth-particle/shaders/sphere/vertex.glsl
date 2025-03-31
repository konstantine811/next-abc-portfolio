// vertex shader
precision highp float;

attribute float pindex;

uniform float uTime;
uniform float uParticleCount;
uniform float uRadius;

void main() {
  float id = pindex;

  // Нормалізуємо індекс
  float norm = id / uParticleCount;

  // Генеруємо псевдо-випадкові кути
  float theta = norm * 6.2831853; // [0, 2PI]
  float phi = acos(2.0 * fract(sin(id * 12.9898) * 43758.5453) - 1.0); // [0, PI]

  // Сферичні координати
  float x = uRadius * sin(phi) * cos(theta);
  float y = uRadius * sin(phi) * sin(theta);
  float z = uRadius * cos(phi);

  vec3 pos = vec3(x, y, z);

  // Пульсація або хвиля
  float wave = sin(uTime + norm * 20.0) * 0.1;
  pos += normalize(pos) * wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 0.2;
}

uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
attribute float aIntensity;
attribute float aAngle;
uniform float uTime;

varying vec3 vColor;
varying vec2 vUv;


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise_1_2(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0 - sqrt(3.0)) / 6.0
    0.366025403784439,  // 0.5 * (sqrt(3.0) - 1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(
    dot(x0, x0),
    dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)
  ), 0.0);

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

    m *= (1.79284291400159 - (C.w * a0 * a0 + h * h));

    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.y = a0.y * x12.x + h.y * x12.y;
    g.z = a0.z * x12.z + h.z * x12.w;

    return dot(m, g);
}

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {
    // Final position
    vUv = uv;

    // Базова позиція
    vec3 newPosition = position;

    // Інтенсивність зміщення з текстури
    float displacementIntensity = texture2D(uDisplacementTexture, uv).r;

    displacementIntensity = smoothstep(0.1, 1.0, displacementIntensity);
    // Напрям розлітання
    vec3 displacement = vec3(cos(aAngle) * 0.2, sin(aAngle) * 0.2, 1.0);
    displacement = normalize(displacement);
    displacement *= displacementIntensity * 3.0 * aIntensity;

    // ШУМ 📣
    float n = snoise_1_2(uv * 5.0 + uTime * 0.1); // частота і рух
    vec3 noiseOffset = vec3(
    snoise_1_2(uv * 10.0 + uTime),
    snoise_1_2(uv * 10.0 + vec2(5.0) + uTime),
    snoise_1_2(uv * 10.0 + vec2(10.0) + uTime)
    );
    noiseOffset *= 3.0; // амплітуда шуму

    // Об'єднуємо
    newPosition += displacement + noiseOffset;
    // Переносимо точку в координати сцени
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Колір з текстури
    float pictureIntensity = texture2D(uPictureTexture, uv).r;
    vColor = vec3(pow(pictureIntensity, 2.0));

    // Розмір точки
    gl_PointSize = 0.02 * uResolution.y * pictureIntensity;
    gl_PointSize *= (1.0 / - viewPosition.z);
}
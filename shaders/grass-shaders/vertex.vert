precision mediump float;

attribute vec3 offset;
attribute vec4 orientation;
attribute float halfRootAngleSin;
attribute float halfRootAngleCos;
attribute float stretch;

uniform float time;
uniform float bladeHeight;
uniform vec3 uCapsulePos; // Позиція героя
uniform float uStepRadius; // Радіус впливу кроку

varying vec2 vUv;
varying float frc;

// Функція перлін-шуму для вітру
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Обертання вектора за допомогою кватерніона
vec3 rotateVectorByQuaternion(vec3 v, vec4 q) {
    return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
}

// Slerp для інтерполяції обертання
vec4 slerp(vec4 v0, vec4 v1, float t) {
    normalize(v0);
    normalize(v1);
    float dot_ = dot(v0, v1);
    if (dot_ < 0.0) {
        v1 = -v1;
        dot_ = -dot_;
    }
    const float DOT_THRESHOLD = 0.9995;
    if (dot_ > DOT_THRESHOLD) {
        vec4 result = t * (v1 - v0) + v0;
        normalize(result);
        return result;
    }
    float theta_0 = acos(dot_);
    float theta = theta_0 * t;
    float sin_theta = sin(theta);
    float sin_theta_0 = sin(theta_0);
    float s0 = cos(theta) - dot_ * sin_theta / sin_theta_0;
    float s1 = sin_theta / sin_theta_0;
    return (s0 * v0) + (s1 * v1);
}

void main() {
    // Відстань травинки до героя
    float dist = distance(offset.xz, uCapsulePos.xz);
    
    // Вплив героя: чим ближче, тим сильніше нахил
    float influence = smoothstep(uStepRadius, 0.0, dist); 
    vec3 bendDir = normalize(offset - uCapsulePos);
    bendDir.y = 0.0; // Обмежуємо нахил по горизонталі

    // Відносне положення вершини по Y
    frc = position.y / float(bladeHeight);

    // Шум для вітру
    float noise = 1.0 - (snoise(vec2((time - offset.x / 50.0), (time - offset.z / 50.0)))); 

    // Обчислення початкового напрямку трави
    vec4 direction = vec4(0.0, halfRootAngleSin, 0.0, halfRootAngleCos);
    direction = slerp(direction, orientation, frc);

    // Основне положення вершини
    vec3 vPosition = vec3(position.x, position.y + position.y * stretch, position.z);
    vPosition = rotateVectorByQuaternion(vPosition, direction);

    // Вітер
    float halfAngle = noise * 0.15;
    vPosition = rotateVectorByQuaternion(vPosition, normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle))));

    // Відхилення через капсулу (ефект наступання)
    vPosition.xz -= bendDir.xz * influence * 0.4;
    vPosition.y -= influence * 0.1; // Трава трохи пригинається

    // UV координати
    vUv = uv;

    // Фінальна позиція вершини
    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);
}

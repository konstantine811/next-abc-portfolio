uniform float time;
uniform float decayRate; // Швидкість згасання сліду
uniform sampler2D footprintTexture; // Текстура слідів
attribute vec3 terrPos;
attribute float angle;

varying vec2 vUv;

vec4 quat_from_axis_angle(vec3 axis, float angle) {
    vec4 qr;
    float half_angle = (angle * 0.5) * 3.14159 / 180.0;
    qr.x = axis.x * sin(half_angle);
    qr.y = axis.y * sin(half_angle);
    qr.z = axis.z * sin(half_angle);
    qr.w = cos(half_angle);
    return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) {
    vec4 q = quat_from_axis_angle(axis, angle);
    vec3 v = position.xyz;
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
    vUv = uv;
    vec3 finalPos = position;
    finalPos.x *= 0.1;
    finalPos.y += 0.3;

    // ✅ Коригуємо UV координати для текстури слідів
    vec2 footprintUV = vec2((terrPos.x + 50.0) / 100.0, 1.0 - (terrPos.z + 50.0) / 100.0);

    // ✅ Отримуємо основне значення відбитка (0 - 1)
    float footprintInfluence = texture2D(footprintTexture, footprintUV).r;

    // ✅ Підсилюємо згинання трави там, де слід найбільш яскравий
    float strongBend = smoothstep(0.8, 1.0, footprintInfluence) * 0.3; // Змінюємо силу згинання

    // ✅ Розгинання трави по краях відбитка
    float edgeEffect = smoothstep(0.5, 0.0, footprintInfluence) * 0.1;

    // ✅ Згинаємо траву: чим ближче до центру відбитка - тим більше, по краях - менше
    float bendAmount = strongBend - edgeEffect;

    if (finalPos.y > 0.5) {
        finalPos.x += sin(time * (angle * 0.01)) * 0.1;
        finalPos.z += cos(time * (angle * 0.01)) * 0.1;
    }

    // ✅ Плавне згинання трави
    finalPos.y -= bendAmount * 0.8;

    vec3 axist = vec3(0.0, 1.0, 0.0);
    finalPos = rotate_vertex_position(finalPos, axist, angle);
    finalPos += terrPos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}

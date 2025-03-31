void main() {
    // Визначаємо координати точки
    vec2 uv = gl_PointCoord;

    // Визначаємо відстань до центру
    float distanceToCenter = length(uv - vec2(0.5));

    // Якщо відстань більше 0.5, то відкидаємо піксель
    if (distanceToCenter > 0.5) {
        discard;
    }

    // Встановлюємо колір пікселя
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
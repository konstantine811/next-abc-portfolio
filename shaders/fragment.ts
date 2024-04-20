export const fragment = /*glsl*/ `
    void main() {
        gl_FragColor = vec4(0.0471, 0.1922, 1.0, 1.0);
    }
`;

export const vertex = /*glsl*/ `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

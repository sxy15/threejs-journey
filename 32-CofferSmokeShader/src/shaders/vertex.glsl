varying vec2 vUv;
uniform sampler2D uPerlineTexture;
uniform float uTime;

#include ./rotate2D.glsl


void main () {
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(uPerlineTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.03)).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlineTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlineTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 2.0;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}
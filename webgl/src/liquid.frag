precision mediump float;

varying vec2 coord;

uniform sampler2D base;
uniform float baseSize;
uniform vec2 canvasSize;

const float pi = 3.14159265;
const int radius = 4;
const float threshold = 1.2;

vec4 s(vec2 p) {
    return texture2D(base, p);
}

void main() {
    vec4 sum = vec4(0., 0., 0., 0.);
    vec2 scale = vec2(1., 1.) / baseSize;
    float sigma = float(radius) / 3.;
    float sigma22 = 2. * sigma * sigma;
    float sqrtSigmaPi2 = sqrt(2. * pi * sigma);
    float total = 0.;
    for (int y = -radius; y <= radius; y++) {
        for (int x = -radius; x <= radius; x++) {
            float dist = sqrt(float(x * x + y * y));
            float k = exp(-dist / sigma22) / sqrtSigmaPi2;
            total += k;
            sum += s(coord + vec2(x, y) * scale) * k;
        }
    }
    sum /= total;

    gl_FragColor = sum;
    if (sum.x + sum.y + sum.z < threshold) {
        gl_FragColor = vec4(0., 0., 0., 1.);
    } else {
        gl_FragColor = vec4(1., 1., 1., 1.);
    }
    //gl_FragColor = s(coord);
}

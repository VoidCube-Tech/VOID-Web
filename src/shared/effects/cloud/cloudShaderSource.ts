export const cloudVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const cloudFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_direction;
uniform vec4 u_dispersion;
uniform vec4 u_edges;
uniform vec3 u_cloudColor;
uniform vec3 u_secondaryColor;
uniform vec3 u_backgroundColor;
uniform float u_time;
uniform float u_opacity;
uniform float u_density;
uniform float u_noiseScale;
uniform float u_noiseDetail;
uniform float u_noiseSpeed;
uniform float u_distortion;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_softness;
uniform float u_grain;
uniform float u_movementSpeed;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float total = 0.0;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= u_noiseDetail) break;
    value += noise(p) * amplitude;
    total += amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value / max(total, 0.001);
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 drift = u_direction * u_time * u_noiseSpeed * u_movementSpeed;
  vec2 p = uv * aspect * u_noiseScale + drift;
  vec2 warp = vec2(fbm(p * 0.7 + 13.1), fbm(p * 0.7 - 17.3)) - 0.5;
  float field = fbm(p + warp * u_distortion * 2.0);
  float shaped = (field - 0.5) * u_contrast + 0.5 + (u_density - 0.5) * 0.55;
  float cloud = smoothstep(0.5 - u_softness * 0.35, 0.5 + u_softness * 0.35, shaped);
  float variation = fbm(p * 0.55 + 31.7);
  vec3 color = mix(u_cloudColor, u_secondaryColor, variation);
  color = mix(u_backgroundColor, color, cloud) * u_brightness;
  color += (hash(gl_FragCoord.xy + u_time * 0.01) - 0.5) * u_grain;

  float edge = 1.0;
  if (u_edges.x > 0.5) edge *= smoothstep(0.0, u_dispersion.x, uv.y);
  if (u_edges.y > 0.5) edge *= smoothstep(0.0, u_dispersion.y, 1.0 - uv.x);
  if (u_edges.z > 0.5) edge *= smoothstep(0.0, u_dispersion.z, 1.0 - uv.y);
  if (u_edges.w > 0.5) edge *= smoothstep(0.0, u_dispersion.w, uv.x);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), cloud * u_opacity * u_intensity * edge);
}`;

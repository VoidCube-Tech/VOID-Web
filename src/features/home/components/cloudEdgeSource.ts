export const edgeVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const edgeFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec3 u_fillColor;
uniform vec3 u_cloudColor;
uniform vec3 u_secondaryColor;
uniform vec2 u_direction;
uniform float u_edge;
uniform float u_size;
uniform float u_innerTransition;
uniform float u_blur;
uniform float u_time;
uniform float u_opacity;
uniform float u_density;
uniform float u_softness;
uniform float u_edgeNoise;
uniform float u_intensity;
uniform float u_movementSpeed;
uniform float u_noiseSpeed;

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
  float result = 0.0;
  float weight = 0.5;
  for (int i = 0; i < 4; i++) {
    result += noise(p) * weight;
    p *= 2.0;
    weight *= 0.5;
  }
  return result / 0.9375;
}

void main() {
  bool horizontal = u_edge < 0.5 || (u_edge > 1.5 && u_edge < 2.5);
  float inner = u_edge < 0.5 ? 1.0 - v_uv.y :
                u_edge < 1.5 ? 1.0 - v_uv.x :
                u_edge < 2.5 ? v_uv.y : v_uv.x;
  float stripLength = horizontal ? u_resolution.y : u_resolution.x;
  float outward = 1.0 - inner * stripLength / max(u_size, 1.0);
  float along = horizontal ? v_uv.x * u_resolution.x : v_uv.y * u_resolution.y;
  vec2 drift = u_direction * u_time * u_noiseSpeed * u_movementSpeed;
  vec2 p = vec2(along / 180.0, outward * 1.8) + drift;
  float broad = noise(vec2(along / 95.0 + drift.x, 2.7 + drift.y));
  float large = fbm(p * (0.75 + u_edgeNoise * 1.8));
  float detail = fbm(p * (2.0 + u_edgeNoise * 2.5) + 19.7);
  float ridge = 0.22 + u_density * 0.43
    + (broad - 0.5) * u_edgeNoise * 0.9
    + (large - 0.5) * u_edgeNoise * 0.35;
  float width = max(0.015, u_softness * 0.18);
  float body = 1.0 - smoothstep(ridge - width, ridge + width, outward);
  float fragments = smoothstep(0.52, 0.68, detail)
    * smoothstep(0.3, 0.55, outward)
    * (1.0 - smoothstep(0.85, 1.0, outward));
  float cloud = max(body, fragments * u_softness * 0.8);
  float fade = 1.0 - (1.0 - u_opacity * u_intensity) * smoothstep(0.03, 0.35, outward);
  float alpha = clamp(cloud * fade, 0.0, 1.0);
  float innerDistance = max(0.0, -outward * u_size);
  float taper = 1.0 - smoothstep(0.0, u_innerTransition, innerDistance);
  float innerVariation = (broad - 0.5) * u_edgeNoise * u_innerTransition * 0.8 * taper;
  float innerBlend = smoothstep(0.0, u_innerTransition, innerDistance + innerVariation);
  float blurRange = max(u_blur, 0.001);
  float colorBlend = smoothstep(-u_innerTransition / max(u_size, 1.0), 0.5, outward);
  vec3 cloudColor = mix(u_cloudColor, u_secondaryColor, detail);
  vec3 color = mix(u_fillColor, cloudColor, colorBlend);
  color = mix(color, u_fillColor, innerBlend);
  alpha = mix(alpha, 1.0, innerBlend);
  float seamDistance = max(outward, 0.0) * u_size
    + ((broad - 0.5) * 2.0 + large - 0.5) * u_edgeNoise * 2.0 * blurRange;
  float seamBlend = 1.0 - smoothstep(4.0 * blurRange, 5.0 * blurRange, seamDistance);
  color = mix(color, u_fillColor, seamBlend);
  alpha = mix(alpha, 1.0, seamBlend);
  float innerTint = smoothstep(0.0, blurRange, innerDistance) * (1.0 - innerBlend) * 0.12;
  color = mix(color, cloudColor, innerTint);
  gl_FragColor = vec4(color, alpha);
}`;

import { useRef, useEffect } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_waveSpeed;
uniform float u_distortion;
uniform vec2 u_mouse;
uniform float u_rotation;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

vec3 noised(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash2(i + vec2(0.0, 0.0)) * 2.0 - 1.0;
  vec2 gb = hash2(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 gc = hash2(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
  vec2 gd = hash2(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float dda = (va - vb - vc + vd) * du.y;
  float ddb = (va - vb - vc + vd) * du.x;
  return vec3(
    va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * (va - vb - vc + vd),
    dda * du.x + u.x * (gb.y - ga.y) + u.y * (gc.y - ga.y) + (u.x * u.y) * (ga.y - gb.y - gc.y + gd.y),
    ddb * du.y + u.x * (gb.x - ga.x) + u.y * (gc.x - ga.x) + (u.x * u.y) * (ga.x - gb.x - gc.x + gd.x)
  );
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = rot * p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 fbmd(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  vec2 d = vec2(0.0);
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    vec3 n = noised(p);
    v += a * n.x;
    d += a * n.yz;
    p = rot * p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return vec3(v, d);
}

float ridged(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    float n = vnoise(p);
    n = 1.0 - abs(n * 2.0 - 1.0);
    n = n * n;
    v += a * n;
    p = rot * p * 2.1 + vec2(3.2, 1.3);
    a *= 0.5;
  }
  return v;
}

vec2 fdomainWarp(vec2 p, float t, float distStr) {
  vec3 n1 = fbmd(p * 0.7 + vec2(t * 0.04, t * 0.03), 4);
  p += n1.yz * 0.18 * distStr;
  vec3 n2 = fbmd(p * 1.3 + vec2(-t * 0.03, t * 0.05), 4);
  p += n2.yz * 0.08 * distStr;
  return p;
}

vec2 fdomainWarpLite(vec2 p, float t) {
  vec3 n = fbmd(p * 0.7 + vec2(t * 0.04, t * 0.03), 3);
  return p + n.yz * 0.14;
}

float warpedRidged(vec2 p, float t, float distStr, int octaves) {
  p = fdomainWarp(p, t, distStr);
  return ridged(p, octaves);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  float t = u_time * u_waveSpeed;

  float rotAngle = u_rotation * 0.0174533;
  if (u_mouse.x > 0.0) {
    vec2 mUV = u_mouse / u_res - 0.5;
    rotAngle += mUV.x * 1.5;
  }

  float cr = cos(rotAngle);
  float sr = sin(rotAngle);
  mat2 rotMat = mat2(cr, -sr, sr, cr);
  vec2 p = rotMat * ((uv - 0.5) * vec2(aspect, 1.0));

  float viewD = 0.8 + 0.2 * sin(t * 0.06);
  p *= viewD;

  float distort = u_distortion;

  float h1 = warpedRidged(p * 0.8 + vec2(t * 0.015, 0.0), t, distort, 6);
  float h2 = warpedRidged(p * 1.5 + vec2(-t * 0.012, t * 0.008), t, distort * 0.8, 5);
  float h3 = warpedRidged(p * 2.8 + vec2(t * 0.02, -t * 0.01), t, distort * 0.6, 4);

  float ht = h1 * 0.45 + h2 * 0.30 + h3 * 0.25;

  float h4 = fbm(fdomainWarpLite(p * 4.0 + vec2(t * 0.03, -t * 0.02), t), 4);
  ht += h4 * 0.06;

  vec3 cSand1 = vec3(0.83, 0.73, 0.61);
  vec3 cSand2 = vec3(0.69, 0.56, 0.44);
  vec3 cSand3 = vec3(0.88, 0.80, 0.70);
  vec3 cSand4 = vec3(0.76, 0.64, 0.52);
  vec3 cSand5 = vec3(0.65, 0.52, 0.40);
  vec3 cDark = vec3(0.42, 0.30, 0.22);
  vec3 cDkDeep = vec3(0.30, 0.20, 0.13);

  float rt = smoothstep(0.42, 0.70, ht);
  float rMid = rt * (1.0 - rt) * 4.0;

  vec3 sand = mix(cSand1, cSand2, smoothstep(0.0, 0.25, ht));
  sand = mix(sand, cSand3, smoothstep(0.20, 0.40, ht) * 0.6);
  sand = mix(sand, cSand4, smoothstep(0.35, 0.55, ht) * 0.7);
  sand = mix(sand, cSand5, smoothstep(0.50, 0.72, ht));
  sand = mix(sand, cDark, smoothstep(0.65, 0.90, ht));
  sand = mix(sand, cDkDeep, smoothstep(0.82, 1.0, ht));

  float h1n = h1 * 0.5 + 0.5;
  float h2n = h2 * 0.5 + 0.5;
  float iriAngle = h1n * PI * 2.0 + t * 0.08 + h2n * PI;
  vec3 iri = 0.5 + 0.5 * vec3(
    cos(iriAngle),
    cos(iriAngle + TAU / 3.0),
    cos(iriAngle + TAU * 2.0 / 3.0)
  );

  float rBlend = smoothstep(0.25, 0.55, rt);
  float rBlend2 = smoothstep(0.40, 0.75, rt);

  sand += iri * 0.04 * rBlend;
  sand += (iri * 0.5 + vec3(0.55, 0.50, 0.45)) * 0.06 * rBlend2;

  float tInt = smoothstep(0.70, 1.0, ht);
  sand += (cDark * 0.4 - sand) * 0.15 * tInt;

  float vW = smoothstep(0.0, 0.15, ht);
  sand += (vec3(0.85, 0.78, 0.70) - sand) * 0.1 * (1.0 - vW);

  float rHi = pow(rMid, 3.0);
  sand += (vec3(1.0, 0.95, 0.85) - sand) * rHi * 0.35;

  float aP = smoothstep(0.20, 0.85, h1);
  vec3 aTint = vec3(0.80, 0.72, 0.60);
  sand *= mix(vec3(1.0), aTint, aP * 0.15);

  float sX = t * 0.08;
  vec2 lP = p * 12.0 + vec2(sX, sX * 0.6);
  float ls = ridged(lP, 3);
  sand += vec3(0.10, 0.09, 0.07) * pow(ls, 5.0) * 0.8 * rBlend;

  vec2 vc = (uv - 0.5) * 1.15;
  float vig = 1.0 - dot(vc, vc) * 0.4;
  vig = max(vig, 0.0);
  sand *= (vig * 0.5 + 0.5);

  float dT = dot(sand, vec3(0.299, 0.587, 0.114));
  float satL = dT * 0.08;
  sand -= vec3(satL);
  sand += vec3(sand.r * 0.04, 0.0, -sand.b * 0.02);

  gl_FragColor = vec4(sand, 1.0);
}
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      if (!canvas || !gl) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    function compileShader(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uWaveSpeed = gl.getUniformLocation(prog, 'u_waveSpeed');
    const uDistortion = gl.getUniformLocation(prog, 'u_distortion');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uRotation = gl.getUniformLocation(prog, 'u_rotation');

    gl.uniform1f(uWaveSpeed, 0.6);
    gl.uniform1f(uDistortion, 1.0);
    gl.uniform1f(uRotation, 0.0);

    function render() {
      if (!gl || !canvas) return;
      const t = performance.now() * 0.001;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x * dpr, (canvas.clientHeight - mouseRef.current.y) * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(render);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, transparent 80%)',
        }}
      />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-32 px-6">
        <h1
          className="font-serif text-white text-center mb-6"
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-1.44px',
          }}
        >
          Timeless Craftsmanship
        </h1>
        <p
          className="font-sans text-white text-center mb-10 max-w-xl"
          style={{ fontSize: '18px', opacity: 0.6, lineHeight: 1.5 }}
        >
          Explore our new collection of handcrafted walnut and oak designs.
        </p>
        <a
          href="#collections"
          className="inline-flex items-center justify-center px-10 py-4 border border-white text-white font-sans text-sm uppercase tracking-widest transition-all duration-500 hover:bg-terracotta hover:border-terracotta hover:text-white"
          style={{
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}

// WebGL Aurora Effect - TBLabs
(function() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;

    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float flowingStream(vec2 uv, float time, float seed) {
      float radius = length(uv);
      float flow1 = fbm(vec3(uv * 0.8 + seed, time * 0.15)) * 0.5;
      float flow2 = snoise(vec3(uv.x * 1.2, uv.y * 0.8, time * 0.2 + seed)) * 0.4;
      float flow3 = snoise(vec3(uv * 1.5 + seed * 2.0, time * 0.1)) * 0.3;
      float baseRadius = 0.65 + seed * 0.1;
      float targetRadius = baseRadius + flow1 + flow2 + flow3;
      return abs(radius - targetRadius);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 centeredUv = (uv - 0.5) * 2.0;
      float aspect = u_resolution.x / u_resolution.y;
      centeredUv.x *= aspect;

      float time = u_time * 0.3;

      float stream1 = flowingStream(centeredUv, time, 0.0);
      float stream2 = flowingStream(centeredUv * 1.15, time * 0.7, 1.5);
      float stream3 = flowingStream(centeredUv * 0.85, time * 1.1, 3.0);

      float thickness = 0.12;
      float softness = 0.35;

      float glow1 = smoothstep(thickness + softness, thickness * 0.5, stream1) * 0.35;
      float glow2 = smoothstep(thickness + softness, thickness * 0.5, stream2) * 0.25;
      float glow3 = smoothstep(thickness + softness, thickness * 0.5, stream3) * 0.18;

      float outer1 = smoothstep(0.7, 0.0, stream1) * 0.12;
      float outer2 = smoothstep(0.6, 0.0, stream2) * 0.08;
      float outer3 = smoothstep(0.5, 0.0, stream3) * 0.06;

      float core1 = smoothstep(thickness * 0.4, 0.0, stream1) * 0.2;
      float core2 = smoothstep(thickness * 0.4, 0.0, stream2) * 0.12;

      float intensity = glow1 + glow2 + glow3;
      float outerIntensity = outer1 + outer2 + outer3;
      float coreIntensity = core1 + core2;

      vec3 blue = vec3(0.231, 0.510, 0.965);
      vec3 violet = vec3(0.545, 0.361, 0.965);
      vec3 deepBlue = vec3(0.1, 0.2, 0.4);
      vec3 white = vec3(1.0);

      float colorMix = snoise(vec3(centeredUv * 1.5, time * 0.4)) * 0.5 + 0.5;
      vec3 streamColor = mix(blue, violet, colorMix);
      vec3 coreColor = mix(streamColor, white, 0.3);
      vec3 outerColor = mix(deepBlue, blue, 0.5);

      vec3 finalColor = vec3(0.0);
      finalColor += outerColor * outerIntensity;
      finalColor += streamColor * intensity;
      finalColor += coreColor * coreIntensity;

      finalColor = 1.0 - exp(-finalColor * 1.2);

      float vignette = smoothstep(0.2, 1.0, length(centeredUv * 0.6));
      finalColor *= mix(0.4, 1.0, vignette);
      finalColor *= 0.7;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);

  let startTime = Date.now();

  function render() {
    const time = (Date.now() - startTime) / 1000;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
})();

THREE.DeviceShader = {

  uniforms: {
    "diffuse": {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    "opacity": {
      type: "f",
      value: 1
    },
    "uOffset": {
      type: "v2",
      value: new THREE.Vector2(0, 0)
    },
    "uRepeat": {
      type: "v2",
      value: new THREE.Vector2(1, 1)
    },
    "tAO": {
      type: "t",
      value: null
    }
  },

  vertexShader: [

    "uniform vec2 uOffset;",
    "uniform vec2 uRepeat;",
    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv * uRepeat + uOffset;",

    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "precision mediump float;",

    "uniform vec3 diffuse;",
    "uniform float opacity;",
    "uniform sampler2D tAO;",

    "varying vec2 vUv;",

    "void main() {",

    "gl_FragColor = vec4( diffuse, opacity );",

    "gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

    "}"

  ].join("\n")

};
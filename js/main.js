var App = App || {};
(function () {
  "use strict";

  var _scene,
    _camera,
    _controls,
    _renderer,
    _stats,
    _light,
    _cube,
    _depthMaterial,
    _depthTarget,
    _composer;



  function onIconButtonHover(e) {

  }

  function onIconButtonClick(e) {
    // get the handler
    var handler = $(e.currentTarget).data('handler');
    // call it
    App[handler]();
  }


  // html ui events
  $('.iconButton').hover(onIconButtonHover);
  $('.iconButton').click(onIconButtonClick);


  function render() {
    /*
    _scene.overrideMaterial = _depthMaterial;
    _renderer.render(_scene, _camera, _depthTarget);
    _scene.overrideMaterial = null;
    _composer.render();
    */
    _renderer.render(_scene, _camera);
  }


  function init() {
    ///////////
    // SCENE //
    ///////////
    _scene = new THREE.Scene();

    ////////////
    // CAMERA //
    ////////////

    // set the view size in pixels (custom or according to window size)

    // camera attributes
    var VIEW_ANGLE = 45,
      ASPECT = window.innerWidth / window.innerHeight,
      NEAR = 0.1,
      FAR = 20000;
    // set up camera
    _camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    // add the camera to the scene
    _scene.add(_camera);
    // the camera defaults to position (0,0,0)
    _camera.position.set(0, 2500, 0);
    _camera.lookAt(_scene.position);

    /*
    _camera.rotation.order = 'YXZ';
    _camera.rotation.y = -Math.PI / 4;
    _camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
    */


    //////////////
    // RENDERER //
    //////////////
    _renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _renderer.shadowMapEnabled = true;
    _renderer.shadowMapType = THREE.PCFSoftShadowMap;

    var webgl_container = $('.webgl_container');
    webgl_container.append(_renderer.domElement);


    //////////////
    // Stats //
    //////////////
    _stats = new Stats();
    $('.stats').append(_stats.domElement);


    //////////////
    // Controls //
    //////////////
    _controls = new THREE.OrbitControls(_camera);
    _controls.addEventListener('change', render);


    ////////////
    // EVENTS //
    ////////////
    THREEx.WindowResize(_renderer, _camera);


    // create the floor
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    /*
    var floorTexture = THREE.ImageUtils.loadTexture('../assets/iphone5_landscape_floor_ao.png');
    floorTexture.magFilter = THREE.NearestFilter;
    floorTexture.minFilter = THREE.LinearMipMapLinearFilter;
    */
    var floorShader = THREE.FloorShader;
    var floorUniforms = THREE.UniformsUtils.clone(floorShader.uniforms);

    floorUniforms.diffuse.value.setHex(0x212121);
    floorUniforms.tAO.value = THREE.ImageUtils.loadTexture('../assets/iphone5_landscape_floor_ao.png');

    var floorMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      fragmentShader: floorShader.fragmentShader,
      vertexShader: floorShader.vertexShader,
      uniforms: floorUniforms
      //lights: true
    });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.receiveShadow = true;
    _scene.add(floor);


    ///////////
    // LIGHT //
    ///////////
    // create a _light

    _light = new THREE.DirectionalLight(0xffffff, 2);
    _light.position.set(500, 1500, 500);
    /*
    _light.castShadow = true;

    _light.shadowCameraNear = 200;
    _light.shadowCameraFar = 2000;
    _light.shadowCameraFov = 75;

    _light.shadowCameraVisible = true;

    _light.shadowBias = 0.0001;
    _light.shadowDarkness = 0.2;

    _light.shadowMapWidth = 2048;
    _light.shadowMapHeight = 2048;
    */
    _scene.add(_light);



    var ambientLight = new THREE.AmbientLight(0x111111);
    //_scene.add(ambientLight);


    ///////////
    // depth //
    ///////////
    var depthShader = THREE.ShaderLib.depthRGBA;
    var depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);

    _depthMaterial = new THREE.ShaderMaterial({
      fragmentShader: depthShader.fragmentShader,
      vertexShader: depthShader.vertexShader,
      uniforms: depthUniforms
    });
    _depthMaterial.blending = THREE.NoBlending;

    // postprocessing

    _composer = new THREE.EffectComposer(_renderer);
    _composer.addPass(new THREE.RenderPass(_scene, _camera));

    _depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });



    var effect = new THREE.ShaderPass(THREE.SSAOShader);
    effect.uniforms.tDepth.value = _depthTarget;
    effect.uniforms.size.value.set(window.innerWidth, window.innerHeight);
    effect.uniforms.cameraNear.value = _camera.near;
    effect.uniforms.cameraFar.value = _camera.far;
    //effect.uniforms.onlyAO = 1;
    effect.renderToScreen = true;
    _composer.addPass(effect);

  }


  function update() {

  }





  function animate() {
    window.requestAnimationFrame(animate);
    render();
    update();
    _stats.update();
  }


  function loadScreenShot(url) {
    THREE.ImageUtils.loadTexture(url, undefined, function (texture) {
      var width = texture.image.naturalWidth;
      var height = texture.image.naturalHeight;

      if (_cube !== undefined) {
        // remove it
        _scene.remove(_cube);
      }

      // Load in the mesh and add it to the scene.

      var loader = new THREE.JSONLoader();

      loader.load("../assets/iphone5.js", function (geometry) {
        var deviceShader = THREE.DeviceShader;
        var deviceUniforms = THREE.UniformsUtils.clone(deviceShader.uniforms);

        deviceUniforms.diffuse.value.setHex(0x858585);
        deviceUniforms.tAO.value = THREE.ImageUtils.loadTexture('../assets/iphone5_landscape_device_ao.png');

        var deviceMaterial = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          fragmentShader: deviceShader.fragmentShader,
          vertexShader: deviceShader.vertexShader,
          uniforms: deviceUniforms
          //lights: true
        });
        _cube = new THREE.Mesh(geometry, deviceMaterial);
        _cube.position.set(0, 50, 0);
        _cube.castShadow = true;
        _cube.receiveShadow = true;
        _scene.add(_cube);
      });

      /*
      var geometry = new THREE.BoxGeometry(width, 10, height, 1, 1);
      var material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x858585
      });
      _cube = new THREE.Mesh(geometry, material);
      _cube.position.set(0, 50, 0);
      _cube.castShadow = true;
      _cube.receiveShadow = true;
      _scene.add(_cube);
      */
    });
  }

  App.onToggleFullScreen = function () {
    if (!THREEx.FullScreen.activated()) {
      THREEx.FullScreen.request();
    } else {
      THREEx.FullScreen.cancel();
    }
  };

  App.onShowInformation = function () {
    $('.about').toggle();
  };

  App.onMakeScreenshot = function () {
    try {
      var imgData = _renderer.domElement.toDataURL();
      $('.screenshotResult').css('background-image', 'url(' + imgData + ')');
      $('.screenshotDownloadLink').attr('href', imgData);
      $('.screenshotContainer').show();
    } catch (e) {
      console.log("Browser does not support taking screenshot of 3d context");
      return;
    }


  };

  App.onCloseScreenshot = function () {
    $('.screenshotContainer').hide();
  };

  // initialization
  init();

  // animation loop
  animate();

  // load a screenshot
  loadScreenShot('../img/iphone_4inch_portrait_03.png');
  //loadScreenShot('../img/ipad_landscape_03.png');

}());
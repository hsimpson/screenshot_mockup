var App = App || {};
(function () {
  "use strict";

  var _scene,
    _camera,
    _renderer,
    _cube;

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
    // so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
    _camera.position.set(0, 150, 400);
    _camera.lookAt(_scene.position);

    //////////////
    // RENDERER //
    //////////////


    _renderer = new THREE.WebGLRenderer({
      antialias: true
    });


    _renderer.setSize(window.innerWidth, window.innerHeight);

    var webgl_container = $('.webgl_container');
    webgl_container.append(_renderer.domElement);



    ////////////
    // EVENTS //
    ////////////

    THREEx.WindowResize(_renderer, _camera);


    /*
    // automatic window resize
    $(window).resize(function (e) {
      // update renderer size
      _renderer.setSize(window.innerWidth, window.innerHeight);
      // update camera
      _camera.aspect = window.innerWidth / window.innerHeight;
      _camera.updateProjectionMatrix();
    });
    */

    /*
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });


    _cube = new THREE.Mesh(geometry, material);
    _scene.add(_cube);
    */

    // create the floor

    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var floorMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      side: THREE.DoubleSide
    });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    _scene.add(floor);


    ///////////
    // LIGHT //
    ///////////

    // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    _scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x111111);
    _scene.add(ambientLight);

  }


  function update() {

  }


  function render() {
    _renderer.render(_scene, _camera);
  }


  function animate() {
    window.requestAnimationFrame(animate);
    render();
    update();
  }


  function loadScreenShot(url) {

  }


  // initialization
  init();

  // animation loop
  animate();

  // load a screenshot
  loadScreenShot('../img/iphone_4inch_portrait_02.png');

}());
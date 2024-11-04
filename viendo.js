var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1));

var canvasTexture = new THREE.CanvasTexture(cnvs);
canvasTexture.wrapS = THREE.RepeatWrapping;
canvasTexture.wrapT = THREE.RepeatWrapping;
canvasTexture.repeat.set( 2, 2 );

var geometry = new THREE.PlaneGeometry(10, 10, 20, 20);


var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
  map: canvasTexture,
  metalness: 0.25,
  roughness: 0.25
}));
scene.add(mesh);

var canvas = new fabric.Canvas('cnvs', {
  backgroundColor: 'white'
});
canvas.on("after:render", function() {
  mesh.material.map.needsUpdate = true;
});

var rect = new fabric.Rect({
  width: 50,
  height: 50,
  left: 50,
  top: 128,
  stroke: '#aaf',
  strokeWidth: 5,
  fill: '#faa',
  selectable: false,
  originX: 'center',
  originY: 'center'
});
canvas.add(rect);
function animateRandom(){
  var randomX = THREE.Math.randInt(50, 206);
  var randomY = THREE.Math.randInt(50, 206);

  rect.animate({left: randomX, top: randomY}, {
    duration: 1000,
    onChange: canvas.renderAll.bind(canvas),
    easing: fabric.util.ease.easeOutExpo
  })
}

var text = new fabric.IText('Three.js\n+\nFaBric.js', {
  fontSize: 40,
  textAlign: 'center',
  fontWeight: 'bold',
  left: 128,
  top: 128,
  angle: 30,
  originX: 'center',
  originY: 'center',
  shadow: 'blue -5px 6px 5px',
  styles: {
    0: {
      0: {
        fontSize: 60,
        fontFamily: 'Impact',
        fontWeight: 'normal',
        fill: 'orange'
      }
    },
    1: {
      0: {
        fill: "blue"
      }
    },
    2: {
      0: {
        textBackgroundColor: 'red'
      },
      2: {
        fill: 'fuchsia',
        stroke: 'orange',
        strokeWidth: 1
      }
    }
  }
});
text.setSelectionStyles({
  fontStyle: 'italic',
  fill: '',
  stroke: 'red',
  strokeWidth: 2
}, 1, 5);
canvas.add(text);
canvas.setActiveObject(text);

animateRandom();
setInterval(animateRandom, 1000);

var clock = new THREE.Clock();
var time = 0;
render();

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  mesh.lookAt(Math.cos(time * 0.314) * 20, Math.sin(time * 0.157) * 10, 40);
  renderer.render(scene, camera);
}































































if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
}
var isMobile = false;
var rightSide;
var leftSide;
var centerSide;
var backSide;
var svgPrintable;
var jpgLayoutThumbnail;
var canvasToImages = [];
var fonts = ["Arial", "Arial Black", "Comic Sans MS", "Courier", "Didot", "Georgia", "Helvetica", 'Impact', "Lucida Console", 'MMA-Champ', "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana "];
var svgGroup = [];
var container;
var stats;
var controls;
var camera;
var scene;
var renderer;
var light;
var material;
var materialCount;
var selectedMaterial = 'ZONE_x28_base_x29_';
var animations = [];
var newText = [];
var manager = new THREE.LoadingManager();
var mixers = [];
var object;
var operand1;
var operand2;
var operator1;
var operator2;
var solution;
var question;
var answer;
var textureLoader;
var map;
var textureMaterial;
var mesh;
var materials = [];
var geometries = [];
var pixelRatio = window.devicePixelRatio;
var width = window.innerWidth;
var height = window.innerHeight;
if (width < 0x3e0) {
  $('#desktopNav').hide();
  $("#mobileNav").show();
} else {
  $("#desktopNav").show();
  $("#mobileNav").hide();
}
$(window).resize(function (_0x12b1ca) {
  if (_0x12b1ca.target.width < 0x3e0) {
    $("#desktopNav").hide();
    $("#mobileNav").show();
  } else {
    $("#desktopNav").show();
    $('#mobileNav').hide();
  }
});
var textArray = [];
var lines = {
  'top': null,
  'left': null,
  'right': null,
  'bottom': null
};
var canvas = new fabric.Canvas("canvas", {
  'preserveObjectStacking': true,
  'selection': false
});
var jerseyName;
var texture = new THREE.Texture(document.getElementById('canvas'));
var canvasTexture = new THREE.CanvasTexture(document.getElementById("canvas"));
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var onClickPosition = new THREE.Vector2();
var raycastContainer;
var patternLists = ['pattern1', "pattern2", "pattern3", "pattern4", 'pattern5'];
if (width < height) {
  height = width;
}
canvas.backgroundColor = "#FFBE9F";
function loadSvg(_0x4f7f9f) {
  if (canvas._objects[0x0] != undefined) {
    fabric.loadSVGFromURL('assets/design/pattern/pattern' + _0x4f7f9f + ".svg", function (_0x4bf54f, _0x544b7a) {
      var _0x3889fe = fabric.util.groupSVGElements(_0x4bf54f, {
        'width': 0x400,
        'height': 0x400,
        'selectable': false,
        'crossOrigin': "anonymous"
      });
      _0x3889fe.top = 0x0;
      _0x3889fe.left = 0x0;
      svgGroup = _0x3889fe;
      canvas.remove(canvas._objects[0x0]);
      canvas.add(_0x3889fe);
      canvas.sendToBack(_0x3889fe);
      loadColorsName();
    });
  } else {
    fabric.loadSVGFromURL("assets/design/pattern/pattern" + _0x4f7f9f + ".svg", function (_0x5c3908, _0x27c9f1) {
      var _0x5f2e8e = fabric.util.groupSVGElements(_0x5c3908, {
        'width': 0x400,
        'height': 0x400,
        'selectable': false,
        'crossOrigin': 'anonymous'
      });
      _0x5f2e8e.top = 0x0;
      _0x5f2e8e.left = 0x0;
      svgGroup = _0x5f2e8e;
      canvas.add(_0x5f2e8e);
      canvas.sendToBack(_0x5f2e8e);
      loadColorsName();
    });
  }
}
function addText(_0x5a4b1a) {
  if (_0x5a4b1a != '') {
    jerseyName = new fabric.IText(_0x5a4b1a, {
      'fontSize': 0x1e,
      'textAlign': "center",
      'fontWeight': 'bold',
      'left': 0x64,
      'top': 0x118,
      'originX': 'center',
      'originY': "center",
      'selectable': true,
      'editable': false,
      'centeredScaling': true
    });
    canvas.add(jerseyName);
    canvas.setActiveObject(jerseyName);
    textContainer();
    $(".text-form").each(function () {
      this.reset();
    });
  }
}
function addText2(_0x484762, _0x5e0d02, _0x29c044) {
  if (_0x484762 != '') {
    jerseyName = new fabric.IText(_0x484762, {
      'fontSize': 0x1e,
      'textAlign': "center",
      'fontWeight': "bold",
      'left': _0x5e0d02,
      'top': _0x29c044,
      'originX': "center",
      'originY': 'center',
      'strokeWidth': 0x0,
      'selectable': true,
      'editable': false,
      'centeredScaling': true
    });
    canvas.add(jerseyName);
    canvas.setActiveObject(jerseyName);
    textContainer();
    $(".text-form").each(function () {
      this.reset();
    });
    addTextEnable = false;
  }
}
function addLabel(_0x4f6b89, _0x4d6b05, _0x5abec6) {
  if (_0x4f6b89 != '') {
    labelName = new fabric.IText(_0x4f6b89, {
      'fontSize': 0xf,
      'textAlign': "center",
      'left': _0x4d6b05,
      'top': _0x5abec6,
      'originX': "center",
      'originY': "center",
      'selectable': false
    });
    canvas.add(labelName);
  }
}
init();
loadSvg('1');
function init() {
  raycastContainer = document.getElementById("renderer");
  container = document.createElement("div");
  document.getElementById("container").appendChild(container);
  scene = new THREE.Scene();
  var _0x8e123 = width / height;
  camera = new THREE.PerspectiveCamera(0x1e, _0x8e123, 0x64, 0x4b0);
  camera.position.set(0x1f4, 0x0, 0x0);
  if (window.innerWidth < 0x300) {
    camera.fov = 0xa;
    camera.updateProjectionMatrix();
  }
  scene.add(camera);
  controls = new THREE.OrbitControls(camera, container);
  controls.minDistance = 0xc8;
  controls.minZoom = 0xc8;
  controls.maxDistance = 0x2bc;
  controls.maxZoom = 0x2bc;
  controls.update();
  var _0x31dae6;
  scene.add(new THREE.AmbientLight(0x777777));
  var _0x3f59da = [{
    'color': 0xffffff,
    'intensity': 0.35,
    'position': {
      'x': -0x1f4,
      'y': 0x140,
      'z': 0x1f4
    },
    'lookAt': {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    }
  }, {
    'color': 0xffffff,
    'intensity': 0.15,
    'position': {
      'x': 0xc8,
      'y': 0x32,
      'z': 0x1f4
    },
    'lookAt': {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    }
  }, {
    'color': 0xffffff,
    'intensity': 0.25,
    'position': {
      'x': 0x0,
      'y': 0x64,
      'z': -0x1f4
    },
    'lookAt': {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    }
  }, {
    'color': 0xffffff,
    'intensity': 0.15,
    'position': {
      'x': 0x1,
      'y': 0x0,
      'z': 0x0
    },
    'lookAt': {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    }
  }, {
    'color': 0xffffff,
    'intensity': 0.15,
    'position': {
      'x': -0x1,
      'y': 0x0,
      'z': 0x0
    },
    'lookAt': {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    }
  }];
  _0x3f59da.forEach(function (_0x55b7b9) {
    var _0x479dba = new THREE.DirectionalLight(_0x55b7b9.color, _0x55b7b9.intensity);
    var _0x19b706 = _0x55b7b9.position;
    var _0x2b733f = _0x55b7b9.lookAt;
    _0x479dba.position.set(_0x19b706.x, _0x19b706.y, _0x19b706.z);
    _0x479dba.lookAt(_0x2b733f.x, _0x2b733f.y, _0x2b733f.z);
    if (_0x55b7b9.angle) {}
    scene.add(_0x479dba);
  });
  object = new THREE.Object3D();
  _0x31dae6 = new THREE.DirectionalLight(0xffffff, 0.2);
  _0x31dae6.position.set(0x1f4, 0x64, 0x50);
  _0x31dae6.castShadow = true;
  _0x31dae6.shadow.mapSize.width = 0x400;
  _0x31dae6.shadow.mapSize.height = 0x400;
  _0x31dae6.shadow.camera.left = -0x12c;
  _0x31dae6.shadow.camera.right = 0x12c;
  _0x31dae6.shadow.camera.top = 0x12c;
  _0x31dae6.shadow.camera.bottom = -0x12c;
  _0x31dae6.shadow.camera.far = 0x64;
  _0x31dae6.shadowDarkness = 0.5;
  _0x31dae6.shadowCameraVisible = true;
  scene.add(_0x31dae6);
  textureLoader = new THREE.TextureLoader();

  
  renderer = new THREE.WebGLRenderer({
    'canvas': document.getElementById("renderer"),
    'antialias': true,
    'alpha': true,
    'preserveDrawingBuffer': true
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x0, 0x0);
  container.appendChild(renderer.domElement);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  loadObj();
  window.addEventListener("resize", onWindowResize, false);
  loadStyles();
  animate();
}
var img = document.createElement("img");
img.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
function deleteObject(_0x5a1d2f, _0x52ee96) {
  var _0x1a3a2e = _0x52ee96.target;
  var _0x1f0b4e = _0x1a3a2e.canvas;
  if (_0x1a3a2e.text == undefined) {
    imageContainer();
  } else {
    console.log(_0x1a3a2e);
    $('.textEditContainer').hide();
    $(".textCreateContainer").show();
  }
  _0x1f0b4e.remove(_0x52ee96.target);
  _0x1f0b4e.requestRenderAll();
  imageContainer();
  $(".textCreateContainer").show();
  $(".textEditContainer").hide();
  textContainer();
}
function renderIcon(_0x540b98, _0x39b479, _0x559c4b, _0x75a98a, _0x5cbce0) {
  var _0x13fc50 = this.cornerSize;
  _0x540b98.save();
  _0x540b98.translate(_0x39b479, _0x559c4b);
  _0x540b98.rotate(fabric.util.degreesToRadians(_0x5cbce0.angle));
  _0x540b98.drawImage(img, -_0x13fc50 / 0x4, -_0x13fc50 / 0x4, _0x13fc50, _0x13fc50);
  _0x540b98.restore();
}
function initPatch() {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "blue";
  fabric.Object.prototype.cornerStyle = 'square';
  if (isMobile == true) {
    fabric.Object.prototype.cornerSize = 0xf;
  } else {
    fabric.Object.prototype.cornerSize = 0xc;
  }
  fabric.Canvas.prototype.getPointer = function (_0x2e01c4, _0x57ac76) {
    if (this._absolutePointer && !_0x57ac76) {
      return this._absolutePointer;
    }
    if (this._pointer && _0x57ac76) {
      return this._pointer;
    }
    var _0x4a62b0;
    if (_0x2e01c4.touches != undefined) {
      _0x4a62b0 = new MouseEvent({
        'touchstart': 'mousedown',
        'touchmove': "mousemove",
        'touchend': "mouseup"
      }[_0x2e01c4.type], {
        'bubbles': true,
        'cancelable': true,
        'view': window,
        'detail': 0x1,
        'screenX': Math.round(_0x2e01c4.changedTouches[0x0].screenX),
        'screenY': Math.round(_0x2e01c4.changedTouches[0x0].screenY),
        'clientX': Math.round(_0x2e01c4.changedTouches[0x0].clientX),
        'clientY': Math.round(_0x2e01c4.changedTouches[0x0].clientY),
        'ctrlKey': false,
        'altKey': false,
        'shiftKey': false,
        'metaKey': false,
        'button': 0x0,
        'relatedTarget': null
      });
      var _0x44da37 = fabric.util.getPointer(_0x4a62b0);
      var _0x2741e7 = this.upperCanvasEl;
      var _0x220283 = _0x2741e7.getBoundingClientRect();
      var _0x1df7fb = _0x220283.width || 0x0;
      var _0x38e472 = _0x220283.height || 0x0;
      var _0x4fd49b;
    } else {
      var _0x44da37 = fabric.util.getPointer(_0x2e01c4);
      var _0x2741e7 = this.upperCanvasEl;
      var _0x220283 = _0x2741e7.getBoundingClientRect();
      var _0x1df7fb = _0x220283.width || 0x0;
      var _0x38e472 = _0x220283.height || 0x0;
      var _0x4fd49b;
    }
    if (!_0x1df7fb || !_0x38e472) {
      if ('top' in _0x220283 && "bottom" in _0x220283) {
        _0x38e472 = Math.abs(_0x220283.top - _0x220283.bottom);
      }
      if ('right' in _0x220283 && "left" in _0x220283) {
        _0x1df7fb = Math.abs(_0x220283.right - _0x220283.left);
      }
    }
    this.calcOffset();
    _0x44da37.x = Math.round(_0x44da37.x) - this._offset.left;
    _0x44da37.y = Math.round(_0x44da37.y) - this._offset.top;
    if (_0x2e01c4.target !== this.upperCanvasEl) {
      var _0x5b34df;
      if (isMobile == true) {
        _0x5b34df = getPositionOnScene(raycastContainer, _0x4a62b0);
        if (_0x5b34df) {
          _0x44da37.x = _0x5b34df.x;
          _0x44da37.y = _0x5b34df.y;
        }
      } else {
        _0x5b34df = getPositionOnScene(raycastContainer, _0x2e01c4);
        if (_0x5b34df) {
          _0x44da37.x = _0x5b34df.x;
          _0x44da37.y = _0x5b34df.y;
        }
      }
    }
    if (!_0x57ac76) {
      _0x44da37 = this.restorePointerVpt(_0x44da37);
    }
    if (_0x1df7fb === 0x0 || _0x38e472 === 0x0) {
      _0x4fd49b = {
        'width': 0x1,
        'height': 0x1
      };
    } else {
      _0x4fd49b = {
        'width': _0x2741e7.width / _0x1df7fb,
        'height': _0x2741e7.height / _0x38e472
      };
    }
    return {
      'x': _0x44da37.x * _0x4fd49b.width,
      'y': _0x44da37.y * _0x4fd49b.height
    };
  };
}
raycastContainer.addEventListener("mousedown", onMouseClick, false);
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0x0, 0x4))) {
  isMobile = true;
  raycastContainer.removeEventListener('mousedown', onMouseClick, false);
  raycastContainer.addEventListener("touchstart", onTouch, false);
}
var clicked;
var addTextEnable = false;
function enableAddText(_0x348bbf) {
  $("#renderer").css("z-index", "9999999");
  $('.styleContainer').css("display", "block");
  $("#textInfo").css("z-index", '9999999');
  $("#textInfo").css("display", "block");
  $("body").css("cursor", 'copy');
  addTextEnable = true;
  newText.push(_0x348bbf);
  canvas.on("mouse:down", function (_0x4a90ef) {
    if (addTextEnable) {
      if (_0x4a90ef.target._objects != undefined) {
        addText2(newText.at(-0x1), getUv.x * 984, getUv.y * 1004);
        $("#renderer").css("z-index", '1');
        $(".styleContainer").css("display", "none");
        $("#textInfo").css("display", "none");
        $("body").css("cursor", "default");
        $(".textCreateContainer").hide();
        $('.textEditContainer').show();
        $('#tab2').parent().addClass('active');
        $("#tab3").parent().removeClass("active");
        $("#tab4").parent().removeClass("active");
        $("#tab1").parent().removeClass("active");
        $(".textContainer").addClass("active");
        $("#tabs-4").removeClass('active');
        $("#tabs-3").removeClass("active");
        $("#tabs-2").addClass("active");
        $("#tabs-1").removeClass('active');
        textEditContainer();
        addTextEnable = false;
      }
    }
  });
}
canvas.on("object:modified", function (_0x20914f) {
  $("#inputHeight").val(_0x20914f.target.scaleY);
  $("#inputWidth").val(_0x20914f.target.scaleX);
});
canvas.on("mouse:down", function (_0x2ea2c1) {
  if (_0x2ea2c1.target._objects == undefined) {
    controls.enabled = false;
    if (_0x2ea2c1.target._text) {
      textEditContainer();
      $(".textCreateContainer").hide();
      $(".textEditContainer").show();
      $('#tab2').parent().addClass('active');
      $("#tab3").parent().removeClass("active");
      $("#tab4").parent().removeClass('active');
      $('#tab1').parent().removeClass("active");
      $(".textContainer").addClass("active");
      $("#tabs-4").removeClass("active");
      $("#tabs-3").removeClass("active");
      $("#tabs-2").addClass("active");
      $("#tabs-1").removeClass("active");
    } else {
      $(".textCreateContainer").show();
      $(".textEditContainer").hide();
      $('#tab3').parent().addClass("active");
      $("#tab2").parent().removeClass("active");
      $("#tab4").parent().removeClass("active");
      $('#tab1').parent().removeClass("active");
      $("#tabs-4").removeClass("active");
      $('#tabs-3').addClass('active');
      $("#tabs-2").removeClass("active");
      $("#tabs-1").removeClass("active");
    }
  } else {
    controls.enabled = true;
    $('.textCreateContainer').show();
    $('.textEditContainer').hide();
  }
});
canvas.on("object:rotating", function (_0x354d5e) {
  _0x354d5e.target.snapAngle = 0xf;
});
function onMouseClick(_0x19430c) {
  _0x19430c.preventDefault();
  const _0x2b17a9 = getPositionOnScene(raycastContainer, _0x19430c);
  if (_0x2b17a9) {
    const _0x1aea21 = canvas._offset;
    const _0x151824 = new MouseEvent(_0x19430c.type, {
      'clientX': _0x1aea21.left + _0x2b17a9.x,
      'clientY': _0x1aea21.top + _0x2b17a9.y
    });
    canvas.upperCanvasEl.dispatchEvent(_0x151824);
  }
}
function onTouch(_0x24e7ce) {
  _0x24e7ce.preventDefault();
  const _0x851e1d = getPositionOnSceneTouch(raycastContainer, _0x24e7ce);
  if (_0x851e1d) {
    const _0x4e7ad5 = canvas._offset;
    const _0x12cbc0 = new MouseEvent(_0x24e7ce.type, {
      'clientX': _0x4e7ad5.left + _0x851e1d.x,
      'clientY': _0x4e7ad5.top + _0x851e1d.y
    });
    canvas.upperCanvasEl.dispatchEvent(_0x12cbc0);
  }
}
function getRealPosition(_0x4d6ec3, _0xa9592e) {
  let _0x2f642e = _0x4d6ec3 === 'x' ? 5.5 : 4.5;
  return Math.round(_0xa9592e * 0x400) - _0x2f642e + 0x5;
}
var getUv;
function getPositionOnScene(_0x726de4, _0x6dfc9a) {
  var _0x4aec0f = getMousePosition(_0x726de4, _0x6dfc9a.clientX, _0x6dfc9a.clientY);
  onClickPosition.fromArray(_0x4aec0f);
  var _0x1c6ab8 = getIntersects(onClickPosition, object.children);
  if (_0x1c6ab8.length > 0x0 && _0x1c6ab8[0x0].uv) {
    var _0x58224f = _0x1c6ab8[0x0].uv;
    getUv = _0x58224f;
    _0x1c6ab8[0x0].object.material.map.transformUv(_0x58224f);
    return {
      'x': getRealPosition('x', _0x58224f.x),
      'y': getRealPosition('y', _0x58224f.y)
    };
  }
  return null;
}
function getPositionOnSceneTouch(_0x59299b, _0x2e632f) {
  var _0x39c51c = getMousePosition(_0x59299b, _0x2e632f.changedTouches[0x0].clientX, _0x2e632f.changedTouches[0x0].clientY);
  onClickPosition.fromArray(_0x39c51c);
  var _0x4ba8a7 = getIntersects(onClickPosition, object.children);
  if (_0x4ba8a7.length > 0x0 && _0x4ba8a7[0x0].uv) {
    var _0x3f487d = _0x4ba8a7[0x0].uv;
    getUv = _0x3f487d;
    _0x4ba8a7[0x0].object.material.map.transformUv(_0x3f487d);
    getUv = _0x3f487d;
    return {
      'x': getRealPosition('x', _0x3f487d.x),
      'y': getRealPosition('y', _0x3f487d.y)
    };
  }
  return null;
}
var getMousePosition = function (_0x111978, _0x3eb13e, _0x14fa66) {
  var _0x4787cd = _0x111978.getBoundingClientRect();
  return [(_0x3eb13e - _0x4787cd.left) / _0x4787cd.width, (_0x14fa66 - _0x4787cd.top) / _0x4787cd.height];
};
var getIntersects = function (_0x30e339, _0x3c9fcf) {
  mouse.set(_0x30e339.x * 0x2 - 0x1, -(_0x30e339.y * 0x2) + 0x1);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(_0x3c9fcf);
};
function loadColorsName() {
  var _0x2ba2a3;
  var _0x2fe42f = '';
  for (let _0x2c1813 = 0x0; _0x2c1813 < svgGroup._objects.length; _0x2c1813++) {
    if (svgGroup._objects[_0x2c1813].id != "Layer_1") {
      _0x2ba2a3 = svgGroup._objects[_0x2c1813].id.split("ZONE_x28_")[0x1].split("_x29_")[0x0];
      _0x2fe42f += "<div style=\"justify-content: space-between;align-items:center;margin: 5px auto;\" id=\"mat_" + _0x2ba2a3 + "\" class=\"xixcust\">\n        <div style=\"display: flex;justify-content: space-between;align-items:center;\">\n        <div style=\"width:100px;margin-right:10px;\"><input type=\"text\" id=\"" + svgGroup._objects[_0x2c1813].id + "\" value=\"" + svgGroup._objects[_0x2c1813].fill + "\"/></div><span style=\"text-transform:capitalize;\" class=\"egseas\">" + _0x2ba2a3 + "</span>\n        </div>\n          \n        </div>\n        <script>\n          colorPicker('" + svgGroup._objects[_0x2c1813].id + "','" + svgGroup._objects[_0x2c1813].fill + "')\n        </script>";
    }
  }
  $('.materials').empty();
  $("#inputMaterialsColor").css('display', "none");
  $(".materials").append(_0x2fe42f).html();
  if ($(".textCreateContainer")[0x0].innerHTML.trim() == '') {
    textContainer();
    imageContainer();
  } else {}
}
function colorPicker(_0x3d6419, _0x3bc832) {
  $('#' + _0x3d6419).spectrum({
    'type': "color",
    'color': _0x3bc832,
    'showButtons': false,
    'move': function (_0x3a78af) {
      svgGroup._objects.forEach(_0x49d802 => {
        if (_0x49d802.id == _0x3d6419) {
          _0x49d802.set("fill", _0x3a78af.toHexString());
          canvas.renderAll();
        }
      });
    }
  });
  $('#' + _0x3d6419).change(function (_0x3ff850) {});
}
function imageContainer() {
  var _0x1ed72b = '';
  var _0x1ce9aa = canvas._objects.filter(function (_0x86ebf) {
    return _0x86ebf._element != undefined;
  });
  _0x1ce9aa.map((_0x26f679, _0x2bfba8) => {
    _0x1ed72b += "<ul class=\"listsOfImages\" style=\"padding :0;\">\n        <li class=\"buttonLists\" style=\"margin:5px 0px;\">\n        <span>" + [_0x2bfba8 + 0x1] + ". Logo " + [_0x2bfba8 + 0x1] + "</span>\n        <div>\n          <i class=\"fas fa-edit\" style=\"margin:0px 5px;\" onclick=\"getImageById(" + _0x2bfba8 + ")\"></i>\n          <i class=\"fas fa-trash-alt\" style=\"margin:0px 5px;\" onclick=\"removeImageById(" + _0x2bfba8 + ")\"></i>\n        </div>\n      </li>\n      </ul>\n    ";
  });
  $(".bitmapContainer").empty().append("\n    <form class=\"form-group\" id=\"uploadImg\" runat=\"server\">\n        <input type=\"file\" class=\"form-control\" id=\"uploadedImg\" accept=\"image/*\"/>\n\t\t</form>\n  " + _0x1ed72b);
  document.getElementById('uploadedImg').addEventListener("change", function (_0x2c1412) {
    handleImage(_0x2c1412);
  });
}
function bitmapContainer(_0x3defd7) {
  $('.bitmapContainer').append("\n\t\t<form class=\"form-inline my-2\" id=\"uploadImg\" runat=\"server\">\n\t\t\t<input type=\"file\" id=\"uploadedImg\" accept=\"image/*\"/>\n\t\t</form>\n\t").html();
  document.getElementById("uploadedImg").addEventListener('change', function (_0xf482a1) {
    handleImage(_0xf482a1);
  });
  if (_0x3defd7 == "removed") {
    imageContainer();
  }
}
function colorTextWheel(_0x4575a6) {
  $('#textFill_' + _0x4575a6).spectrum({
    'color': canvas.getActiveObject().fill,
    'showInput': false,
    'type': 'color',
    'move': function (_0x109386) {
      canvas.getActiveObject().set('fill', _0x109386.toHexString());
      canvas.renderAll();
    }
  });
  $("#textFill_" + _0x4575a6).show();
}
function strokeTextWheel(_0x17a69c) {
  $("#textStroke_" + _0x17a69c).spectrum({
    'color': canvas.getActiveObject().stroke,
    'showInput': false,
    'type': "color",
    'move': function (_0x262ec2) {
      canvas.getActiveObject().set('stroke', _0x262ec2.toHexString());
      canvas.renderAll();
    }
  });
  $("#textStroke_" + _0x17a69c).show();
}
function textEditContainer() {
  var _0x466deb = '';
  var _0x59fe19 = canvas.getActiveObject();
  _0x466deb = "\n    <script>\n      colorTextWheel(0);   \n        strokeTextWheel(0);   \n    </script>\n    <form>\n        <div class=\"form-row\">\n          <div class=\"form-group col-9\">\n            <label for=\"inputText\">Text</label>\n              <input type=\"text\" class=\"form-control\"id=\"inputText\" placeholder=\"Name, number etc\" oninput=\"changeText(0,this)\" type=\"text\" value=" + _0x59fe19.text + ">\n          </div>\n          <div class=\"form-group col-3\">\n        <input style=\"display: none; !important;opacity:0;\" class=\"col-12\" value=\"" + _0x59fe19.fill + "\" onchange=\"changeTextColor(textFill_" + 0x0 + ".value)\"  id=\"textFill_" + 0x0 + "\">\n          </div>\n        </div>\n        <div class=\"form-row\">\n        <div class=\"form-group col-6\">\n          <label for=\"inputOutlineWidth\">Stroke Width</label>\n          <input type=\"number\" onchange=\"changeOutlineWidth(inputOutlineWidth.value)\" class=\"form-control\" id=\"inputOutlineWidth\" min=\"0\" max=\"3\" step=\"0.1\" placeholder=\"Font size\" value=\"" + _0x59fe19.strokeWidth + "\" >\n        </div>\n        <div class=\"form-group col-6\">\n          <label for=\"textStroke_" + 0x0 + "\">Stroke Color</label>\n          <input style=\"display:none;opacity:0;\" class=\"col-12\" value=\"" + _0x59fe19.fill + "\" onchange=\"changeTextStrokeColor(textStroke_" + 0x0 + ".value)\"  id=\"textStroke_" + 0x0 + "\">\n        <script>$('#textStroke_0').hide();</script>\n        </div>\n      </div>\n      <div class=\"form-row\">\n        <div class=\"form-group col-md-6\">\n          <label for=\"inputFontSize\">Font size</label>\n          <input type=\"number\" onchange=\"changeFontSize(inputFontSize.value)\" class=\"form-control\" id=\"inputFontSize\" placeholder=\"Font size\" value=\"" + _0x59fe19.fontSize + "\" >\n        </div>\n        <div class=\"form-group col-md-6\">\n          <label for=\"selectFont\">Font family</label>\n          <select class=\"form-control\" id=\"selectFont\" style=\"margin-right:5px;\"  onchange=\"changeFont(value)\">" + fonts.map(_0x293a1d => {
    return _0x59fe19.fontFamily == _0x293a1d ? "\n                  <option selected value=\"" + _0x59fe19.fontFamily + "\">" + _0x59fe19.fontFamily + "</option>\n                  " : "<option style=\"font-family: " + _0x293a1d + "\" value=\"" + _0x293a1d + "\">" + _0x293a1d + "</option>";
  }) + "</select>\n        </div>\n      </div>\n      <div class=\"form-row\">\n        <div class=\"form-group col-md-6\">\n          <label for=\"inputWidth\">Width</label>\n          <input type=\"number\" onchange=\"changeScale(inputWidth.value)\" class=\"form-control\" id=\"inputWidth\" placeholder=\"Width\" value=\"" + _0x59fe19.scaleX + "\" >\n        </div>\n        <div class=\"form-group col-md-6\">\n          <label for=\"inputHeight\">Height</label>\n          <input type=\"number\" onchange=\"changeScale(inputHeight.value)\" class=\"form-control\" id=\"inputHeight\" placeholder=\"Height\" value=\"" + _0x59fe19.scaleY + "\" >\n        </div>\n      </div>\n    </form>\n  \n  ";
  $(".textEditContainer").empty().append(_0x466deb);
}
function textContainer(_0x4f6689, _0x2934e5) {
  var _0xfc57ba = '';
  var _0x5bba67 = 0x0;
  canvas._objects.map(_0x4b1f71 => {
    if (_0x4b1f71.text != undefined) {
      _0x5bba67 += 0x1;
      _0xfc57ba += "\n\t\t\t<ul class=\"listTexts\" style=\"padding :0;\">\n\t\t\t\t<li id=\"text-" + _0x5bba67 + "\" class=\"buttonLists\">\n          <span style=\"justify-content:center;align-items: center;display: flex;\">" + _0x5bba67 + ". " + _0x4b1f71.text + "</span><i class=\"fas fa-trash\" style=\"margin:0px 5px;color:" + _0x4b1f71.fill + ";\" onclick=\"removeTextLayerById(" + _0x5bba67 + ")\" ></i>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t";
    }
  });
  $('.textCreateContainer').empty().append("\n\t\t<form onsubmit=\"return false\" class=\"form-inline my-2 text-form row\" style=\"display:flex; justify-content:space-around;\">\n\t\t\t<input class=\"col-9 form-control mr-sm-2\" type=\"text\" id=\"newText\"\n\t\t\t\tplaceholder=\"Name, Number etc\">\n\t\t\t<button class=\"col-2 btn btn-outline-primary my-2 my-sm-0\" type=\"button\" style=\"border-color:#47a447; color:#47a447;\"\n\t\t\t\tonclick=\"enableAddText(newText.value)\" data-toggle=\"modal\" data-target=\"#myModal\">Add Text</button>\n\t\t</form>\n        <div id=\"id-myModal\" class=\"modal\" tabindex=\"-1\" role=\"dialog\">\n                    <div class=\"modal-dialog\" role=\"document\">\n                        <div class=\"modal-content\" style=\"min-width: calc(512px + 2.5rem)\">\n                            <div class=\"modal-header\">\n                                <h5 class=\"modal-title\">EDITOR</h5>\n                                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                  <span aria-hidden=\"true\">&times;</span>\n                </button>\n                            </div>\n                            <div class=\"modal-body\">\n                                <div class=\"row color-picker\" style=\"display: flex; align-items: center; padding: 20px\">\n                                    <div class=\"color-palete\"></div>\n                                </div>\n                                <div class=\"row text-color-picker\" style=\"display: flex; align-items: center; padding: 20px\">\n                                    <div class=\"text-color-palete\"></div>\n                                </div>\n                                <div class=\"canvas-editor\"></div>\n                                <div class=\"text-editor\">\n                                    <!-- <canvas id=\"canvas\" height=\"512\" width=\"512\"></canvas> -->\n                                </div>\n                            </div>\n                            <div class=\"modal-footer\">\n                                <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" onclick=\"modalSave()\">\n                  Add text\n                </button>\n                                <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">\n                  Close\n                </button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\t" + _0xfc57ba);
}
function changeScale(_0x277cbe) {
  $("#inputWidth").val(_0x277cbe);
  $("#inputHeight").val(_0x277cbe);
  canvas.getActiveObject().set("scaleX", _0x277cbe);
  canvas.getActiveObject().set("scaleY", _0x277cbe);
  canvas.renderAll();
}
function changeFont(_0x216a22) {
  canvas.getActiveObject().fontFamily = _0x216a22;
  canvas.renderAll();
}
function modalSave() {
  canvas.discardActiveObject().renderAll();
}
function imgsUpload(_0x3c5217, _0xe94844) {
  var _0x23189c = new fabric.Image(_0x3c5217);
  _0x23189c.set({
    'angle': 0x0,
    'padding': 0x5,
    'left': 0x226,
    'top': 0x2bc,
    'scaleX': _0xe94844,
    'scaleY': _0xe94844,
    'cornersize': 0xa,
    'selectable': true,
    'centeredScaling': true
  });
  canvas.add(_0x23189c);
  canvas.setActiveObject(_0x23189c);
  console.log(canvasToImages);
  canvas.renderAll();
  $('#uploadImg').each(function () {
    this.reset();
  });
}
function openModal(_0x3dbf4a) {
  if (_0x3dbf4a != '') {
    loadColors(_0x3dbf4a);
    $("#id-findModal").modal();
  } else {
    $("#id-findModal").modal();
  }
}
var imageName = [];
var logos = [];
function uploadImages(_0x463981, _0x4af863) {
  var _0x3562e2 = new Image();
  if (imageName == '') {
    imageName = [_0x4af863.name.replace(/\.[^/.]+$/, '')];
  } else {
    imageName.push(_0x4af863.name.replace(/\.[^/.]+$/, ''));
  }
  _0x3562e2.src = _0x463981.target.result;
  logos.push(_0x3562e2.src);
  _0x3562e2.onload = function (_0xf44dea) {
    if (_0xf44dea.target.width >= 0x1f4) {
      imgsUpload(_0x3562e2, 0.2);
    } else if (_0xf44dea.target.width <= 0x1f4) {
      imgsUpload(_0x3562e2, 0.4);
    }
    imageContainer();
  };
}
var mockup = [];
function convertToImage() {
  var _0x18958c = [{
    'x': "-500",
    'y': '0',
    'z': '0'
  }, {
    'x': '',
    'y': '0',
    'z': "500"
  }, {
    'x': '',
    'y': '0',
    'z': '-500'
  }, {
    'x': '500',
    'y': '0',
    'z': '0'
  }];
  mockup = _0x18958c.forEach(_0xdb2944 => {
    return _0xdb2944;
  });
  canvas.discardActiveObject().renderAll();
}
function listsOfImages(_0x3de6c7, _0x212fd8) {
  var _0x533952 = '';
  var _0x48b58e = 0x0;
  canvas._objects.map(_0x5b4459 => {
    if (_0x5b4459._element != undefined) {
      _0x48b58e += 0x1;
      _0x533952 += "<ul class=\"listsOfImages\" style=\"padding :0;\">\n          <li class=\"buttonLists\" style=\"margin:5px 0px;\">\n            <span>" + _0x48b58e + ". " + imageName[_0x48b58e - 0x1] + "</span>\n            <div>\n              <i class=\"fas fa-edit\" style=\"margin:0px 5px;\" onclick=\"getImageById(" + _0x48b58e + ")\"></i>\n              <i class=\"fas fa-trash-alt\" style=\"margin:0px 5px;\" onclick=\"removeImageById(" + _0x48b58e + ")\"></i>\n            </div>\n          </li>\n        </ul>\n      ";
    }
  });
  $(".listsOfImages").empty().append(_0x533952);
}
function getImageById(_0x25f030) {
  var _0x308d93 = canvas._objects.filter(function (_0x4c854c) {
    return _0x4c854c._element != undefined;
  });
  canvas.setActiveObject(_0x308d93[_0x25f030]);
  openModal('');
  canvas.renderAll();
}
function removeImageById(_0xa05674) {
  var _0xba5370 = canvas._objects.filter(function (_0x22200b) {
    return _0x22200b._element != undefined;
  });
  canvas.remove(_0xba5370[_0xa05674]);
  canvasToImages.splice(0x0, 0x1);
  console.log(canvasToImages);
  $(".listsOfImages").empty();
  imageContainer();
  canvas.renderAll();
}
function getTextLayerById(_0x268979, _0x19cd90) {
  if (_0x268979 != null) {
    var _0x17bb28 = "<h3>Colors " + _0x268979 + '</h3>';
    colors.forEach(function (_0xe8fb52) {
      _0x17bb28 += "<div class=\"colaz\" onClick=\"changeTextColor('" + _0x19cd90 + "'" + ",'" + _0xe8fb52 + "')\" style=\"background:" + _0xe8fb52 + ";\"></div>";
    });
    $('.text-color-picker').show();
    $(".text-color-palete").empty();
    $(".text-color-palete").append(_0x17bb28).html();
    $(".text-editor").hide();
    $(".text-color-palete").show();
    openModal('');
  }
}
function changeText(_0x3c9b45, _0x50454f) {
  console.log(_0x50454f.value);
  canvas.getActiveObject().text = _0x50454f.value;
  canvas.renderAll();
}
var colorChange;
function changeFontSize(_0x2a5fd9) {
  canvas.getActiveObject().set("fontSize", Number(_0x2a5fd9));
  canvas.renderAll();
}
function changeOutlineWidth(_0x244776) {
  canvas.getActiveObject().set('strokeWidth', Number(_0x244776));
  canvas.renderAll();
}
function changeTextColor(_0x1e77bb) {
  canvas.getActiveObject().set("fill", _0x1e77bb);
  canvas.renderAll();
}
function changeTextStrokeColor(_0x314ce4) {
  canvas.getActiveObject().set("stroke", _0x314ce4);
  canvas.renderAll();
}
function removeTextLayerById(_0x3d32e7) {
  canvas.remove(canvas.getObjects()[_0x3d32e7]);
  textContainer();
  canvas.renderAll();
}
function handleImage(_0x3927ce) {
  var _0x4f5bfb = new FileReader();
  _0x4f5bfb.onload = function (_0x5e1f7f) {
    uploadImages(_0x5e1f7f, _0x3927ce.target.files[0x0]);
  };
  _0x4f5bfb.readAsDataURL(_0x3927ce.target.files[0x0]);
}
function inRange(_0x2d93f6, _0x23bc43) {
  return !!(Math.max(_0x2d93f6, _0x23bc43) - Math.min(_0x2d93f6, _0x23bc43) <= 0x1);
}
function loadColors(_0x2c735b) {
  var _0x4c1903 = "<h3>Colors " + _0x2c735b + "</h3>";
  colors.forEach(function (_0x377fcb) {
    _0x4c1903 += "<div class=\"colaz\" onClick=\"changeColor('" + _0x2c735b + "'" + ",'" + _0x377fcb + "')\" style=\"background:" + _0x377fcb + ";\"></div>";
  });
  $(".color-palete").empty();
  $(".color-palete").append(_0x4c1903).html();
}
function selectMaterial(_0x1beed7, _0x40fc9d, _0x14f833) {
  canvas.renderAll();
  selectedMaterial = _0x14f833;
  loadColorsName();
}
function loadObj() {
  canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureMaterial = new THREE.MeshPhongMaterial({
    'map': canvasTexture
  });
  texture.needsUpdate = true;
  var _0x47d08a = new THREE.OBJLoader2(manager);
  _0x47d08a.load("assets/objects/test.obj", function (_0x134d44) {
    if (object != null) {
      scene.remove(object);
    }
    object = null;
    object = _0x134d44.detail.loaderRootNode;
    materials = [];
    object.traverse(function (_0x59c104) {
      if (_0x59c104.isMesh) {
        _0x59c104.material.map = textureMaterial;
      }
    });
    object.children[0x0].material = textureMaterial;
    render();
    var _0x2e099f = height / 0x5;
    object.scale.set(_0x2e099f, _0x2e099f, _0x2e099f);
    object.position.set(0x0, -_0x2e099f * 0.2, 0x0);
    if (window.innerWidth < 0x300) {
      object.position.set(0x0, -_0x2e099f * 0.3, 0x0);
    }
    object.rotation.set(0x0, Math.PI / 0x2, 0x0);
    object.receiveShadow = true;
    object.castShadow = true;
    canvas.on('after:render', function () {
      object.children[0x0].material.map.needsUpdate = true;
    });
    scene.add(object);
  }, function (_0x56bbc4) {
    console.log(_0x56bbc4.loaded / _0x56bbc4.total * 0x64 + "% loaded");
  });
}
function loadStyles() {
  var _0x2999d2 = '';
  patternLists.forEach(_0x4ec1dd => {
    let _0x2b1058 = _0x4ec1dd.split("pattern")[0x1];
    _0x2999d2 = "\n\t\t\t<button  style=\"border-radius: 5px;overflow: hidden;border: 1px solid #47a447;margin: 5px;background: transparent;padding: 0;\" class=\"" + _0x4ec1dd + " btn btn-outline-basic\" onclick=\"loadSvg(" + _0x2b1058 + ")\"><img width=\"100\" src=\"assets/design/thumbnail/" + _0x4ec1dd + ".jpg\"/></button>\n\t\t";
    $(".styles").append(_0x2999d2).html();
  });
}
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (width < height) {
    height = width;
  }
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  initPatch();
}
function render() {
  renderer.render(scene, camera);
}
async function back() {
  camera.position.x = -0x1f4;
  camera.position.y = 0x0;
  camera.position.z = 0x0;
  console.log("back");
}
async function left() {
  camera.position.x = 0x0;
  camera.position.y = 0x0;
  camera.position.z = -0x1f4;
  console.log("left");
}
async function right() {
  camera.position.x = 0x0;
  camera.position.y = 0x0;
  camera.position.z = 0x1f4;
  console.log("right");
}
async function center() {
  camera.position.x = 0x0;
  camera.position.y = 0x0;
  camera.position.z = 0x1f4;
}
async function center2() {
  camera.position.x = 0x1f4;
  camera.position.y = 0x0;
  camera.position.z = 0x0;
}
function b64ToUint8Array(_0x46c31a) {
  var _0x211792 = atob(_0x46c31a.split(',')[0x1]);
  var _0xa208b = [];
  var _0x45fcbf = 0x0;
  while (_0x45fcbf < _0x211792.length) {
    _0xa208b.push(_0x211792.charCodeAt(_0x45fcbf));
    _0x45fcbf++;
  }
  return new Uint8Array(_0xa208b);
}
function convertToImage() {
  setTimeout(() => {
    left().then(leftSide = raycastContainer.toDataURL("image/png"), canvasToImages.push(leftSide));
  }, 0x64);
  setTimeout(() => {
    back().then(backSide = raycastContainer.toDataURL('image/png'), canvasToImages.push(backSide));
  }, 0xc8);
  setTimeout(() => {
    right().then(rightSide = raycastContainer.toDataURL('image/png'), canvasToImages.push(rightSide));
  }, 0x12c);
  setTimeout(() => {
    center().then(centerSide = raycastContainer.toDataURL('image/png'), canvasToImages.push(centerSide));
  }, 0x190);
  setTimeout(() => {
    center2();
    svgPrintable = canvas.toSVG();
    canvasToImages.push(svgPrintable);
    jpgLayoutThumbnail = canvas.toDataURL("image/png");
    canvasToImages.push(jpgLayoutThumbnail);
    for (let _0x5191d4 = 0x0; _0x5191d4 < logos.length; _0x5191d4++) {
      canvasToImages.push(logos[_0x5191d4]);
    }
  }, 0x1f4);
  setTimeout(() => {
    let _0x12fc79 = localStorage.getItem('token');
    let _0x5ab9e7 = document.getElementById("qty").value;
    let _0x8cdf3b = '';
    let _0x163c5d = '';
    console.log(canvasToImages);
    for (let _0x5d3c3a = 0x0; _0x5d3c3a < canvasToImages.length; _0x5d3c3a++) {
      if (_0x5d3c3a == 0x0) {
        _0x8cdf3b = canvasToImages[_0x5d3c3a];
      } else {
        _0x8cdf3b = _0x8cdf3b + '|' + canvasToImages[_0x5d3c3a];
      }
      let _0x395fc9 = canvasToImages[_0x5d3c3a].match(/[^:/]\w+(?=;|,)/)[0x0];
      if (_0x395fc9 != " none") {
        if (_0x395fc9 == 'png') {
          if (_0x163c5d == '') {
            _0x163c5d = "png";
          } else {
            _0x163c5d = _0x163c5d + '|' + "png";
          }
          $.post("upload.php", {
            'fileType': "png",
            'userName': _0x12fc79,
            'm_qty': _0x5ab9e7,
            'm_i': _0x5d3c3a,
            'img': canvasToImages[_0x5d3c3a]
          }, function (_0x9a0089) {
            console.log(_0x9a0089);
          });
        } else {
          if (_0x163c5d == '') {
            _0x163c5d = "jpeg";
          } else {
            _0x163c5d = _0x163c5d + '|' + "jpeg";
          }
          $.post('upload.php', {
            'fileType': "jpeg",
            'userName': _0x12fc79,
            'm_i': _0x5d3c3a,
            'img': canvasToImages[_0x5d3c3a]
          }, function (_0x449ff5) {
            console.log(_0x449ff5);
          });
        }
      } else {
        if (_0x395fc9 == " none") {
          if (_0x163c5d == '') {
            _0x163c5d = 'svg';
          } else {
            _0x163c5d = _0x163c5d + '|' + "svg";
          }
          $("#imageContainer").append(canvasToImages[_0x5d3c3a]);
          var _0x247f45 = new XMLSerializer().serializeToString($('#imageContainer').children()[0x0]);
          var _0x451391 = window.btoa(_0x247f45);
          $.post("upload.php", {
            'fileType': 'svg',
            'userName': _0x12fc79,
            'm_i': _0x5d3c3a,
            'img': _0x451391
          }, function (_0x46f9b0) {
            console.log(_0x46f9b0);
          });
        }
      }
    }
    $.post('send_api.php', {
      'userName': _0x12fc79,
      'xfileType': _0x163c5d,
      'm_qty': _0x5ab9e7,
      'xm_data': _0x8cdf3b
    }, function (_0x4187de) {
      window.location = "https://speedjersey.com/cart";
    });
    canvasToImages = [];
  }, 0x2bc);
  canvas.discardActiveObject().renderAll();
}
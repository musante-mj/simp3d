import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Inicializar Fabric.js
const canvas = new fabric.Canvas("cnvs");
canvas.backgroundColor = 'yellow';
canvas.renderAll();

let mesh;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const onClickPosition = new THREE.Vector3();

// Función para actualizar la textura en cada renderizado de Fabric
canvas.on("after:render", function () {
  if (mesh && mesh.material.map) {
    mesh.material.map.needsUpdate = true;
  }
});



// Añadir texto en Fabric
const text = new fabric.IText("Three.js\n", {
  fontSize: 40,
  textAlign: "center",
  fontWeight: 'bold',
  left: 128,
  top: 128,
  angle: 30,
  originX: "center",
  originY: "center",
  shadow: "blue -5px 6px 5px"
});
canvas.add(text);

// Añadir imagen en Fabric
const imgElement = document.getElementById("wiki");
const imageInstance = new fabric.Image(imgElement, {
  angle: 0,
  left: 300,
  opacity: 1,
  cornerSize: 30
});
canvas.add(imageInstance);

// Inicializar Three.js
let camera, renderer, scene;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
var isMobile = false;
const container = document.getElementById("renderer");
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Añadir iluminación en la escena de Three.js
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1));

var canvasTexture = new THREE.CanvasTexture(cnvs);

// Cargar objeto 3D en Three.js
const loader = new OBJLoader();
loader.load(
  './shirt.obj',
  function (object) {
    mesh = object;

    // Verificar si el objeto tiene hijos y que el primer hijo tenga un material
    if (mesh.children && mesh.children.length > 0) {
      const child = mesh.children[0];

      // Asignar la textura al material del primer hijo
      if (child.material) {
        child.material.map = canvasTexture; // Asigna la textura
        child.material.needsUpdate = true; // Indica que el material necesita actualizarse
      }
    }

    scene.add(mesh);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% cargado');
  },
  function (error) {
    console.error('Error al cargar el archivo .obj', error);
  }
);





  
  var clock = new THREE.Clock();
  var time = 0;
  
  function render() {
	requestAnimationFrame(render);
	time += clock.getDelta();
	renderer.render(scene, camera);
  }
  
  render();






fabric.Canvas.prototype.getPointer = function (_0x2fd889, _0x112d2f) { 
             //SE RECIBNEN 2 VARIABLES HXDCM COMO ARGUNMENTOS DE LA FUNCION 
  if (this._absolutePointer && !_0x112d2f) {
    return this._absolutePointer;
  }
  if (this._pointer && _0x112d2f) {
    return this._pointer;
  }
  var _0x49c1c2;
//NUEVA VARIABLE HEXADECIMAL
  if (_0x2fd889.touches != undefined) {

    _0x49c1c2 = new MouseEvent({
      'touchstart': "mousedown",
      'touchmove': "mousemove",
      'touchend': "mouseup"
    }[_0x2fd889.type], {
      'bubbles': true,
      'cancelable': true,
      'view': window,
      'detail': 0x1,
      'screenX': Math.round(_0x2fd889.changedTouches[0x0].screenX),
      'screenY': Math.round(_0x2fd889.changedTouches[0x0].screenY),
      'clientX': Math.round(_0x2fd889.changedTouches[0x0].clientX),
      'clientY': Math.round(_0x2fd889.changedTouches[0x0].clientY),
      'ctrlKey': false,
      'altKey': false,
      'shiftKey': false,
      'metaKey': false,
      'button': 0x0,
      'relatedTarget': null
    });
//DEFINE MUCHAS (6)
    var _0x305925 = fabric.util.getPointer(_0x49c1c2);
    var _0x1d2264 = this.upperCanvasEl;
    var _0x50f9ea = _0x1d2264.getBoundingClientRect();
    var _0x481a5f = _0x50f9ea.width || 0x0;
    var _0x2f2f25 = _0x50f9ea.height || 0x0;
    var _0x2dd35c;
  } else {
    var _0x305925 = fabric.util.getPointer(_0x2fd889);
    var _0x1d2264 = this.upperCanvasEl;
    var _0x50f9ea = _0x1d2264.getBoundingClientRect();
    var _0x481a5f = _0x50f9ea.width || 0x0;
    var _0x2f2f25 = _0x50f9ea.height || 0x0;
    var _0x2dd35c;
  }




//LOGICA:

  if (!_0x481a5f || !_0x2f2f25) {
    if ('top' in _0x50f9ea && "bottom" in _0x50f9ea) {
      _0x2f2f25 = Math.abs(_0x50f9ea.top - _0x50f9ea.bottom);
    }
    if ("right" in _0x50f9ea && "left" in _0x50f9ea) {
      _0x481a5f = Math.abs(_0x50f9ea.right - _0x50f9ea.left);
    }
  }
  this.calcOffset();
  
  _0x305925.x = _0x305925.x - this._offset.left;
  _0x305925.y = _0x305925.y - this._offset.top;
  
  
  
  
  
  if (_0x2fd889.target !== this.upperCanvasEl) {
    var _0x48231a;
    if (isMobile == true) {
      _0x48231a = getPositionOnSceneTouch(container, _0x2fd889);
      if (_0x48231a) {
        console.log(_0x48231a);
        _0x305925.x = _0x48231a.x;
        _0x305925.y = _0x48231a.y;
      }
    } else {
      _0x48231a = getPositionOnScene(container, _0x2fd889);
      if (_0x48231a) {
        console.log(_0x48231a);
        _0x305925.x = _0x48231a.x;
        _0x305925.y = _0x48231a.y;
      }
    }
  }



  if (!_0x112d2f) {
    _0x305925 = this.restorePointerVpt(_0x305925);
  }
  
  
  if (_0x481a5f === 0x0 || _0x2f2f25 === 0x0) {
    _0x2dd35c = {
      'width': 0x1,
      'height': 0x1
    };
  } else {
    _0x2dd35c = {
      'width': _0x1d2264.width / _0x481a5f,
      'height': _0x1d2264.height / _0x2f2f25
    };
  }

  return {
    'x': _0x305925.x * _0x2dd35c.width,
    'y': _0x305925.y * _0x2dd35c.height
  };
};            //  F I N  CUSTOM GETpOINTER







container.addEventListener("mousedown", onMouseEvt, false);



if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0x0, 0x4))) {
  isMobile = true;
  container.addEventListener('touchstart', onTouch, false);
}




//FUNCIONES Y HELPERS DE ONTOUCH Y ONMOUSE EVETNT

function onTouch(_0x2c7070) {
  _0x2c7070.preventDefault();
  const _0x5bff07 = getPositionOnSceneTouch(container, _0x2c7070);
  if (_0x5bff07) {
    const _0x10895f = canvas._offset;
    const _0x53a8fa = new MouseEvent(_0x2c7070.type, {
      'clientX': _0x10895f.left + _0x5bff07.x,
      'clientY': _0x10895f.top + _0x5bff07.y
    });
    canvas.upperCanvasEl.dispatchEvent(_0x53a8fa);
  }
}

function getPositionOnSceneTouch(_0x7b52e8, _0xd8dbfe) {
  var _0x503c0b = getMousePosition(_0x7b52e8, _0xd8dbfe.changedTouches[0x0].clientX, _0xd8dbfe.changedTouches[0x0].clientY);
  onClickPosition.fromArray(_0x503c0b);
  console.log(scene);
  var _0x55333c = getIntersects(onClickPosition, scene.children);
  if (_0x55333c.length > 0x0 && _0x55333c[0x0].uv) {
    var _0x4e3f5f = _0x55333c[0x0].uv;
    _0x55333c[0x0].object.material.map.transformUv(_0x4e3f5f);
    getUv = _0x4e3f5f;
    return {
      'x': getRealPosition('x', _0x4e3f5f.x),
      'y': getRealPosition('y', _0x4e3f5f.y)
    };
  }
  return null;
}




function onMouseEvt(_0x50244e) { 
  _0x50244e.preventDefault();
  const _0x72352f = getPositionOnScene(container, _0x50244e);
  if (_0x72352f) {
    const _0x50eaa8 = canvas._offset;
    const _0xeeadcf = new MouseEvent(_0x50244e.type, {
      'clientX': _0x50eaa8.left + _0x72352f.x,
      'clientY': _0x50eaa8.top + _0x72352f.y
    });
    console.log(_0xeeadcf);
    canvas.upperCanvasEl.dispatchEvent(_0xeeadcf);
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCIONES DE OBTENCION DE DATOS ETC, GETXXXXX

function getPositionOnScene(_0x205558, _0x53ea00) {
  console.log(_0x53ea00);
  console.log(scene);
  var _0x2dbfc3 = getMousePosition(container, _0x53ea00.clientX, _0x53ea00.clientY);
  onClickPosition.fromArray(_0x2dbfc3);
  var _0x3f7783 = getIntersects(onClickPosition, scene.children);
  if (_0x3f7783.length > 0x0 && _0x3f7783[0x0].uv) {
    var _0xc43813 = _0x3f7783[0x0].uv;
    _0x3f7783[0x0].object.material.map.transformUv(_0xc43813);
    return {
      'x': getRealPosition('x', _0xc43813.x),
      'y': getRealPosition('y', _0xc43813.y)
    };
  }
  return null;
}

function getRealPosition(_0x257037, _0x14116f) {
  let _0x557377 = _0x257037 === 'x' ? 4.5 : 5.5;
  return Math.round(_0x14116f * 0x200) - _0x557377;
}

var getMousePosition = function (_0x3430ce, _0x5aa9f9, _0x516fdc) {
  var _0x5021f7 = _0x3430ce.getBoundingClientRect();
  return [(_0x5aa9f9 - _0x5021f7.left) / _0x5021f7.width, (_0x516fdc - _0x5021f7.top) / _0x5021f7.height];
};

var getIntersects = function (_0x22e88c, _0x46e71c) {
  mouse.set(_0x22e88c.x * 0x2 - 0x1, -(_0x22e88c.y * 0x2) + 0x1);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(_0x46e71c);
};


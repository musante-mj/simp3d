/**
 * FabricJS  
 **/

var canvas = new fabric.Canvas( "cnvs" );
    canvas.backgroundColor = "yellow";
    canvas.on("after:render", function() {
        mesh.material.map.needsUpdate = true;
    });

var text = new fabric.IText('Three.js\n', {
  fontSize: 40,
  textAlign: 'center',
  fontWeight: 'bold',
  left: 128,
  top: 128,
  angle: 30,
  originX: 'center',
  originY: 'center',
  shadow: 'blue -5px 6px 5px'   
});
canvas.add(text);

var imgElement = document.getElementById("wiki");
var imageinstance = new fabric.Image(imgElement, {
  angle: 0,
  left: 300,
  opacity: 1,
  cornerSize: 30,
});
canvas.add(imageinstance);

/**
 * ThreeJS
 **/
var containerHeight = "512";
var containerWidth = "512";
var camera, renderer, container, scene, texture, material, geometry;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

/* Raycaster */
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var onClickPosition = new THREE.Vector2();
var isMobile = false;
/**
 ** Renderer
 **/
 container = document.getElementById( "renderer" );
 renderer = new THREE.WebGLRenderer({ antialias: true });
 renderer.setPixelRatio( window.devicePixelRatio );
 renderer.setSize(window.innerWidth, window.innerHeight);
 camera.updateProjectionMatrix();
 container.appendChild( renderer.domElement ); 
/* 
 * End Renderer 
 */

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1));

var canvasTexture = new THREE.CanvasTexture(cnvs);


// instancia un cargador
const loader = new OBJLoader();


// Carga un recurso
loader.load(
  '/.shirt.obj',
  function(object) {
      // Asigna el objeto a una variable
      const mesh = object;

      // Asigna el material con la textura del canvas
      mesh.traverse(function(child) {
          if (child.isMesh) {
              child.material = new THREE.MeshBasicMaterial({ map: canvasTexture });
          }
      });

      // Añadir el objeto a la escena
      scene.add(mesh);
  },
  function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% cargado');
  },
  function(error) {
      console.log('Ocurrió un error al cargar el objeto');
  }
);



function animateRandom(){
  var randomX = THREE.Math.randInt(50, 206);
  var randomY = THREE.Math.randInt(50, 206);
}

animateRandom();
setInterval(animateRandom, 1000);

var clock = new THREE.Clock();
var time = 0;

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  renderer.render(scene, camera);
}

render();

/**
* Fabric.js patch
*/
fabric.Canvas.prototype.getPointer =  function (e, ignoreZoom) {
  if (this._absolutePointer && !ignoreZoom) {
    return this._absolutePointer;
  }
  if (this._pointer && ignoreZoom) {
    return this._pointer;
  }
var simEvt;
        if (e.touches != undefined) {
            simEvt = new MouseEvent({
                touchstart: "mousedown",
                touchmove: "mousemove",
                touchend: "mouseup"
            }[e.type], {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 1,
                screenX: Math.round(e.changedTouches[0].screenX),
                screenY: Math.round(e.changedTouches[0].screenY),
                clientX: Math.round(e.changedTouches[0].clientX),
                clientY: Math.round(e.changedTouches[0].clientY),
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: 0,
                relatedTarget: null
            });
            var pointer = fabric.util.getPointer(simEvt),
                upperCanvasEl = this.upperCanvasEl,
                bounds = upperCanvasEl.getBoundingClientRect(),
                boundsWidth = bounds.width || 0,
                boundsHeight = bounds.height || 0,
                cssScale;
        } else {
            var pointer = fabric.util.getPointer(e),
                upperCanvasEl = this.upperCanvasEl,
                bounds = upperCanvasEl.getBoundingClientRect(),
                boundsWidth = bounds.width || 0,
                boundsHeight = bounds.height || 0,
                cssScale;
        }
  if (!boundsWidth || !boundsHeight ) {
    if ('top' in bounds && 'bottom' in bounds) {
      boundsHeight = Math.abs( bounds.top - bounds.bottom );
    }
    if ('right' in bounds && 'left' in bounds) {
      boundsWidth = Math.abs( bounds.right - bounds.left );
    }
  }
  this.calcOffset();
  pointer.x = pointer.x - this._offset.left;
  pointer.y = pointer.y - this._offset.top;
  /* BEGIN PATCH CODE */
 if (e.target !== this.upperCanvasEl) {
            var positionOnScene;
            if (isMobile == true) {
                positionOnScene = getPositionOnSceneTouch(container, e);
                if (positionOnScene) {
                    console.log(positionOnScene);
                    pointer.x = positionOnScene.x;
                    pointer.y = positionOnScene.y;
                }
            } else {
                positionOnScene = getPositionOnScene(container, e);
                if (positionOnScene) {
                    console.log(positionOnScene);
                    pointer.x = positionOnScene.x;
                    pointer.y = positionOnScene.y;
                }
            }
        }
  /* END PATCH CODE */
  if (!ignoreZoom) {
    pointer = this.restorePointerVpt(pointer);
  }

  if (boundsWidth === 0 || boundsHeight === 0) {
    cssScale = { width: 1, height: 1 };
  }
  else {
    cssScale = {
      width: upperCanvasEl.width / boundsWidth,
      height: upperCanvasEl.height / boundsHeight
    };
  }

  return {
    x: pointer.x * cssScale.width,
    y: pointer.y * cssScale.height
  };
}
  
  /**
   * Listeners
   */
  
  container.addEventListener("mousedown", onMouseEvt, false);
  
if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4),
    )
) {
    isMobile = true;
    container.addEventListener("touchstart", onTouch, false);
}
  /**
   * Event handler
   */
  
function onTouch(evt) {
    evt.preventDefault();
    const positionOnScene = getPositionOnSceneTouch(container, evt);
    if (positionOnScene) {
        const canvasRect = canvas._offset;
        const simEvt = new MouseEvent(evt.type, {
            clientX: canvasRect.left + positionOnScene.x,
            clientY: canvasRect.top + positionOnScene.y,
        });
        canvas.upperCanvasEl.dispatchEvent(simEvt);
    }
}

function getPositionOnSceneTouch(sceneContainer, evt) {
    var array = getMousePosition(sceneContainer, evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
    onClickPosition.fromArray(array);
  console.log(scene);
    var intersects = getIntersects(onClickPosition, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
        var uv = intersects[0].uv;
        intersects[0].object.material.map.transformUv(uv);
        var circle = new fabric.Circle({
            radius: 3,
            left: getRealPosition("x", uv.x),
            top: getRealPosition("y", uv.y),
            fill: "white",
        });
        // canvas.add(circle);
        getUv = uv;
        return {
            x: getRealPosition("x", uv.x),
            y: getRealPosition("y", uv.y),
        };
    }
    return null;
}
  function onMouseEvt(evt) {
    evt.preventDefault();
    const positionOnScene = getPositionOnScene(container, evt)
    if (positionOnScene) {
      const canvasRect = canvas._offset;
      const simEvt = new MouseEvent(evt.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y
      });

      console.log(simEvt);

      canvas.upperCanvasEl.dispatchEvent(simEvt);
    }
  }

  /**
   * Three.js Helper functions
   */
  function getPositionOnScene(sceneContainer, evt) {
  console.log(evt);
  console.log(scene);
    var array = getMousePosition(container, evt.clientX, evt.clientY);
    onClickPosition.fromArray(array);
    var intersects = getIntersects(onClickPosition, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
      var uv = intersects[0].uv;
      intersects[0].object.material.map.transformUv(uv);
      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y)
      }
    }
    return null
  }
  
  function getRealPosition(axis, value) {
    let CORRECTION_VALUE = axis === "x" ? 4.5 : 5.5;
  
    return Math.round(value * 512) - CORRECTION_VALUE;
  }
  
  var getMousePosition = function(dom, x, y) {
    var rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  };
  
  var getIntersects = function(point, objects) {
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(objects);
  };
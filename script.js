import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


var camera;
var renderer;
var container;
var scene;
var texture;
var material;
var geometry;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(0x3c, window.innerWidth / window.innerHeight, 0x1, 0x3e8);
camera.position.set(0x0, 0x0, 0xa);
var raycaster = new THREE.Raycaster();           //RAYCS
var mouse = new THREE.Vector2();
var onClickPosition = new THREE.Vector2();
var isMobile = false;
container = document.getElementById("renderer");
renderer = new THREE.WebGLRenderer({
  'antialias': true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.updateProjectionMatrix();
container.appendChild(renderer.domElement);
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(0xa);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0x1));


//aca armamos una mesh , con una geometria y la textura del canvas 

////////////////// USAMOS CANVAS DE FBRC COMO TXT EN THREE
var canvasTexture = new THREE.CanvasTexture(cnvs);
//ARMAMOS UNA GEOMETRIA   
var geometry = new THREE.PlaneGeometry(10, 10, 20, 20);


//DEFINIMOS MESH CON GEOMETRIA Y TEXTURA DEL CANVAS DE FABRICJS
var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
  'map': canvasTexture,
  'metalness': 0.25,
  'roughness': 0.25
}));

//ADD A LA SCENE
scene.add(mesh);

//  MOTORCITO DE THREEJS
// (loop de renderizado)
function animateRandom() {}
animateRandom();
setInterval(animateRandom, 0x3e8);
var clock = new THREE.Clock();
var time = 0x0;

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  renderer.render(scene, camera);
}
render();

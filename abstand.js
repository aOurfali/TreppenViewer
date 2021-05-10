import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {STLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/STLLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
var objs = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.setScalar(7);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

var loader = new STLLoader();
loader.load('https://threejs.org/examples/models/stl/ascii/slotted_disk.stl', function(geometry) {

  var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "gray"}) );
  mesh.rotation.set(0, Math.PI, 0);
  mesh.scale.setScalar(10);
  scene.add(mesh);
  objs.push(mesh);
  var wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({color: "aqua"}));
  mesh.add(wireframe);
});

//load von OBj datei.

const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/hologram.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/hologram.obj', (root) => {
        root.traverse( function ( child ) {
          if ( child.isMesh ) {
            var wireframeGeomtry = new THREE.WireframeGeometry( child.geometry );
            var wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
            var wireframe = new THREE.LineSegments( wireframeGeomtry, wireframeMaterial );
            objs.push(child);
            child.add(wireframe);
          }
        } );
        scene.add(root);
      });
    });


var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 4, 2), new THREE.MeshBasicMaterial({
  color: 0xFFc8FF
}));
marker.position.setScalar(1000);
scene.add(marker);

var intscs = [];
var rc = new THREE.Raycaster();
var m = new THREE.Vector2();
var poi = new THREE.Vector3();
var pos = new THREE.Vector3();
var tp = [
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3()
];
var tri = new THREE.Triangle();
var bc = new THREE.Vector3();
var idx = 0;

renderer.domElement.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  m.x = (event.clientX / window.innerWidth) * 2 - 1;
  m.y = -(event.clientY / window.innerHeight) * 2 + 1;
  rc.setFromCamera(m, camera);
  intscs = rc.intersectObjects(objs);
  if (intscs.length > 0) {
    let o = intscs[0];
    poi.copy(o.point);
    o.object.worldToLocal(poi);
    setPos(o.faceIndex);
    o.object.localToWorld(pos);
    marker.position.copy(pos);
  }
}

function setPos(faceIndex) {
  tp[0].fromBufferAttribute(intscs[0].object.geometry.attributes.position, faceIndex * 3 + 0);
  tp[1].fromBufferAttribute(intscs[0].object.geometry.attributes.position, faceIndex * 3 + 1);
  tp[2].fromBufferAttribute(intscs[0].object.geometry.attributes.position, faceIndex * 3 + 2);
  tri.set(tp[0], tp[1], tp[2]);
  tri.getBarycoord(poi, bc);
  if (bc.x > bc.y && bc.x > bc.z) {
    idx = 0;
  } else if (bc.y > bc.x && bc.y > bc.z) {
    idx = 1;
  } else if (bc.z > bc.x && bc.z > bc.y) {
    idx = 2;
  }
  pos.copy(tp[idx]);
}

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

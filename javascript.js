import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
//import {Detector} from 'https://dl.dropboxusercontent.com/s/ddt89ncslm4o7ie/Detector.js'
//import {TGALoader} from 'https://dl.dropboxusercontent.com/s/n5sjyymajykna51/TGALoader.js'

function main() {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  var objs=[];
  var tempvertex = new THREE.Vector3();
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
  
const material= new THREE.MeshNormalMaterial()

const coneGeometry = new THREE.ConeGeometry(.05, .2, 8);

  
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight);
 //var camera = new THREE.OrthographicCamera(0, window.innerWidth, -window.innerHeight, 0, -100, 100);
  //var camera =  new THREE.OrthographicCamera(window.innerWidth / -1, window.innerWidth /4, window.innerHeight / 2, window.innerHeight / -3, -1000, 10000);
  camera.position.setScalar(10);
  camera.position.set(0.5, 0.5, 2);
  camera.lookAt(0,0,0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('azure');

  const color = 0xFFFFFF;
  const light = new THREE.AmbientLight(color, 1);
  scene.add(light);

  // richtige Laden von OBJ-Datei
  {
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
            scene.add(child);
          }
        } );
      });
    });
  }
  var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({
    color: 0xFF5555
   })); 
  

  //marker setzen

function raycast ( e ) {

      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
      var intersects = raycaster.intersectObjects( objs, true );
      if (intersects.length > 0){
        console.log( intersects[0].face ); 
          let n = new THREE.Vector3();
          n.copy(intersects[0].face.normal);
          n.transformDirection(intersects[0].object.matrixWorld); 
          marker.lookAt(n);
          marker.rotateX(Math.PI / 2)
          marker.position.copy(intersects[0].point);
          marker.position.addScaledVector(n, 0.1);
          scene.add(marker);
          //objs.push(cube);

         /* let raycasterp= intersects[i] ;
          let pIntersect = raycasterp.point.clone();
          raycasterp.object.worldToLocal(pIntersect);
         // raycast.object.localToWorld(raycasterp);
         // marker.position.copy(raycasterp.face.normal).mutiplyScalar(0.25).add(pIntersect);
          //objs.add(marker);
          /*
              An intersection has the following properties :
                  - object : intersected object (THREE.Mesh)
                  - distance : distance from camera to intersection (number)
                  - face : intersected face (THREE.Face3)
                  - faceIndex : intersected face index (number)
                  - point : intersection point (THREE.Vector3)
                  - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
        // raycasterp.object.localToWorld(tempvertex );
        // marker.position.copy(tempvertex);

      }
  
  }
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(window.innerWidth,window.innerHeight);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  document.addEventListener('click', raycast );

  requestAnimationFrame(render);
 // diese Funktion erlaubt mir die seite responsiv zu machen
  window.addEventListener('resize', ()=>{
    camera.aspect= window.innerWidth/window.innerHeight ;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
}

main(); 

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
  var pointits = new THREE.Vector3();

  
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;

  //camera.position.setScalar(10);
  //camera.position.set(0.5, 0.5, 2);
  

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('azure');

  const color = 0xFFFFFF;
  const light = new THREE.AmbientLight(color, 1);
  scene.add(light);

  // richtige Laden von OBJ-Datei
  const geometry = new THREE.BoxGeometry(5,5,5);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 } );
  const cube = new THREE.Mesh( geometry, material );

  var wireframeGeomtry = new THREE.WireframeGeometry( geometry );
  var wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
  var wireframe = new THREE.LineSegments( wireframeGeomtry, wireframeMaterial );         
  cube.add(wireframe);
  objs.push(cube); 
  //scene.add(child);

  scene.add( cube );

  //marker setzen
  var pointA = undefined
  var pointB = undefined
  var distance =0;
  var anzahlmarker = 0;
  var markerA = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({
    color: 0xFF5555
   })); 
   var markerB = markerA.clone();

function raycast ( e ) {

      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );    
      var intersects = raycaster.intersectObjects( objs, false );
      if((distance > 0)&& (anzahlmarker===2)){
        pointA= undefined
        pointB= undefined
        distance=0; anzahlmarker=0;
        scene.remove(markerA);
        scene.remove(markerB);
       //scene.remove(marker); 
      }
      if (intersects.length > 0){
        console.log( intersects[0].face ); 
        if(pointA === undefined){
          pointA = intersects[0].point;
          markerA.position.copy(pointA);
          console.log(" coordinaten of pointA"+ pointA); 
          scene.add(markerA);
          anzahlmarker++;
        }
        else if(pointB === undefined){
          pointB = intersects[0].point;
          markerB.position.copy(pointB);
          distance = pointA.distanceTo(pointB);
          console.log(" coordinaten of pointB"+ pointB);
          scene.add(markerB);
          anzahlmarker++;
          console.log("Distance between 2 point ist:" + distance);
        }
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

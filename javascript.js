import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
//import {Detector} from 'https://dl.dropboxusercontent.com/s/ddt89ncslm4o7ie/Detector.js'
//import {TGALoader} from 'https://dl.dropboxusercontent.com/s/n5sjyymajykna51/TGALoader.js'
//import Stats from './jsm/libs/stats.module.js';
function main() {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  var objs=[];
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

  
  //OBJ-Datei nach Gruppen Laden
 /*{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/untitled (1).mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/untitled (1).obj',function ( object ) {

        scene.add( object );
        objs.push[object];
      });
    });
  }*/

  /*{
      const objLoader = new OBJLoader();
      objLoader.load('/image/output.obj', (root) => {
        
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
  }*/
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/untitled (1).mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/untitled (1).obj', (root) => {
        
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
  }
  // richtige Laden von OBJ-Datei
  /*{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/untitled (1).mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/untitled (1).obj', (root) => {
        
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
  }*/

  /*var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(2,5, 50, 50), new THREE.MeshBasicMaterial({
    color: 0x000000
   })); 
   scene.add(marker);*/
    var intersects;

    function onMouseClickFace(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );    
    var intersects = raycaster.intersectObjects(objs, false );
    if(intersects.length>0){
      console.log("function onMouseMove");
      let o = intersects[0];
      //indexits = o.object.clone();
      o.object.visible = false;
    }
  }
  //marker setzen
  var pointA = undefined
  var pointB = undefined
  var distance =0;
  var anzahlmarker = 0;
  var markerA = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 16, 16), new THREE.MeshBasicMaterial({
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
  var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(2,5, 50, 50), new THREE.MeshBasicMaterial({
    color: 0x000000
   })); 
  // scene.add(marker);
   var intersects = [];

  function onMouseMove(e){
    
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );    
    intersects = raycaster.intersectObjects( objs, false );
    if(intersects.length>0){
      console.log("function onMouseMove");
      let o = intersects[0];
      poi.copy(o.point);
      o.object.worldToLocal(poi);
      setPos(o.faceIndex);
      o.object.localToWorld(pos);
      marker.position.copy(pos);
      //scene.add(marker);
    }
  }
  function setPos(faceIndex) {
    tp[0].fromBufferAttribute(intersects[0].object.geometry.attributes.position, faceIndex * 3 + 0);
    tp[1].fromBufferAttribute(intersects[0].object.geometry.attributes.position, faceIndex * 3 + 1);
    tp[2].fromBufferAttribute(intersects[0].object.geometry.attributes.position, faceIndex * 3 + 2);
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

  //document.addEventListener('click', raycast );
  //document.addEventListener('mousemove',onMouseMove);
  document.addEventListener('click',onMouseClickFace);
  requestAnimationFrame(render);
 // diese Funktion erlaubt mir die seite responsiv zu machen
  window.addEventListener('resize', ()=>{
    camera.aspect= window.innerWidth/window.innerHeight ;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
}

main(); 

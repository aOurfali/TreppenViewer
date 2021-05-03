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
  var intscs = [];
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
  
  //const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight);
 //var camera = new THREE.OrthographicCamera(0, window.innerWidth, -window.innerHeight, 0, -100, 100);
  var camera =  new THREE.OrthographicCamera(window.innerWidth / -1, window.innerWidth /4, window.innerHeight / 2, window.innerHeight / -3, -1000, 10000);
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
  /*{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/hologram.mtl', (mtl) => {
      mtl.preload();
     // mtl.materials.default.map.magFilter = THREE.NearestFilter;
     // mtl.materials.default.map.minFilter = THREE.LinearFilter;

      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/hologram.obj', (root) => {
        root.traverse( function ( child ) {

          if ( child.isMesh ) {
        
            var wireframeGeomtry = new THREE.WireframeGeometry( child.geometry );
            var wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
            var wireframe = new THREE.LineSegments( wireframeGeomtry, wireframeMaterial );
            child.add(wireframe);
        
          }
          
        } );
        scene.add(root);
      });
    });
  }*/
  

  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/hologram.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/hologram.obj', function(root) {
        /*var material = new THREE.MeshBasicMaterial({
          color: "gray"
        });
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //var mesh = new THREE.Mesh(geometry, material);
    /*mesh.rotation.set(0, Math.PI, 0);
    mesh.scale.setScalar(10);*/
    //root.rotation.set(0, Math.PI, 0);
    root.scale.setScalar(1);
    scene.add(root);
    //objs.push(mesh);
    root.traverse( function ( child ) {

      if ( child.isMesh ) {
    
        var wireframeGeomtry = new THREE.WireframeGeometry( child.geometry );
        var wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
        var wireframe = new THREE.LineSegments( wireframeGeomtry, wireframeMaterial );
        child.add(wireframe);
    
      }
      
    } );
    });

   });
   //marker setzen
   var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 4, 2), new THREE.MeshBasicMaterial({
    color: 0xFFc8FF
   }));
 // marker.position.setScalar(1000);
  scene.add(marker);
  }

  function getMousePosition(clientX, clientY) {
    var mouse2D = new THREE.Vector3();
    var mouse3D = new THREE.Vector3();
    mouse2D.x = (clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(clientY / window.innerHeight) * 2 + 1;
    mouse2D.z = 0.5;
    mouse3D = camera.unprojectVector(mouse2D.clone(), camera);
    return mouse3D;
   
}
  function onDocumentMouseUp(event) {
    event.preventDefault();

    var mouse3D = getMousePosition(event.clientX, event.clientY);
    console.log(mouse3D.x + ' ' + mouse3D.y + ' ' + mouse3D.z);
}
  
  function onMouseMove(event){

    event.preventDefault();
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    console.log("die werte von Mouse.x ist :" + mouse.x)
    raycaster.setFromCamera( mouse, camera );
    
    var intersects = 0;//raycaster.intersectObjects( objects);
    if (intersects.length > 0)
        return intersects[0].point;
  }
  function onMouseMove1( event ) {

    // Get screen-space x/y
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    // Perform raycast
    raycaster.setFromCamera( mouse, camera );

    // See if the ray from the camera into the world hits our mesh
    const intersects = raycaster.intersectObjects( scene.children , true);

    // Check if an intersection took place
    if ( intersects.length > 0 ) {
        const posX = intersects[0].point.x;
        const posZ = intersects[0].point.z;
        console.log(posX, posZ);
    }

}
function raycast ( e ) {

      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
      var intersects = raycaster.intersectObjects( scene.children, true );
      
      //rollOverMesh.material.color = new THREE.Color(0xffffff * Math.random());
      //rollOverMesh.material.needsUpdate = true;

      for ( var i = 0; i < intersects.length; i++ ) {
          console.log( intersects[ i ] ); 
          /*
              An intersection has the following properties :
                  - object : intersected object (THREE.Mesh)
                  - distance : distance from camera to intersection (number)
                  - face : intersected face (THREE.Face3)
                  - faceIndex : intersected face index (number)
                  - point : intersection point (THREE.Vector3)
                  - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
      }
   /*   mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
  
      var intersects = raycaster.intersectObjects( scene.children );
  
      for ( var i = 0; i < intersects.length; i++ ) {
          console.log( intersects[ i ] ); 
          /*
              An intersection has the following properties :
                  - object : intersected object (THREE.Mesh)
                  - distance : distance from camera to intersection (number)
                  - face : intersected face (THREE.Face3)
                  - faceIndex : intersected face index (number)
                  - point : intersection point (THREE.Vector3)
                  - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          
      }*/
  
  }
  function onMouseMoveMarker(event) {
    //event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    //console.log("ist die Funktion onMouseMove richtig");
    //console.log("mouse.x ist :"+ mouse.x);
    intscs = raycaster.intersectObjects(scene.children,true );
    if (intscs.length > 0) {
      console.log("ist die funktion onmouse:");
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

  document.addEventListener('click',onMouseMove );
 
  // renderer.domElement.addEventListener("mousemove", onMouseMove,false);

  requestAnimationFrame(render);

  window.addEventListener('resize', ()=>{
    camera.aspect= window.innerWidth/window.innerHeight ;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
}

main(); 

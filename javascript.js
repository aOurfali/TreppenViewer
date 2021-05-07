import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

function main() {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  var objs=[];
  var intscs = [];
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

  const coneGeometry = new THREE.ConeGeometry(5, 10,100);

  
  const camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight);
  camera.position.setScalar(10);
  camera.position.set(5, 5, 20);
  camera.lookAt(0,5,0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(5, 10, 5);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('azure');

  const color = 0xFFFFFF;
  const light = new THREE.AmbientLight(color, 1);
  scene.add(light);

  // Laden von OBJ-Datei
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

  function raycast ( e ) {

      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      var marker2 = new THREE.Mesh(new THREE.SphereBufferGeometry(2,5, 50, 50), new THREE.MeshBasicMaterial({color: 0x000000})); 
      raycaster.setFromCamera( mouse, camera );    
      var intersects = raycaster.intersectObjects( objs, true );
      if (intersects.length > 0){
        console.log( intersects[0].face ); 
          let n = new THREE.Vector3();
          n.copy(intersects[0].face.normal);
          n.transformDirection(intersects[0].object.matrixWorld);
          marker2.rotateX(Math.PI / 2)
          marker2.position.copy(intersects[0].point);
          marker2.position.addScaledVector(n, 0.1);
          scene.add(marker2);
        }
  
  }
  var marker = new THREE.Mesh(new THREE.SphereBufferGeometry(2,5, 50, 50), new THREE.MeshBasicMaterial({color: 0xFF5555}));
  scene.add(marker);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intscs = raycaster.intersectObjects(objs);
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

  window.addEventListener('resize', ()=>{
    camera.aspect= window.innerWidth/window.innerHeight/2 ;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
}

main(); 

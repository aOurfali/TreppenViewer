import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

function main() {
  const canvas = document.getElementById('webgl');
  //const renderer = new THREE.CanvasRenderer(({canvas,antialias: true}));
  const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  var objs=[];
  /*const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100000000000000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
*/
  //const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight);
 //var camera = new THREE.OrthographicCamera(0, window.innerWidth, -window.innerHeight, 0, -100, 100);
  var camera =  new THREE.OrthographicCamera(window.innerWidth / -1, window.innerWidth /4, window.innerHeight / 2, window.innerHeight / -3, -1000, 10000);
  camera.position.set(0, 1, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('azure');

  const color = 0xFFFFFF;
  const light = new THREE.AmbientLight(color, 1);
  scene.add(light);

  /*{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
   // light.position.set(5, 10, 2);
   light.position.set(0,1,2);
    scene.add(light);
    scene.add(light.target);
  }*/

  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/hologram.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/hologram.obj', (root) => {
        scene.add(root);
      });
    });
  }

  /*function objects() 
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/image/hologram.mtl', function(mtl) {
      var material = new THREE.MeshBasicMaterial();
      var mesh = new THREE.Mesh(mtl, material);
      mesh.rotation.set(0, Math.PI, 0);
      mesh.scale.setScalar(10);
      scene.add(mesh);
      objs.push(mesh);
      //var wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(mtl), new THREE.LineBasicMaterial({color: "aqua"}));
     // mesh.add(new THREE.LineSegments(new THREE.WireframeGeometry(mtl), new THREE.LineBasicMaterial({color: "aqua"})));
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('/image/hologram.obj', (root) => {
        scene.add(root);
      });
    });

  }*/


  
  function onMouseMove(event){
    event.preventDefault();
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );
    
    var intersects = 0;//raycaster.intersectObjects( objects);
    if (intersects.length > 0)
        return intersects[0].point;
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

  addEventListener('mousemove',onMouseMove);
  requestAnimationFrame(render);
}

main();

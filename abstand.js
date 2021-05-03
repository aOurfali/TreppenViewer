import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import {Detector} from 'https://dl.dropboxusercontent.com/s/ddt89ncslm4o7ie/Detector.js'
import {TGALoader} from 'https://dl.dropboxusercontent.com/s/n5sjyymajykna51/TGALoader.js'
import {STLLoader} from 'https://dl.dropboxusercontent.com/s/h18h48v52739df4/STLLoader.js'

var container;
var camera, controls, scene, renderer, model;

init();
animate();

function init() {
    //container = document.createElement('div');
    //document.body.appendChild(container);
    const canvas = document.getElementById('webgl');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    controls = new THREE.OrbitControls(camera);

    // scene
    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x404040); //0x101030
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Loading manager
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
        console.log('Error: ' + xhr);
    };

    // Model
    //model = new THREE.Object3D();
    //scene.add(model);
    
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        needsUpdate: true
    });

	window.model ='';

	
	
	// Added an if else here, STL code:
	
	/*var loader = new THREE.STLLoader();
				loader.load( 'https://dl.dropboxusercontent.com/s/t57h7xketafodui/5a9b75e521aaf-DI_PIPE_FBG_holder.stl', function ( geometry ) {

					var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.set( 0, - 0.25, 0.6 );
					mesh.rotation.set( 0, - Math.PI / 2, 0 );
					mesh.scale.set( 0.05, 0.05, 0.05 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );
					
				window.model = scene;

				} ); 
	*/
	
		
    // This OBJ Loader will load if user requests an OBJ file. 
	     var loader = new THREE.OBJLoader(manager);
    var object = loader.load('/image/windmill.obj', function (Object) {

        Object.castShadow = true;
        Object.position.x = 0;
        Object.position.y = -1;
        Object.position.z = 0;

        Object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        console.log(Object);
				window.model = Object;
        scene.add(Object);
    }, onProgress, onError); 
	    // Object

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Measurement Code

var pointA = new THREE.Vector3( 0, 1, 0 );
var pointB = new THREE.Vector3();

var markerA = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 16, 16 ), new THREE.MeshBasicMaterial( { color: 0xFF5555, depthTest: false, depthWrite: false } ) );
var markerB = markerA.clone();
scene.add( markerA );
scene.add( markerB );

var line;

function getIntersections( event ) {
  var vector = new THREE.Vector2();

  vector.set(
    ( event.clientX / window.innerWidth ) * 2 - 1,
    - ( event.clientY / window.innerHeight ) * 2 + 1 );

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera( vector, camera );	

  var intersects = raycaster.intersectObjects( window.model.children );
  
  return intersects;
  
}

function getLine( vectorA, vectorB ) {

  var geometry = new THREE.Geometry();
  geometry.vertices.push( vectorA );
  geometry.vertices.push( vectorB );
  var material = new THREE.LineBasicMaterial({
    color: 0xFFFF00,
    depthWrite: false,
    depthTest: false
  });
  line = new THREE.Line( geometry, material );
  return line;
  
}

function onDocumentMouseDown( event ) {

  var intersects = getIntersections( event );

  if( intersects.length > 0 ){

    if ( ! pointB.equals( pointA ) ) {
      pointB = intersects[ 0 ].point;
    } else {
      pointB = pointA;
    }
    pointA = intersects[ 0 ].point;
    markerA.position.copy( pointA );
    markerB.position.copy( pointB );
    
    var distance = pointA.distanceTo( pointB );
    
    if ( line instanceof THREE.Line ) {
      scene.remove( line );
    }
    if ( distance > 0 ) {
      console.log( "distance", distance );
      alert( "distance: "+distance );
			line = getLine( pointA, pointB );
      scene.add(line);
    }

  }

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
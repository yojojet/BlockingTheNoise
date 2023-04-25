// import "./styles.css";

// import * as THREE from '/lib/three/build/three.module.js';
// import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js';
// import Stats from "/lib/three/examples/jsm/libs/stats.module.js";
// import { GUI } from "/lib/three/examples/jsm/libs/dat.gui.module.js";

import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from '/node_modules/three/examples/jsm/libs/dat.gui.module.js';

/*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

let params = {
  widthOffset: 0,
  boolean: false
};

let tick = 0
let container, stats;
let camera, scene, renderer, mesh;

const amount = 5;
const count = amount * amount * amount;
const dummy = new THREE.Object3D();

init();
initMesh()
animate(0);

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

  // camera

  camera = new THREE.PerspectiveCamera(
    60,
    (window.innerWidth - params.widthOffset) / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 50);

  var loader = new THREE.TextureLoader();
  
  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth - params.widthOffset, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // controls
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.update()

  // performance monitor

  stats = new Stats();
  container.appendChild(stats.dom);

  // stats.domElement.classList.add('stats-dom')
  // // stats.domElement.style.opacity = 0.01
  // stats.domElement.style.top = 'unset'
  // stats.domElement.style.bottom = '.9em'
  // stats.domElement.style.left = 'unset'
  // stats.domElement.style.right = '.9em'
  // // stats.domElement.style.position = 'fixed'
  // stats.domElement.style.zIndex = 99999
  //

  window.addEventListener("resize", onWindowResize, false);

  //

  var gui = new GUI();
  gui.add(params, "boolean")
  
  onWindowResize()
}

function initMesh() {

  // const geometry = new THREE.CylinderGeometry( 0.2, 0.2, 0.8, 12);
  const geometry = new THREE.SphereGeometry( 0.2, 8, 8);
  geometry.computeVertexNormals();
  geometry.rotateX(Math.PI/2)

  const material = new THREE.MeshNormalMaterial({
    flatShading: true
  });
  mesh = new THREE.InstancedMesh( geometry, material, count );
  mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
  scene.add( mesh );

}

//

function onWindowResize() {

  // params.widthOffset = document.querySelector('.dg.main.a').clientWidth || 300

  camera.aspect = (window.innerWidth - params.widthOffset) / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize((window.innerWidth - params.widthOffset), window.innerHeight);
}

// 

function updateMeshPerFrame() {

  if ( mesh ) {

    const time = Date.now() * 0.001;

    // mesh.rotation.x = Math.sin( time / 4 );
    // mesh.rotation.y = Math.sin( time / 2 );

    let i = 0;
    const offset = ( amount - 1 ) / 2;

    for ( let x = 0; x < amount; x ++ ) {
      for ( let y = 0; y < amount; y ++ ) {
        for ( let z = 0; z < amount; z ++ ) {

          dummy.position.set( offset - x, offset - y, offset - z );
          // dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
          // dummy.rotation.z = dummy.rotation.y * 2;
          dummy.updateMatrix();
          mesh.setMatrixAt( i ++, dummy.matrix );

        }
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    // mesh.computeBoundingSphere();

  }

}

//

function animate(now) {
  tick++
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  updateMeshPerFrame()
  renderer.render(scene, camera);
}
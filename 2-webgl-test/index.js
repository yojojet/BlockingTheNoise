// import "./styles.css";

// import * as THREE from '/lib/three/build/three.module.js';
// import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js';
// import Stats from "/lib/three/examples/jsm/libs/stats.module.js";
// import { GUI } from "/lib/three/examples/jsm/libs/dat.gui.module.js";

import * as THREE from '/three/build/three.module.js';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import Stats from '/three/examples/jsm/libs/stats.module.js';
import { GUI } from '/three/examples/jsm/libs/dat.gui.module.js';

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
  boolean: false,
  plotSpiral: () => {},
  plotRing: () => {},
  plotWave: () => {},
  plotSines: () => {},
  plotRectangle: () => {},
};

let tick = 0
let container, stats;
let camera, scene, renderer, mesh;

const amount = 2;
const count = 50;
const dummy = new THREE.Object3D();

init();
initMesh()
initGui()
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
    30,
    (window.innerWidth - params.widthOffset) / window.innerHeight,
    1,
    10000
  );
  camera.position.set(2, 2, 10);

  var loader = new THREE.TextureLoader();
  
  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(1);
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


  // helper

  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  // update mesh
  // for ( let x = 0; x < amount; x ++ ) {
  //   for ( let y = 0; y < amount; y ++ ) {
  //     for ( let z = 0; z < amount; z ++ ) {

  //       dummy.position.set( offset - x, offset - y, offset - z );
  //       // dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
  //       // dummy.rotation.z = dummy.rotation.y * 2;
  //       dummy.updateMatrix();
  //       mesh.setMatrixAt( i ++, dummy.matrix );

  //     }
  //   }
  // }
  
  
  
  
  // let fibLastMinus1 = 0
  // let fibLast = 1
  // let fibNext = 0

  // for ( let x = 0; x < 15; x ++ ) {
  //     fibNext = fibLastMinus1 + fibLast // sum of last 2 in seq
  //     let newXPosition = fibNext;
  //     console.log(x, 'fibNext', fibNext)
  //     fibLastMinus1 = fibLast // update 2nd last in seq
  //     fibLast = fibNext // update 1st last in seq
  //     dummy.position.set( newXPosition, 0, 0 );
  //     dummy.updateMatrix();
  //     mesh.setMatrixAt(i++, dummy.matrix );
  // }

}

function makeRing() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;
  let totalNumOfPoints = 48
  let angle = 360/totalNumOfPoints

  for ( let x = 0; x < totalNumOfPoints; x ++ ) {
    let radius = 10
      let angleOfCurrentPoint = angle * x
      let newXPosition = Math.sin(angleOfCurrentPoint * Math.PI/180) * radius;
      let newYPosition = Math.cos(angleOfCurrentPoint * Math.PI/180) * radius;
      
      dummy.position.set( newXPosition, newYPosition, 0 );
      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );
  }
  
  mesh.instanceMatrix.needsUpdate = true;
}


function makeSpiral() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;
  let totalNumOfPoints = 48
  let angle = 360/totalNumOfPoints

  for ( let x = 0; x < totalNumOfPoints; x ++ ) {
    let radius = 10 - x
      let angleOfCurrentPoint = angle * x
      let newXPosition = Math.sin(angleOfCurrentPoint * Math.PI/180) * radius;
      let newYPosition = Math.cos(angleOfCurrentPoint * Math.PI/180) * radius;
      
      dummy.position.set( newXPosition, newYPosition, 0 );
      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );
  }
  
  mesh.instanceMatrix.needsUpdate = true;
}

function makeWave() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;

  let y = 0;

  for ( let x = 0; x < 48; x ++ ) {
     

    if (x % 2 ==0) {
      y=0
      
    } else{
      y=1;
      
    }
    
      
      dummy.position.set( x, y, 0 );
      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );
  }
  
  mesh.instanceMatrix.needsUpdate = true;
}
function makeSines() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;

  
  for ( let x = 0; x < 48; x ++ ) {
     
    let y = Math.sin(x);
    
    
      
      dummy.position.set( x, y, 0 );
      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );
  }
  
  mesh.instanceMatrix.needsUpdate = true;
}
function makeRectangle() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;

  
  for ( let x = 0; x < 6; x ++ ) {
     for ( let y = 0; y < 4; y ++){
      for ( let z = 0; z < 2; z++){
    
      dummy.position.set( x, y, z );
      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );
      }
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}



function initGui() {
  var gui = new GUI();
  
  params.plotSpiral = makeSpiral
  params.plotRing = makeRing
  params.plotWave = makeWave
  params.plotSines = makeSines
  params.plotRectangle = makeRectangle

  gui.add(params, "plotSpiral")
  gui.add(params, "plotRing")
  gui.add(params, "plotWave")
  gui.add(params, "plotSines")
  gui.add(params, "plotRectangle")
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

  // if ( mesh ) {

  //   const time = Date.now() * 0.001;

  //   // mesh.rotation.x = Math.sin( time / 4 );
  //   // mesh.rotation.y = Math.sin( time / 2 );

  //   let i = 0;
  //   const offset = ( amount - 1 ) / 2;

  //   // for ( let x = 0; x < amount; x ++ ) {
  //   //   for ( let y = 0; y < amount; y ++ ) {
  //   //     for ( let z = 0; z < amount; z ++ ) {

  //   //       dummy.position.set( offset - x, offset - y, offset - z );
  //   //       // dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
  //   //       // dummy.rotation.z = dummy.rotation.y * 2;
  //   //       dummy.updateMatrix();
  //   //       mesh.setMatrixAt( i ++, dummy.matrix );

  //   //     }
  //   //   }
  //   // }

  //   for ( let x = 0; x < 10; x ++ ) {

  //       dummy.position.set( x, 0, 0 );
  //       console.log('x is...', x)
  //       dummy.updateMatrix();
  //       mesh.setMatrixAt( i ++, dummy.matrix );

  //   }

  //   mesh.instanceMatrix.needsUpdate = true;
  //   // mesh.computeBoundingSphere();

  // }


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
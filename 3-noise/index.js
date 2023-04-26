// import "./styles.css";

// import * as THREE from '/lib/three/build/three.module.js';
// import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js';
// import Stats from "/lib/three/examples/jsm/libs/stats.module.js";
// import { GUI } from "/lib/three/examples/jsm/libs/dat.gui.module.js";

import * as  THREE  from '/three/build/three.module.js';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import Stats from '/three/examples/jsm/libs/stats.module.js';
import { GUI } from '/three/examples/jsm/libs/dat.gui.module.js';
//import { randFloatSpread } from '/three/src/math/MathUtils';

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
  plotRotation: () => {},
  plotSize: () => {},
  plotMushroom: () => {},
  plotUfo: () => {},
  plotNoisy: () => {},
};

let tick = 0
let container, stats;
let camera, scene, renderer, mesh, controls;

const amount = 50;
const count = amount*amount;
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
  camera.position.set(5, 5, amount * 2);

  var loader = new THREE.TextureLoader();
  
  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth - params.widthOffset, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = true
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

  const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 1, 12);
  // const geometry = new THREE.SphereGeometry( 0.2, 8, 8);
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
}

function makeRectangle() {

  let i = 0;
  const offset = ( amount - 1 ) / 2;
  
  const xCount = amount;
  const yCount = amount;
  
  for ( let x = 0; x < xCount; x ++ ) {
     for ( let y = 0; y < yCount; y ++){

      const newX = x - offset;
      const newY = y - offset;

      const newRotX = i;
      const newScale = Math.sin(i);

      dummy.position.set( x - offset, y - offset, 0 );
      
      dummy.rotation.set(newRotX, 0, 0);

      dummy.scale.set(newScale, newScale, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );

    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}

function makeRotation(){
  let i = 0;
  const offset = (amount-1)/2;
  
  const xCount = amount;
  const yCount = amount;
  
  for ( let y = 0; y < yCount; y ++){
    for ( let x = 0; x < xCount; x ++ ) {

      changeItemByIndexXY(i, x, y)
    
    i++;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}


function changeItemByIndexXY(i, x, y) {
  const offset = ( amount - 1 ) / 2;  
  const amountForCurrentItem = (i / (amount * amount)) // i / total
  const endGoal = (Math.PI * 2)
  const newRotX = amountForCurrentItem * endGoal
  dummy.position.set( x - offset, y - offset, 0 );
  dummy.rotation.set(newRotX, newRotX, 0);
  //dummy.scale.set(newScale, newScale, 1);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix );
}

function makeSize() {
  let i = 0;
  
  const xCount = amount;
  const yCount = amount;
  for ( let y = 0; y < yCount; y ++){
    for ( let x = 0; x < xCount; x ++ ) {

        updateItemByIndexAndXY(i, x, y)
      
        
      i++;

    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}


function updateItemByIndexAndXY(i, x, y) {
  const offset = ( amount - 1 ) / 2;  
  const amountForCurrentItem = (i / (amount * amount)) // i / total
  const endGoal = 10
  const newScale = amountForCurrentItem * endGoal
  dummy.position.set( x - offset, y - offset, 0 );
  dummy.rotation.set(0, 0, 0);
  dummy.scale.set(newScale, newScale, 1);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix );  
}

function makeMushroom(){
  let i = 0;
  const offset = ( amount - 1 ) / 2;
  
  const xCount = amount;
  const yCount = amount;
  
  for ( let x = 0; x < xCount; x ++ ) {
     for ( let y = 0; y < yCount; y ++){

      const newX = x - offset;
      const newY = y - offset;

      const newRotX = i;
      const newScale = Math.tan(i);

      dummy.position.set( x - offset, y - offset, 0 );
      
      dummy.rotation.set(newRotX, 0, 0);

      dummy.scale.set(newScale, newScale, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );

    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}

function makeUfo(){
  let i = 0;
  const offset = ( amount - 1 ) / 2;
  
  const xCount = amount;
  const yCount = amount;
  
  for ( let x = 0; x < xCount; x ++ ) {
     for ( let y = 0; y < yCount; y ++){

      const newX = x - offset;
      const newY = y - offset;

      const newRotX = i++;
      const newScale = Math.tan(i);

      dummy.position.set( x - offset, y - offset, 0 );
      
      dummy.rotation.set(newRotX, 0, 0);

      dummy.scale.set(newScale, newScale, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );

    }
  }
  mesh.instanceMatrix.needsUpdate = true;
}

// function sayHelloDirectly (name) {
//   console.log('Hello! ' + name)
// }

// function getHello (name) {
//   const greeting = 'Hello, '
//   return greeting + name
// }

function makeNoisy(time) {

  // let n1 = PerlinNoise.noise( 1, 1, .8 );
  // let n2 = PerlinNoise.noise( 2, 1, .8 );
  // let n3 = PerlinNoise.noise( 3, 1, .8 );
  // console.log(n1)
  // console.log(n2)
  // console.log(n3)

  let i = 0;
  const offset = ( amount - 1 ) / 2;
  
 
  const xCount = amount;
  const yCount = amount;
  const seed = time + 0.4
  
  for ( let x = 0; x < xCount; x ++ ) {
     for ( let y = 0; y < yCount; y ++){

      // const newX = x - offset;
      // const newY = y - offset;

      // const newRotX = i;
  
      const n = PerlinNoise.noise(x+seed, y+seed, 0.8 );
      // const n = PerlinNoise.noise(x, y, seed);
      const newScale = n * n *10;
     

      // console.log(newScale)
      dummy.position.set( x - offset, y - offset, 0 );
      //dummy.rotation.set(newRotX, 0, 0);
      dummy.scale.set(newScale, newScale, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i++, dummy.matrix );

    }
  }
  mesh.instanceMatrix.needsUpdate = true;

  // sayHelloDirectly('Jason')
  // sayHelloDirectly('Nick')
  // sayHelloDirectly('Claire')
  
  // let greetingToNick = getHello('Nick')
  // let greetingToJason = getHello('Jason')

  // console.log(greetingToNick)
  // console.log(greetingToJason)
  // console.log(greetingToJason)
  // console.log(greetingToJason)
}



function initGui() {
  var gui = new GUI();
  params.plotRotation = makeRotation
  params.plotRectangle = makeRectangle
  params.plotSize = makeSize
  params.plotMushrooms = makeMushroom
  params.plotUfo = makeUfo
  params.plotNoisy = makeNoisy
  gui.add({ controls: false}, 'controls').onChange((v)=>{
    controls.enabled = v
  })
  gui.add(params, "plotRectangle")
  gui.add(params, "plotRotation")
  gui.add(params, "plotSize")
  gui.add(params, "plotMushrooms")
  gui.add(params, "plotUfo")
  gui.add(params, "plotNoisy")    

  makeNoisy(0)
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

  //   mesh.rotation.x = Math.sin( time / 4 );
  //   mesh.rotation.y = Math.sin( time / 2 );

  //   let i = 0;
  //   const offset = ( amount - 1 ) / 2;

  //   for ( let x = 0; x < amount; x ++ ) {
  //     for ( let y = 0; y < amount; y ++ ) {
  //       for ( let z = 0; z < amount; z ++ ) {

  //         dummy.position.set( offset - x, offset - y, offset - z );
  //         dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
  //         dummy.rotation.z = dummy.rotation.y * 2;
  //         dummy.updateMatrix();
  //         mesh.setMatrixAt( i ++, dummy.matrix );

  //       }
  //     }
  //   }

  //   for ( let x = 0; x < 10; x ++ ) {

  //       dummy.position.set( x, 0, 0 );
  //       console.log('x is...', x)
  //       dummy.updateMatrix();
  //       mesh.setMatrixAt( i ++, dummy.matrix );

  //   }

  //   mesh.instanceMatrix.needsUpdate = true;
  //   mesh.computeBoundingSphere();

  // }
}



//

function animate(now) {
  tick++
  requestAnimationFrame(animate);
  // console.log(tick)
  makeNoisy(tick*0.008)
  render();
  stats.update();
}

function render() {
  updateMeshPerFrame()
  renderer.render(scene, camera);
}
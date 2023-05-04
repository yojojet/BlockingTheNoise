// import "./styles.css";

// import * as THREE from '/lib/three/build/three.module.js';
// import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js';
// import Stats from "/lib/three/examples/jsm/libs/stats.module.js";
// import { GUI } from "/lib/three/examples/jsm/libs/dat.gui.module.js";

import * as THREE from '/three/build/three.module.js';
import {
  OrbitControls
} from '/three/examples/jsm/controls/OrbitControls.js';
import Stats from '/three/examples/jsm/libs/stats.module.js';
import {
  GUI
} from '/three/examples/jsm/libs/dat.gui.module.js';
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
  speed: 1,
  complexity: 50,
  number : 10,
  widthOffset: 0,
  boolean: false,
  plotIsland: () => {
    mode = "island"
  },
  plotVulcano: () => {mode = "vulcano"}
  ,
};

// let speed = 0.005
// let number = 1
// let complexity = 30
let tick = 0;
let container, stats;
let camera, scene, renderer, mesh, controls;
let plane = null;
let mode = "island"
const defaultColor = new THREE.Color("hsl(50, 100%, 50%)");

const amount = 100;
const count = amount * amount;
const dummy = new THREE.Object3D();
const gridSize = 200

init();
initMesh();
initGui();
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

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
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

  // const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 1, 12);
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  geometry.computeVertexNormals();
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true
  });
  mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  scene.add(mesh);


  // plane = 'hello';
  //   console.log('plane', plane)

  //
  const geometrie = new THREE.PlaneGeometry(100, 100, gridSize, gridSize);
  // const materiaal = new THREE.MeshNormalMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
  const materiaal = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    // color: 0xffff00,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false
  });
  plane = new THREE.Mesh(geometrie, materiaal);
  scene.add(plane);
  plane.rotation.set(-0.5 * Math.PI, 0, 0);

  console.log(plane.geometry.vertices)
  // helper
  // let vertice = zero
  // vertice.position.set

  let ary = plane.geometry.vertices;

  const numCount = ary.length

  let num = 0;
  for (let num = 0; num < numCount; num++) {
    ary[num].z = 0
  }
  // console.log(ary[num]);
  plane.geometry.verticesNeedUpdate = true

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

function makeIsland(time) {
  let i = 0;
  let zero = 0
  let n = zero

  // const offset = ( size - 1 ) / 2;


  // const xCount = amount;
  // const yCount = amount;
  const seed = time + 0.4

  // for ( let x = 0; x < xCount; x ++ ) {
  //  for ( let y = 0; y < yCount; y ++){

  let noise = new perlinNoise3d();
  noise.noiseSeed(0);

  // coxnsole.log(noise)

  let output = [];
  let ary = plane.geometry.vertices;

  const numCount = ary.length
  const numOfX = Math.sqrt(numCount)
  const numOfY = numOfX

  let num = 0;
  n = noise.get(1 + time, 0 + time, 0)
  //  console.log(n)


  // let geometry = noise.scene.get("myFile.stl").geometry   

  // const color = new THREE.Color(0xFF0000);
  // const colorAttribute = geometry.getAttribute("color");
  // console.log('colorAttribute', colorAttribute)


  let index = 0
  let scale = 0.02 * params.number *0.1




  for (let numY = 0; numY < numOfY; numY++) {
    for (let numX = 0; numX < numOfX; numX++) {

      // n = noise.get(1+seed,0,0)
      n = noise.get(numX * scale + (seed * 0.1), numY * scale, 0)
      // console.log(n)
      ary[index].z = n * params.complexity *0.6 - 16
      index++


      // mesh.setColorAt(index, defaultColor.set(`hsl(0, 50%, ${(index+100)%100}%)`));
      // mesh.instanceColor.needsUpdate = true;

      // numY.setXYZ( idx, color.r, color.g, color.b )
      // numX.setXYZ( idx, color.r, color.g, color.b )

    }
  }
  // numY.needsUpdate = true;
  // numX.needsUpdate = true;
  plane.geometry.verticesNeedUpdate = true


  // Play with colours

  let geometry = plane.geometry
  geometry.faces.forEach(function (face) {
    const factor = geometry.vertices[face.a].z;
    
    // RGB
    const redVal = factor / 30
    const greenVal = 0.5
    const blueVal = 0
    // face.color.setRGB(redVal, greenVal, blueVal);

    // HSL 0-1
    if (factor > 4) {
      const hue = 0.27
      const saturation = 0.95
      const lightness = factor / 30 + 0.15
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

      // const hue = 0.072
      // const saturation = 0.80
      // const lightness = factor / 30 + 0.3
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }

    else if (factor > 0){
      const hue = 0.104
      const saturation = 0.90
      const lightness = factor / 30 + 0.5 
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color
     
      // const hue = 0.05
      // const saturation = 0.97
      // const lightness = factor / 30 + 0.1
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }

    else {
      const hue = 0.53
      const saturation = 0.74
      const lightness = factor / 30 + 0.5 
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

      // const hue = 0.083
      // const saturation = 1
      // const lightness = factor / 30 + 0.20
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }


    
  });
  geometry.colorsNeedUpdate = true;





  // for (let x = 0; x < size; x++) {
  //     for (let y = 0; y < size; y++) {
  //       for (let z = 0; z < size; z++){
  //       const seed = time + 0.4
  //       let n = noise.get(x/size+seed, y/size+seed, z/size+seed)
  //       // console.log(n)
  //       output.push({ x:x, y:y, z:z, value: n});
  //       const newScale = n * n *10;



  //       // dummy.position.set( x - offset, y - offset, z - offset );

  //       // dummy.rotation.set(newRotX, 0, 0);

  //       plane.scale.set(newScale, newScale, newScale);

  //       plane.updateMatrix();
  //       // mesh.setMatrixAt(i++, plane.matrix );
  //        }
  //     }
  //   }
  // mesh.instanceMatrix.needsUpdate = true;
}

function makeVulcano(time) {
  let i = 0;
  let zero = 0
  let n = zero

  // const offset = ( size - 1 ) / 2;


  // const xCount = amount;
  // const yCount = amount;
  const seed = time + 0.4

  // for ( let x = 0; x < xCount; x ++ ) {
  //  for ( let y = 0; y < yCount; y ++){

  let noise = new perlinNoise3d();
  noise.noiseSeed(0);

  // coxnsole.log(noise)

  let output = [];
  let ary = plane.geometry.vertices;

  const numCount = ary.length
  const numOfX = Math.sqrt(numCount)
  const numOfY = numOfX

  let num = 0;
  n = noise.get(1 + time, 0 + time, 0)
  //  console.log(n)


  // let geometry = noise.scene.get("myFile.stl").geometry   

  // const color = new THREE.Color(0xFF0000);
  // const colorAttribute = geometry.getAttribute("color");
  // console.log('colorAttribute', colorAttribute)


  let index = 0
  let scale = 0.05 * params.number *0.1




  for (let numY = 0; numY < numOfY; numY++) {
    for (let numX = 0; numX < numOfX; numX++) {

      // n = noise.get(1+seed,0,0)
      n = noise.get(numX * scale + (seed * 0.1), numY * scale, 0)
      // console.log(n)
      ary[index].z = n * params.complexity *0.6 - 16
      index++


      // mesh.setColorAt(index, defaultColor.set(`hsl(0, 50%, ${(index+100)%100}%)`));
      // mesh.instanceColor.needsUpdate = true;

      // numY.setXYZ( idx, color.r, color.g, color.b )
      // numX.setXYZ( idx, color.r, color.g, color.b )

    }
  }
  // numY.needsUpdate = true;
  // numX.needsUpdate = true;
  plane.geometry.verticesNeedUpdate = true


  // Play with colours

  let geometry = plane.geometry
  geometry.faces.forEach(function (face) {
    const factor = geometry.vertices[face.a].z;
    
    // RGB
    const redVal = factor / 30
    const greenVal = 0.5
    const blueVal = 0
    // face.color.setRGB(redVal, greenVal, blueVal);

    // HSL 0-1
    if (factor > 4) {
      // const hue = 0.27
      // const saturation = 0.95
      // const lightness = factor / 30 + 0.5 
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

      const hue = 0.072
      const saturation = 0.80
      const lightness = factor / 30 + 0.3
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }

    else if (factor > 0){
      // const hue = 0.104
      // const saturation = 0.90
      // const lightness = factor / 30 + 0.5 
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color
     
      const hue = 0.072
      const saturation = 0.97
      const lightness = factor / 30 + 0.07
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }

    else {
      // const hue = 0.53
      // const saturation = 0.74
      // const lightness = factor / 30 + 0.5 
      // face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

      const hue = 0.083
      const saturation = 1
      const lightness = factor / 30 + 0.1
      face.color.setHSL(hue, saturation, lightness); // https://threejs.org/docs/#api/en/math/Color

    }


    
  });
  geometry.colorsNeedUpdate = true;





  // for (let x = 0; x < size; x++) {
  //     for (let y = 0; y < size; y++) {
  //       for (let z = 0; z < size; z++){
  //       const seed = time + 0.4
  //       let n = noise.get(x/size+seed, y/size+seed, z/size+seed)
  //       // console.log(n)
  //       output.push({ x:x, y:y, z:z, value: n});
  //       const newScale = n * n *10;



  //       // dummy.position.set( x - offset, y - offset, z - offset );

  //       // dummy.rotation.set(newRotX, 0, 0);

  //       plane.scale.set(newScale, newScale, newScale);

  //       plane.updateMatrix();
  //       // mesh.setMatrixAt(i++, plane.matrix );
  //        }
  //     }
  //   }
  // mesh.instanceMatrix.needsUpdate = true;
}





function initGui() {
  var gui = new GUI();
  // params.plotIsland = makeIsland
  // params.plotVulcano = makeVulcano
  gui.add({
    controls: true
  }, 'controls').onChange((v) => {
    controls.enabled = v
  })
  gui.add(params, "plotIsland")
  gui.add(params, "plotVulcano")
  gui.add(params, "speed", 0, 100, 1).onChange((v) => {
  // speed = v * 0.1
  })
  gui.add(params, "complexity", 0, 100, 1).onChange ((v) =>{
// complexity = v * 0.6
  })
  gui.add(params, "number", 0, 100, 1).onChange ((v) =>{
    // number = v
  })
  makeIsland(0)
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
  //  makeNoisy(tick*0.008)
 if (mode == "vulcano") {
  makeVulcano(tick * params.speed * 0.04) 
  // tick * 0.0005
 }

  else if (mode == "island") {
    makeIsland(tick * params.speed * 0.04)
  }

  render();
  stats.update();
}

function render() {
  updateMeshPerFrame()
  renderer.render(scene, camera);
}

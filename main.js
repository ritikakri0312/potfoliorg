import './style.css'
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { randFloatSpread } from 'three/src/math/MathUtils';

// three things required: 1. Scene, 2. Camera, 3. Renderer
const scene = new THREE.Scene();

// (Field of view, Aspect ratio, ...view_frustrum)
// Field of view - amount of the world visible out of 360
// Aspect Ratio - Based on user browser window
// View Frustrum - to control which object are visible relative to the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Renderer render outs the actual graphics to the user
// Renderer needs to know which dom element to use
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);

// animate();//render -> draw

// Adding Object
// for object 3 basic steps to make a object: 1. Geometry, 2. Material, 3. Mesh
// 1. Geometry - the {x,y,z} points that makeup a shape
const geometry = new THREE.TorusGeometry(10,3,16,100)
// 2. Material - to give object a color and some kind of texture
// Wrapping paper for a geometry
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
// 3. Mesh - geometry + material
const torus = new THREE.Mesh(geometry,material);

scene.add(torus);


// Adding light
const pointLight = new THREE.PointLight(0xfffffff);
pointLight.position.set(10,20,20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);

//Installing helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper,gridHelper);

// adding orbit controls
const controls = new OrbitControls(camera,renderer.domElement);

// adding stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


// adding space
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Adding Texture Loader Mapping
const hemantTexture = new THREE.TextureLoader().load('Profile.jpeg');

const hemant = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:hemantTexture})
);

scene.add(hemant);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// Adding height and depth to the image
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.5;
  moon.rotation.y += 0.75;
  moon.rotation.z += 0.05;
  
  hemant.rotation.y += 0.01;
  hemant.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;





function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();

  renderer.render(scene,camera);
}


animate();


// Import Three.js modules (ES6 imports)
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Initialize Scene, Camera, and Renderer
const canvas = document.getElementById("renderCanvas"); // Match your canvas element ID
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202040);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 10, 30);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Basketball Court
const courtTexture = new THREE.TextureLoader().load("./assets/court.png");
const courtMaterial = new THREE.MeshStandardMaterial({ map: courtTexture });
const courtGeometry = new THREE.PlaneGeometry(28, 15);
const court = new THREE.Mesh(courtGeometry, courtMaterial);
court.rotation.x = -Math.PI / 2; // Lay flat
scene.add(court);

// Hoop
const loader = new GLTFLoader();
loader.load("./assets/hoop.glb", (gltf) => {
  const hoop = gltf.scene;
  hoop.scale.set(1.5, 1.5, 1.5);
  hoop.position.set(0, 3.05, 11);
  hoop.rotation.y = Math.PI; // Face correct direction
  scene.add(hoop);
});

// Basketball
loader.load("./assets/basketball.glb", (gltf) => {
  const basketball = gltf.scene;
  basketball.scale.set(0.6, 0.6, 0.6);
  basketball.position.set(0, 1.6, -4.6);
  scene.add(basketball);
});

// Ground Plane (optional for environment)
const groundTexture = new THREE.TextureLoader().load("./assets/floor1.png");
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01; // Slightly below the court
scene.add(ground);

// Window Resize Handling
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animate the Scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

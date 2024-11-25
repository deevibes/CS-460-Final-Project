// Get the canvas element
const canvas = document.getElementById('renderCanvas');

// Generate the Babylon.js 3D engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  

  // Wait for Ammo.js to be ready
  await Ammo();

  // Enable physics
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());

  // Create a basic camera and light
  const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 1.6, -5), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  // Create a ground plane
   const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
   ground.position.y = 0;
   ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.5, friction: 0.5}, scene);
  
  // Load the basketball model 
  BABYLON.SceneLoader.ImportMesh(
    '',
    'assets/basketball.glb',
    scene,
    function (meshes) {
        const basketball = meshes[0];
        basketball.name = 'basketball'
        basketball.scaling.scaleInPlace(0.24); // Adjust the scale if necessary
        basketball.position = new BABYLON.Vector3(0, 1.6, -1);

        // Assign physics impostor to the basketball
        basketball.physicsImpostor = new BABYLON.PhysicsImpostor(basketball,
            BABYLON.PhysicsImpostor.SphereImposter,
            { mass: 0.624, restitution: 0.6, friction: 0.5 },
            scene
            );
        }
    );
    // Load the hoop model
    BABYLON.SceneLoader.ImportMesh(
    '',
    'assets/',
    'hoop.glb',
    scene,
    function (meshes) {
      const hoop = meshes[0];
      hoop.name = 'hoop';
      hoop.scaling.scaleInPlace(.15); // Adjust the scale if necessary
      hoop.position = new BABYLON.Vector3(0, 3, 5);
  
      // Assign physics impostor to the hoop
      hoop.physicsImpostor = new BABYLON.PhysicsImpostor(
        hoop,
        BABYLON.PhysicsImpostor.MeshImpostor,
        { mass: 0, restitution: 0.5, friction: 0.5 },
        scene
      );
    }
  );
  // Create a simplified rim using a torus
  const rim = BABYLON.MeshBuilder.CreateTorus('rim', { diameter: 0.45, thickness: 0.02 }, scene);
  rim.position = new BABYLON.Vector3(0, 3, 5);
  rim.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

  // Assign physics impostor
  rim.physicsImpostor = new BABYLON.PhysicsImpostor(
    rim,
    BABYLON.PhysicsImpostor.MeshImpostor,
    { mass: 0, restitution: 0.5, friction: 0.5 },
    scene
  );
  // Assuming backboard is a separate mesh
const backboard = BABYLON.MeshBuilder.CreateBox('backboard', { width: 1.8, height: 1.05, depth: 0.02 }, scene);
backboard.position = new BABYLON.Vector3(0, 3.7, 4.9);

  // Assign physics impostor
  backboard.physicsImpostor = new BABYLON.PhysicsImpostor(
    backboard,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.5, friction: 0.5 },
    scene
  );

  
  // Return the created scene
  return scene;
};

// Call the createScene function
const scenePromise = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(() => {
  scenePromise.then(scene => {
    scene.render();
  });
});

// Resize the engine when the window is resized
window.addEventListener('resize', function () {
  engine.resize();
});

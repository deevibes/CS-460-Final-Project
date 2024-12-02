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
  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.8, -5), scene);
  camera.setTarget(new BABYLON.Vector3(0, 3, 5));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  const stadiumLight = new BABYLON.PointLight("stadiumLight", new BABYLON.Vector3(0, 10, 0), scene);
  stadiumLight.intensity = 0.8;

  // Load the court model
  BABYLON.SceneLoader.ImportMesh(
    "",                // Load all meshes
    "assets/",         // Path to the assets folder
    "court.glb",       // The filename of your court model
    scene,
    function (meshes) {
      const courtParent = new BABYLON.TransformNode("courtParent", scene);
      meshes.forEach(function (mesh) {
        mesh.parent = courtParent;
        // Assign physics impostor to the floor mesh
        if (mesh.name === "Floor") {
          mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.5, friction: 0.5 },
            scene
          );

            // Position and scale as needed
    courtParent.position = new BABYLON.Vector3(0, 0, 0);
    courtParent.scaling = new BABYLON.Vector3(1, 1, 1);

    // Remove any rotation adjustments
    courtParent.rotation = new BABYLON.Vector3(0, 0, 0);
        }
      });

      // Adjust court transformations
      courtParent.position = new BABYLON.Vector3(0, 0, 0);
      courtParent.scaling = new BABYLON.Vector3(1, 1, 1);
    },
    null,
    function (scene, message) {
      console.error("Error loading court model:", message);
    }
  );

  // Load the basketball model
  BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/",
    "basketball.glb",
    scene,
    function (meshes) {
      const basketball = meshes[0];
      basketball.name = 'basketball';
      basketball.scaling.scaleInPlace(1);
      basketball.position = new BABYLON.Vector3(0, 1.6, -1);

      // Assign physics impostor
      basketball.physicsImpostor = new BABYLON.PhysicsImpostor(
        basketball,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass: 0.624, restitution: 0.6, friction: 0.5 },
        scene
      );
    },
    null,
    function (scene, message) {
      console.error("Error loading basketball model:", message);
    }
  );

  // Load other elements (e.g., crowd, sounds) as needed
  // ...

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

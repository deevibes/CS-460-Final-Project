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
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 1.8, -5), // Position at free-throw line height and behind the hoop
    scene
);
camera.setTarget(new BABYLON.Vector3(0, 3, 5)); // Target is the hoop's position
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

const stadiumLight = new BABYLON.PointLight("stadiumLight", new BABYLON.Vector3(0, 10, 0), scene);
stadiumLight.intensity = 0.8;

const shadowGenerator = new BABYLON.ShadowGenerator(1024, stadiumLight);
shadowGenerator.useBlurExponentialShadowMap = true;

// Create a ground plane
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 15 }, scene);
ground.position.y = 0;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.5, friction: 0.5}, scene);


  // Create a material for the basketball court
  const courtMaterial = new BABYLON.StandardMaterial("courtMaterial", scene);

  // Load the court texture
  courtMaterial.diffuseTexture = new BABYLON.Texture("assets/Court/textures/court.png", scene);

  // Apply the material to the ground
  ground.material = courtMaterial;

  const createCrowd = (position, texturePath) => {
    const crowdPlane = BABYLON.MeshBuilder.CreatePlane("crowdPlane", { width: 10, height: 5 }, scene);
    crowdPlane.position = position;

    const crowdMaterial = new BABYLON.StandardMaterial("crowdMaterial", scene);
    crowdMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);
    crowdMaterial.diffuseTexture.hasAlpha = true;
    crowdPlane.material = crowdMaterial;

    return crowdPlane;
  };
  createCrowd(new BABYLON.Vector3(0, 2.5, 8), "assets/Court/textures/crowd.png");
  createCrowd(new BABYLON.Vector3(10, 2.5, 8), "assets/Court/textures/crowd.png");
  createCrowd(new BABYLON.Vector3(-10, 2.5, 8), "assets/Court/textures/crowd.png");

  /* Load the basketball model 
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
    */

    // Load the hoop model
    BABYLON.SceneLoader.ImportMesh(
    '',
    'assets/',
    'hoop.glb',
    scene,
    function (meshes) {
      const hoopTransform = 
      new BABYLON.TransformNode("hoopTransform", scene);

      const hoop = meshes[0];
      hoop.name = 'hoop';
      
      hoop.scaling.scaleInPlace(.15); // Adjust the scale if necessary

     
      hoop.position = new BABYLON.Vector3(15, 5, 7.5);

      hoopTransform.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        
      console.log("Hoop positioned at Z:", hoop.position);

      // Assign physics impostor to the hoop
      hoop.physicsImpostor = new BABYLON.PhysicsImpostor(
        hoop,
        BABYLON.PhysicsImpostor.MeshImpostor,
        { mass: 0, restitution: 0.5, friction: 0.5 },
        scene
      );
    }
  );

  const cheerSound = 
  new BABYLON.Sound("cheer", "assets/sounds/crowd.mp3", scene, null, { loop: true, autoplay: true });


  /*
  const dynamicTexture = new BABYLON.DynamicTexture("scoreboard", { width: 512, height: 256 }, scene);
  dynamicTexture.drawText("Score: 0", 50, 100, "bold 36px Arial", "white", "black");

  const scoreboard = BABYLON.MeshBuilder.CreatePlane("scoreboard", { width: 2, height: 1 }, scene);
  scoreboard.position = new BABYLON.Vector3(0, 3, -5);

  const scoreboardMaterial = new BABYLON.StandardMaterial("scoreboardMaterial", scene);
  scoreboardMaterial.diffuseTexture = dynamicTexture;
  scoreboard.material = scoreboardMaterial;
  */
 /*
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground], // Define ground as the floor for VR
    optionalFeatures: true, // Allow WebXR to work on localhost
  });
  
  */


  /*
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
  */

  
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

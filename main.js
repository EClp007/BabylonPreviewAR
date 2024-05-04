import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas");

// Create a Babylon.js engine
const engine = new BABYLON.Engine(canvas);

// Asynchronous function to create the scene
const createScene = async () => {
	// Create a new Babylon.js scene
	const scene = new BABYLON.Scene(engine);

	// Create a default camera and light in the scene
	const camera = new BABYLON.ArcRotateCamera(
		"camera",
		0,
		0,
		10,
		new BABYLON.Vector3(0, 0, 0),
		scene,
	);
	camera.attachControl(true);
	camera.setPosition(new BABYLON.Vector3(0, 0, 10));
	const light = new BABYLON.HemisphericLight(
		"light",
		new BABYLON.Vector3(0, 1, 0),
		scene,
	);

	const result = await BABYLON.SceneLoader.ImportMeshAsync(
		"",
		"TUD_Logo.stl",
		"",
		scene,
	);
	const model = result.meshes[0];
	model.rotation = new BABYLON.Vector3((3 / 2) * Math.PI, Math.PI, 0);
	model.position = new BABYLON.Vector3(0, 0, 0);
	model.renderOverlay = true;
	model.overlayColor = new BABYLON.Color3(0, 0, 0.5);
	model.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

	/*
  const ground = new BABYLON.MeshBuilder.CreateGround('ground', {
    height: 100,
    width : 100,
  });

  const groundCatMat = new BABYLON.StandardMaterial();
  ground.material = groundCatMat;
  groundCatMat.diffuseTexture = new BABYLON.Texture('/galaxy.jpg');*/

	scene.registerBeforeRender(() => {
		model.rotation.y += 0.01;
	});

	/*
	const xr = await scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: "immersive-ar",
		},
	});*/

	function isMobileDevice() {
		const userAgent = navigator.userAgent;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			userAgent,
		);
	}
	const sessionMode = isMobileDevice() ? "immersive-ar" : null;

	const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: sessionMode,
		},
		optionalFeatures: true,
	});
	if (!defaultXRExperience.baseExperience) {
		// XR is not supported
		console.log("XR is not supported");
	} else {
		const fm = defaultXRExperience.baseExperience.featuresManager;

		const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

		const dot = BABYLON.SphereBuilder.CreateSphere(
			"dot",
			{
				diameter: 0.05,
			},
			scene,
		);
		dot.isVisible = false;
		hitTest.onHitTestResultObservable.add((results) => {
			if (results.length) {
				dot.isVisible = true;
				results[0].transformationMatrix.decompose(
					dot.scaling,
					dot.rotationQuaternion,
					dot.position,
				);
			} else {
				dot.isVisible = false;
			}
		});
	}

	// Return the scene once everything is loaded
	return scene;
};

// Call the createScene function and wait for the scene to be created
createScene().then((scene) => {
	// Run the render loop to continuously render the scene
	engine.runRenderLoop(() => {
		scene.render();
	});

	// Enable Babylon Inspector for debugging
	Inspector.Show(scene, { enablePopup: false });
});

// Handle window resizing
window.addEventListener("resize", () => {
	engine.resize();
});

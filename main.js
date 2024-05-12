import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";
import { camera } from "./components/camera";
import { tudLogo } from "./components/tudLogo";
import { video } from "./components/video";
import { isMobileDevice } from "./helpers/isMobileDevice";
import { hitTest } from "./components/hitTest";
import { createGUI } from "./components/gUI";
import { vrMovement } from "./components/vrMovement";
import { handtracking } from "./components/handtracking";

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas");

// Create a Babylon.js engine
const engine = new BABYLON.Engine(canvas);

// Asynchronous function to create the scene
const createScene = async () => {
	// Create a new Babylon.js scene
	const scene = new BABYLON.Scene(engine);

	// Create a default camera and light in the scene
	camera(scene);

	tudLogo(scene);

	video(scene);

	createGUI(scene);

	const sessionMode = isMobileDevice() ? "immersive-ar" : null;

	const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: sessionMode,
		},
		optionalFeatures: true,
		disableTeleportation: true,
	});
	if (!defaultXRExperience.baseExperience) {
		// XR is not supported
		console.log("XR is not supported");
	} else {
		const featureManager = defaultXRExperience.baseExperience.featuresManager;

		const supported =
			await defaultXRExperience.baseExperience.sessionManager.isSessionSupportedAsync(
				"immersive-ar",
			);
		if (supported) {
			// ar
			hitTest(scene);
		} else {
			// vr
			vrMovement(featureManager, defaultXRExperience);
			// Enable hand tracking
			handtracking(featureManager, defaultXRExperience);
		}
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

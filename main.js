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
import * as GUI from "@babylonjs/gui";

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

	//createGUI(scene);

	// Create the 3D GUI manager
	const manager = new GUI.GUI3DManager(scene);

	// Create a horizontal stack panel
	const panel = new GUI.SpherePanel();
	panel.margin = 0.2;
	manager.addControl(panel);
	panel.isVertical = false;
	panel.columns = 1;
	panel.position = new BABYLON.Vector3(3, 0, 0);
	panel.isBillboard = true;

	// create a video
	const planeOpts = {
		height: 2.4762,
		width: 3.3967,
		sideOrientation: BABYLON.Mesh.DOUBLESIDE,
	};
	const ANote0Video = BABYLON.MeshBuilder.CreatePlane(
		"plane",
		planeOpts,
		scene,
	);
	const vidPos = new BABYLON.Vector3(0, 0, 0.1);
	ANote0Video.position = vidPos;
	const ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
	const ANote0VideoVidTex = new BABYLON.VideoTexture(
		"vidtex",
		"babylonjs.mp4",
		scene,
	);
	ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
	ANote0VideoMat.roughness = 1;
	ANote0Video.material = ANote0VideoMat;
	ANote0VideoVidTex.video.muted = true;
	ANote0Video.isVisible = false;
	ANote0Video.position.z = 5;
	scene.onPointerObservable.add((evt) => {
		if (evt.pickInfo && evt.pickInfo.pickedMesh === ANote0Video) {
			if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
			else ANote0VideoVidTex.video.pause();
			console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
		}
	}, BABYLON.PointerEventTypes.POINTERPICK);

	// Function to add a button to the panel
	const addButtonVideo = () => {
		const button = new GUI.Button3D("video");
		panel.addControl(button);

		button.onPointerUpObservable.add(() => {
			ANote0Video.isVisible = !ANote0Video.isVisible;
			logoModel.isVisible = false;
		});

		const textBlock = new GUI.TextBlock();
		textBlock.text = "Change video";
		textBlock.color = "white";
		textBlock.fontSize = 24;
		button.content = textBlock;
	};

	// Load the TUD logo
	const logo = await BABYLON.SceneLoader.ImportMeshAsync(
		"", // Import all meshes
		"TUD_Logo.stl",
		"",
		scene,
	);
	const logoModel = logo.meshes[0];
	logoModel.rotation = new BABYLON.Vector3((3 / 2) * Math.PI, Math.PI, 0);
	logoModel.renderOverlay = true;
	logoModel.overlayColor = new BABYLON.Color3(0, 0, 0.5);
	logoModel.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
	logoModel.isVisible = false;
	logoModel.position.z = 3;
	// Register a function to be called before every frame render
	scene.onBeforeRenderObservable.add(() => {
		logoModel.rotation.y += 0.01;
	});
	// Function to add a logo button to the panel
	const addButtonLogo = () => {
		const button = new GUI.Button3D("logo");
		panel.addControl(button);

		button.onPointerUpObservable.add(() => {
			logoModel.isVisible = !logoModel.isVisible;
			ANote0Video.isVisible = false;
		});

		const textBlock = new GUI.TextBlock();
		textBlock.text = "Change logo";
		textBlock.color = "white";
		textBlock.fontSize = 24;
		button.content = textBlock;
	};

	// Add multiple buttons using the addButton function
	addButtonVideo();
	addButtonLogo();

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

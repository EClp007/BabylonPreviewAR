import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";
import { vrMovement } from "./components/vrMovement";
import { handtracking } from "./components/handtracking";
import * as GUI from "@babylonjs/gui";
import { FireProceduralTexture } from "@babylonjs/procedural-textures";

// Hit test function
export const hitTest = async (scene, featureManager) => {
	const hitTestFeature = featureManager.enableFeature(
		BABYLON.WebXRHitTest,
		"latest",
	);
	const model = new BABYLON.Mesh("model", scene);
	model.position = new BABYLON.Vector3(5, 0, 0);

	const dot = BABYLON.MeshBuilder.CreateSphere(
		"dot",
		{ diameter: 0.05 },
		scene,
	);

	hitTestFeature.onHitTestResultObservable.add((results) => {
		if (results.length) {
			dot.isVisible = true;
			results[0].transformationMatrix.decompose(
				dot.scaling,
				dot.rotationQuaternion || undefined,
				dot.position,
			);
		} else {
			dot.isVisible = false;
		}
	});

	return hitTestFeature;
};

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas");
// Create a Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Function to create the scene
const createScene = async () => {
	const scene = new BABYLON.Scene(engine);
	setupCameraAndLighting(scene);
	const groundFromHM = createGround(scene);
	const picHM = createPicture(scene);
	const ANote0Video = createVideo(scene);
	const plane = createFireSphere(scene);
	const logoModel = await loadLogo(scene);
	const skyBox = createSkybox(scene);

	// Create the 3D GUI manager and panel
	const manager = new GUI.GUI3DManager(scene);
	const panel = createPanel(manager);

	// Add buttons to the panel
	addButtonVideo(panel, ANote0Video, logoModel, plane, groundFromHM, picHM);
	addButtonSphere(panel, ANote0Video, logoModel, plane, groundFromHM, picHM);
	addButtonGround(panel, ANote0Video, logoModel, plane, groundFromHM, picHM);
	addButtonLogo(panel, ANote0Video, logoModel, plane, groundFromHM, picHM);
	addButtonLightToggle(panel, scene);
	addButtonSkyboxToggle(panel, scene, skyBox);

	let activeHitTest = null;

	const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: "immersive-ar", // "immersive-vr"
		},
		optionalFeatures: true,
	});
	const featureManager = defaultXRExperience.baseExperience.featuresManager;

	// Add hit test button to the panel
	addButtonHitTest(panel, scene, featureManager, activeHitTest);

	setupXRExperience(scene, featureManager);

	return scene;
};

// Set up camera and lighting in the scene
const setupCameraAndLighting = (scene) => {
	const camera = new BABYLON.ArcRotateCamera(
		"camera",
		4.577,
		1.553,
		4.1529,
		new BABYLON.Vector3(0, 0, 2),
		scene,
	);
	camera.attachControl(canvas, true);

	const light = new BABYLON.HemisphericLight(
		"light",
		new BABYLON.Vector3(0, 1, 0),
		scene,
	);
	light.intensity = 0.5;

	const light2 = new BABYLON.PointLight(
		"light2",
		new BABYLON.Vector3(0, 5, 0),
		scene,
	);
	light2.diffuse = new BABYLON.Color3(1, 0, 1);
	light2.specular = new BABYLON.Color3(1, 0, 1);
};

// Create the ground from a height map
const createGround = (scene) => {
	const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
	groundMaterial.wireframe = true;

	const groundFromHM = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
		"groundHM",
		"Heightmap_Norddeutschland.jpg",
		{
			width: 100,
			height: 100,
			subdivisions: 100,
			minHeight: 0,
			maxHeight: 10,
			onReady: () => {
				console.log("Ground created from height map");
			},
			updatable: false,
		},
		scene,
	);

	groundFromHM.position.y = -20;
	groundFromHM.material = groundMaterial;
	groundFromHM.isVisible = false;

	return groundFromHM;
};

// Create a skybox
const createSkybox = (scene) => {
	const skybox = BABYLON.MeshBuilder.CreateBox(
		"skyBox",
		{ size: 1000.0 },
		scene,
	);
	const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
		"textures/skybox",
		scene,
	);
	skyboxMaterial.reflectionTexture.coordinatesMode =
		BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;
	skybox.isVisible = false;

	return skybox;
};

// Create a picture plane
const createPicture = (scene) => {
	const material = new BABYLON.StandardMaterial("texture1", scene);
	material.diffuseTexture = new BABYLON.Texture(
		"Heightmap_Norddeutschland.jpg",
		scene,
	);
	material.emissiveTexture = new BABYLON.Texture(
		"Heightmap_Norddeutschland.jpg",
		scene,
	);

	const picHM = BABYLON.MeshBuilder.CreatePlane(
		"plane",
		{ height: 2, width: 2 },
		scene,
	);
	picHM.material = material;
	picHM.position.z = 5;
	picHM.isVisible = false;

	return picHM;
};

// Create a video plane
const createVideo = (scene) => {
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
	ANote0Video.position = new BABYLON.Vector3(0, 0, 0.1);

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

	return ANote0Video;
};

// Create a sphere with a fire texture
const createFireSphere = (scene) => {
	const plane = BABYLON.MeshBuilder.CreateSphere("plane", scene);
	plane.scaling = new BABYLON.Vector3(2, 2, 2);
	plane.position = new BABYLON.Vector3(0, 0, 5);

	const planeMat = new BABYLON.StandardMaterial("planeMat", scene);
	plane.material = planeMat;

	const fireTexture = new FireProceduralTexture("perlin", 256, scene);
	planeMat.emissiveTexture = fireTexture;
	plane.isVisible = false;

	return plane;
};

// Load the TUD logo
const loadLogo = async (scene) => {
	const logo = await BABYLON.SceneLoader.ImportMeshAsync(
		"",
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

	scene.onBeforeRenderObservable.add(() => {
		logoModel.rotation.y += 0.01;
	});

	return logoModel;
};

// Create the 3D GUI panel
const createPanel = (manager) => {
	const panel = new GUI.SpherePanel();
	panel.margin = 0.2;
	manager.addControl(panel);
	panel.isVertical = false;
	panel.columns = 1;
	panel.position = new BABYLON.Vector3(3, 0, 0);
	panel.isBillboard = true;

	return panel;
};

// Add button to toggle video visibility
const addButtonVideo = (
	panel,
	ANote0Video,
	logoModel,
	plane,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("video");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		ANote0Video.isVisible = !ANote0Video.isVisible;
		logoModel.isVisible = false;
		plane.isVisible = false;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Change video";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle sphere visibility
const addButtonSphere = (
	panel,
	ANote0Video,
	logoModel,
	plane,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("logo");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		ANote0Video.isVisible = false;
		logoModel.isVisible = false;
		plane.isVisible = !plane.isVisible;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Change Sphere";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle ground visibility
const addButtonGround = (
	panel,
	ANote0Video,
	logoModel,
	plane,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("logo");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		ANote0Video.isVisible = false;
		logoModel.isVisible = false;
		plane.isVisible = false;
		groundFromHM.isVisible = !groundFromHM.isVisible;
		picHM.isVisible = !picHM.isVisible;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Ground";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle logo visibility
const addButtonLogo = (
	panel,
	ANote0Video,
	logoModel,
	plane,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("logo");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		logoModel.isVisible = !logoModel.isVisible;
		ANote0Video.isVisible = false;
		plane.isVisible = false;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Change logo";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle light
const addButtonLightToggle = (panel, scene) => {
	const button = new GUI.Button3D("lightToggle");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		const light2 = scene.getLightByName("light2");
		light2.setEnabled(!light2.isEnabled());
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Toggle Light";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle skybox
const addButtonSkyboxToggle = (panel, scene, skyBox) => {
	const button = new GUI.Button3D("skyboxToggle");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		skyBox.isVisible = !skyBox.isVisible;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Toggle Skybox";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle hit test
const addButtonHitTest = (panel, scene, featureManager, activeHitTest) => {
	const button = new GUI.Button3D("hitTest");
	panel.addControl(button);

	button.onPointerUpObservable.add(async () => {
		if (activeHitTest) {
			activeHitTest.dispose();
			activeHitTest = null;
		} else {
			activeHitTest = await hitTest(scene, featureManager);
		}
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Toggle Hit Test";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Setup XR experience
const setupXRExperience = async (scene, featureManager) => {
	const vrOrAr = "ar";

	if (vrOrAr === "ar") {
		const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
			uiOptions: {
				sessionMode: "immersive-ar",
			},
			optionalFeatures: true,
		});
		addButtonHitTest(defaultXRExperience.baseExperience.featuresManager);
		handtracking(featureManager, defaultXRExperience);
	} else if (vrOrAr === "vr") {
		const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
			uiOptions: {
				sessionMode: "immersive-vr",
			},
			optionalFeatures: true,
		});
		vrMovement(featureManager, defaultXRExperience);
		handtracking(featureManager, defaultXRExperience);
	}
};

// Create and run the scene
createScene().then((scene) => {
	engine.runRenderLoop(() => {
		scene.render();
	});
	Inspector.Show(scene, { enablePopup: false });
});

// Handle window resizing
window.addEventListener("resize", () => {
	engine.resize();
});

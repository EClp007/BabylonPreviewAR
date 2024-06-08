import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";
import { vrMovement } from "./components/vrMovement";
import { handtracking } from "./components/handtracking";
import * as GUI from "@babylonjs/gui";
import { FireProceduralTexture } from "@babylonjs/procedural-textures";

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas");
// Create a Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Function to create the scene
const createScene = async () => {
	const scene = new BABYLON.Scene(engine);
	setupCameraAndLighting(scene);
	const groundFromHM = createGroundFromHM(scene);
	const picHM = createPictureWithHM(scene);
	const video = createVideo(scene);
	const fireSphere = createFireSphere(scene);
	const tUDLogo = await loadtUDLogo(scene);
	const skyBox = createSkybox(scene);

	// Create the 3D GUI manager
	const manager = new GUI.GUI3DManager(scene);

	// Create two panels for the buttons
	const panel1 = createPanel(manager, new BABYLON.Vector3(3, 0, 0));
	const panel2 = createPanel(manager, new BABYLON.Vector3(-3, 0, 0)); // Adjust position for second column

	// Add buttons to the first panel
	addButtonVideo(panel1, video, tUDLogo, fireSphere, groundFromHM, picHM);
	addButtonSphere(panel1, video, tUDLogo, fireSphere, groundFromHM, picHM);
	addButtonHeightmap(panel1, video, tUDLogo, fireSphere, groundFromHM, picHM);
	addButtonLogo(panel1, video, tUDLogo, fireSphere, groundFromHM, picHM);

	// Add buttons to the second panel
	addButtonLightToggle(panel2, scene);
	addButtonSkyboxToggle(panel2, skyBox);

	setupXRExperience(scene);

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

	const ambientLight = new BABYLON.HemisphericLight(
		"ambientLight ",
		new BABYLON.Vector3(0, 1, 0),
		scene,
	);
	ambientLight.intensity = 0.5;

	const magentaSpotlight = new BABYLON.PointLight(
		"magentaSpotlight ",
		new BABYLON.Vector3(0, 5, 0),
		scene,
	);
	magentaSpotlight.diffuse = new BABYLON.Color3(1, 0, 1);
	magentaSpotlight.specular = new BABYLON.Color3(1, 0, 1);
	magentaSpotlight.setEnabled(false);
};

// Create the ground from a height map
const createGroundFromHM = (scene) => {
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

// Create a picture fireSphere
const createPictureWithHM = (scene) => {
	const material = new BABYLON.StandardMaterial("texture1", scene);
	material.emissiveTexture = new BABYLON.Texture(
		"Heightmap_Norddeutschland.jpg",
		scene,
	);

	const picHM = BABYLON.MeshBuilder.CreatePlane(
		"picHM",
		{ height: 2, width: 2 },
		scene,
	);
	picHM.material = material;
	picHM.position.z = 5;
	picHM.isVisible = false;

	return picHM;
};

// Create a video fireSphere
const createVideo = (scene) => {
	const planeOpts = {
		height: 2.4762,
		width: 3.3967,
		sideOrientation: BABYLON.Mesh.DOUBLESIDE,
	};
	const video = BABYLON.MeshBuilder.CreatePlane("video", planeOpts, scene);
	video.position = new BABYLON.Vector3(0, 0, 0.1);

	const ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
	const ANote0VideoVidTex = new BABYLON.VideoTexture(
		"vidtex",
		"babylonjs.mp4",
		scene,
	);
	ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
	ANote0VideoMat.roughness = 1;
	video.material = ANote0VideoMat;
	ANote0VideoVidTex.video.muted = true;
	video.isVisible = false;
	video.position.z = 5;

	scene.onPointerObservable.add((evt) => {
		if (evt.pickInfo && evt.pickInfo.pickedMesh === video) {
			if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
			else ANote0VideoVidTex.video.pause();
			console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
		}
	}, BABYLON.PointerEventTypes.POINTERPICK);

	return video;
};

// Create a sphere with a fire texture
const createFireSphere = (scene) => {
	const fireSphere = BABYLON.MeshBuilder.CreateSphere("fireSphere", scene);
	fireSphere.scaling = new BABYLON.Vector3(2, 2, 2);
	fireSphere.position = new BABYLON.Vector3(0, 0, 5);

	const planeMat = new BABYLON.StandardMaterial("planeMat", scene);
	fireSphere.material = planeMat;

	const fireTexture = new FireProceduralTexture("perlin", 256, scene);
	planeMat.emissiveTexture = fireTexture;
	fireSphere.isVisible = false;

	return fireSphere;
};

// Load the TUD logo
const loadtUDLogo = async (scene) => {
	const logo = await BABYLON.SceneLoader.ImportMeshAsync(
		"",
		"TUD_Logo.stl",
		"",
		scene,
	);
	const tUDLogo = logo.meshes[0];
	tUDLogo.rotation = new BABYLON.Vector3((3 / 2) * Math.PI, Math.PI, 0);
	tUDLogo.renderOverlay = true;
	tUDLogo.overlayColor = new BABYLON.Color3(0, 0, 0.5);
	tUDLogo.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
	tUDLogo.isVisible = false;
	tUDLogo.position.z = 5;

	scene.onBeforeRenderObservable.add(() => {
		tUDLogo.rotation.y += 0.01;
	});

	return tUDLogo;
};

// Create the 3D GUI panel
const createPanel = (manager, position) => {
	const panel = new GUI.SpherePanel();
	panel.margin = 0.2;
	manager.addControl(panel);
	panel.isVertical = false;
	panel.columns = 1;
	panel.position = position;
	panel.isBillboard = true;

	return panel;
};

// Add button to toggle video visibility
const addButtonVideo = (
	panel,
	video,
	tUDLogo,
	fireSphere,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("video");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		video.isVisible = !video.isVisible;
		tUDLogo.isVisible = false;
		fireSphere.isVisible = false;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Video";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle sphere visibility
const addButtonSphere = (
	panel,
	video,
	tUDLogo,
	fireSphere,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("fireSphere");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		video.isVisible = false;
		tUDLogo.isVisible = false;
		fireSphere.isVisible = !fireSphere.isVisible;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Fire Sphere";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle ground visibility
const addButtonHeightmap = (
	panel,
	video,
	tUDLogo,
	fireSphere,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("heightmap");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		video.isVisible = false;
		tUDLogo.isVisible = false;
		fireSphere.isVisible = false;
		groundFromHM.isVisible = !groundFromHM.isVisible;
		picHM.isVisible = !picHM.isVisible;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Heightmap";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle logo visibility
const addButtonLogo = (
	panel,
	video,
	tUDLogo,
	fireSphere,
	groundFromHM,
	picHM,
) => {
	const button = new GUI.Button3D("logo");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		tUDLogo.isVisible = !tUDLogo.isVisible;
		video.isVisible = false;
		fireSphere.isVisible = false;
		groundFromHM.isVisible = false;
		picHM.isVisible = false;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "TUD Logo";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle ambientLight
const addButtonLightToggle = (panel, scene) => {
	const button = new GUI.Button3D("lightToggle");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		const magentaSpotlight = scene.getLightByName("magentaSpotlight ");
		magentaSpotlight.setEnabled(!magentaSpotlight.isEnabled());
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Magenta Spotlight";
	textBlock.color = "white";
	textBlock.fontSize = 24;
	button.content = textBlock;
};

// Add button to toggle skybox
const addButtonSkyboxToggle = (panel, skyBox) => {
	const button = new GUI.Button3D("skyboxToggle");
	panel.addControl(button);

	button.onPointerUpObservable.add(() => {
		skyBox.isVisible = !skyBox.isVisible;
	});

	const textBlock = new GUI.TextBlock();
	textBlock.text = "Skybox";
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
	/* Inspector.Show(scene, { enablePopup: false }); */
});

// Handle window resizing
window.addEventListener("resize", () => {
	engine.resize();
});

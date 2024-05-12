import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Inspector } from "@babylonjs/inspector";

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

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
	model.renderOverlay = true;
	model.overlayColor = new BABYLON.Color3(0, 0, 0.5);
	model.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

	/*
	const planeOpts = {
		height: 5.4762,
		width: 7.3967,
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
	scene.onPointerObservable.add((evt) => {
		if (evt.pickInfo && evt.pickInfo.pickedMesh === ANote0Video) {
			if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
			else ANote0VideoVidTex.video.pause();
			console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
		}
	}, BABYLON.PointerEventTypes.POINTERPICK);
	*/
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
	/* */

	function isMobileDevice() {
		const userAgent = navigator.userAgent;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			userAgent,
		);
	}
	const sessionMode = isMobileDevice() ? "immersive-ar" : null;

	const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: sessionMode as XRSessionMode,
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
			const hitTest = featureManager.enableFeature(
				BABYLON.WebXRHitTest,
				"latest",
			) as BABYLON.WebXRHitTest;

			model.position = new BABYLON.Vector3(5, 0, 0);

			const dot = BABYLON.MeshBuilder.CreateSphere(
				"dot",
				{
					diameter: 0.05,
				},
				scene,
			);

			hitTest.onHitTestResultObservable.add((results) => {
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
		} else {
			// vr

			featureManager.enableFeature(
				BABYLON.WebXRFeatureName.MOVEMENT,
				"latest",
				{
					xrInput: defaultXRExperience.input,
				},
			);
			// Enable hand tracking
			try {
				featureManager.enableFeature(
					BABYLON.WebXRFeatureName.HAND_TRACKING,
					"latest",
					{
						xrInput: defaultXRExperience.input,
						// other options
					},
				);
			} catch (e) {
				console.log(e);
			}
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

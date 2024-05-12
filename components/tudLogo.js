export const tudLogo = async (scene) => {
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
	logoModel.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

	// Register a function to be called before every frame render
	scene.onBeforeRenderObservable.add(() => {
		logoModel.rotation.y += 0.01;
	});
};

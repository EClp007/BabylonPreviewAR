export const camera = async (scene) => {
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
};

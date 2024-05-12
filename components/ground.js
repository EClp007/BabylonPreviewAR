export const ground = async (scene) => {
	const ground = new BABYLON.MeshBuilder.CreateGround("ground", {
		height: 100,
		width: 100,
	});

	const groundCatMat = new BABYLON.StandardMaterial();
	ground.material = groundCatMat;
	groundCatMat.diffuseTexture = new BABYLON.Texture("/galaxy.jpg");
};

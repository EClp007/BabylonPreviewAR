export const hitTest = async (scene) => {
	const hitTest = featureManager.enableFeature(BABYLON.WebXRHitTest, "latest");

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
};

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

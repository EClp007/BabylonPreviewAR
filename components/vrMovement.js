export const vrMovement = async (featureManager, defaultXRExperience) => {
	featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", {
		xrInput: defaultXRExperience.input,
	});
};

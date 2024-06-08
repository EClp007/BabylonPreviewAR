import * as BABYLON from "@babylonjs/core";

export const vrMovement = async (featureManager, defaultXRExperience) => {
	try {
		featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", {
			xrInput: defaultXRExperience.input,
		});
	} catch (e) {
		console.log(e);
	}
};

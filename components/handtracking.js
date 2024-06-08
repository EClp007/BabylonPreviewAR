import * as BABYLON from "@babylonjs/core";

export const handtracking = async (featureManager, defaultXRExperience) => {
	try {
		featureManager.enableFeature(
			BABYLON.WebXRFeatureName.HAND_TRACKING,
			"latest",
			{
				xrInput: defaultXRExperience.input,
			},
		);
	} catch (e) {
		console.log(e);
	}
};

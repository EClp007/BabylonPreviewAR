export const handtracking = async (featureManager, defaultXRExperience) => {
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
};

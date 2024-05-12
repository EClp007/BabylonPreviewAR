export const video = async (scene) => {
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
	ANote0VideoVidTex.video.muted = true;
	scene.onPointerObservable.add((evt) => {
		if (evt.pickInfo && evt.pickInfo.pickedMesh === ANote0Video) {
			if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
			else ANote0VideoVidTex.video.pause();
			console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
		}
	}, BABYLON.PointerEventTypes.POINTERPICK);
};

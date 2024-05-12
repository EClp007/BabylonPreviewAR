import * as GUI from "@babylonjs/gui";

export const createGUI = async (scene) => {
	// Create the 3D GUI manager
	const manager = new GUI.GUI3DManager(scene);

	// Create a horizontal stack panel
	const panel = new GUI.StackPanel3D();
	panel.margin = 0.02;

	manager.addControl(panel);
	panel.position.z = -1.5;

	// Function to add a button to the panel
	const addButtonVideo = () => {
		const button = new GUI.Button3D("video");
		panel.addControl(button);

		button.onPointerUpObservable.add(() => {
		});

		const textBlock = new GUI.TextBlock();
		textBlock.text = "Change video";
		textBlock.color = "white";
		textBlock.fontSize = 24;
		button.content = textBlock;
	};

	const addButtonLogo = () => {
		const button = new GUI.Button3D("logo");
		panel.addControl(button);

		button.onPointerUpObservable.add(() => {
			
		});

		const textBlock = new GUI.TextBlock();
		textBlock.text = "Change logo";
		textBlock.color = "white";
		textBlock.fontSize = 24;
		button.content = textBlock;
	};

	// Add multiple buttons using the addButton function
	addButtonVideo();
	addButtonLogo();
};

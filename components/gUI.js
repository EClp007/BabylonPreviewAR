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
	const addButton = () => {
		const button = new GUI.Button3D("orientation");
		panel.addControl(button);

		button.onPointerUpObservable.add(() => {
			panel.isVertical = !panel.isVertical;
		});

		const textBlock = new GUI.TextBlock();
		textBlock.text = "Change Orientation";
		textBlock.color = "white";
		textBlock.fontSize = 24;
		button.content = textBlock;
	};

	// Add multiple buttons using the addButton function
	addButton();
	addButton();
	addButton();
};

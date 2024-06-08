# BabylonPreviewAR

## Getting Started
Follow these steps to set up and run the project locally:

1. Install Dependencies:
    - Open the terminal.
    - Run the following command to install all necessary dependencies: `npm install`

2. Run the Local Server:
    - Start the development server by running: `npm run dev`

3. Open the Project in Your Browser:
   - Hold down the Ctrl key and left-click on the address generated in the terminal to open the project in your default web browser.

## Functions in the Babylon.js Scene
This project uses Babylon.js to create an interactive 3D scene. Below is a detailed description of the various functions implemented within the scene:
### Video
Shows or hides a video plane within the 3D scene. The video can be interacted with to play or pause it by clicking directly on the video plane. 
### Fire Sphere
Displays or hides a sphere with a dynamic fire texture. 
### Heightmap
Toggles the visibility of a ground mesh generated from a height map and a corresponding image.
### TUD Logo
 Shows or hides a 3D model of the TUD logo, which rotates continuously.
### Magenta Spotlight
Enables or disables a magenta spotlight, illuminating the scene with a distinct magenta hue. 
### Skybox
Toggles the visibility of the skybox, a large cube that surrounds the scene with a texture simulating the sky.
### XR Experience
Initializes the XR (Extended Reality) experience. Depending on the selected mode (AR or VR), this feature configures the scene for augmented reality or virtual reality interactions, including hand tracking and movement capabilities. This provides an immersive experience for users with compatible devices.

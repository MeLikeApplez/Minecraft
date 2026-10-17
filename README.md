# Minecraft
Scuffed Minecraft in JavaScript using WebGPU

 Inspired by YouTuber WSAL Evan
 - Channel -> https://www.youtube.com/@wsalevan/videos
 - Video inspiration
   - (OpenGL) https://youtu.be/v0Ks1dCMlAA?si=pPPdTPOGbw6_wdWx
   - (Vulkan) https://youtu.be/z9wBvliixaQ?si=VY98g_2bG_L9ktSn

# WebGPU instead of WebGL
WebGPU is a Web API that allows JavaScript applications to use the computer’s GPU for rendering graphics and performing high-performance computations. It provides more direct control over GPU resources, such as buffers, textures, and shaders, than WebGL. 

WebGPU offers a modern approach to recreating Minecraft, with more flexibility for rendering large worlds, managing chunks, and performing calculations in parallel. 

I switched to WebGPU instead of WebGL because it's a more modern way to work with graphics and the GPU. Since I'm recreating Minecraft, I wanted something that could handle large worlds, chunk rendering, and calculations more efficiently. It also gives me more control over how the GPU processes data, which could be useful as I add more features and expand the engine.

For more information about WebGPU => https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
> Note that [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) is still in experimental phase which means that most devices may not support WebGPU at all. [Please check if your browser supports WebGPU.](https://caniuse.com/?search=webgpu) Check out the [WebGPU Examples/Demos](https://webkit.org/demos/webgpu/) to test if your browser is compatible with WebGPU

# NodeJS

NodeJS is required to run this project
- Install NodeJS Here -> https://nodejs.org/

## Run Locally

Clone the project

```bash
  git clone https://github.com/MeLikeApplez/Minecraft.git
```

Go to the project directory

```bash
  cd ./client
```

Install dependencies

```bash
  npm install
```

Start the server: http://localhost:5173

```bash
  npm run dev
```


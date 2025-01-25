## WebGL CheatSheet

This document explains the complete functionality of a WebGL program that renders a triangle on a canvas, along with detailed explanations of each WebGL function and GLSL shader.

---

## 1. Setting Up the WebGL context on the Canvas

-   We use an HTML `<canvas>` element as the rendering surface for WebGL.
-   The canvas provides a drawable area where WebGL renders its output.

```html
<canvas id="glCanvas"></canvas>
```

-   Initializes WebGL for the canvas and returns a WebGL rendering context.

```javascript
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");
```

-   Ensures WebGL is supported on the browser.

```javascript
if (!gl) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
    return;
}
```

---

## 2. Loading and Compiling Shaders

-   WebGL requires GLSL programs for rendering. These programs are composed of a vertex shader and a fragment shader.

### Vertex Shader (GLSL)

```glsl
attribute vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
```

-   `attribute vec2 aPosition` : Input variable for vertex positions from JavaScript.
-   `gl_Position` : A built-in variable that defines the final position of the vertex in clip space.

### Fragment Shader (GLSL)

```glsl
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

-   `precision mediump float` : Specifies medium precision for floating-point numbers.
-   `gl_FragColor` : A built-in variable that sets the output color of each pixel (red in this case).

### Compiling Shaders

#### Function: `compileShader`

```javascript
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
```

1. `gl.createShader(type)`:
    - Creates a shader object for either a vertex or fragment shader.
2. `gl.shaderSource(shader, source)`:
    - Attaches GLSL source code to the shader object.
3. `gl.compileShader(shader)`:
    - Compiles the GLSL code into GPU-executable code.
4. Error Handling:
    - Checks compilation status and logs errors if any occur.

### Linking Shaders into a Program

#### Function: `createWebGLProgram`

```javascript
function createWebGLProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error("Failed to link program");
    }

    return program;
}
```

1. `gl.createProgram()`:
    - Creates a program object to combine shaders.
2. `gl.attachShader(program, shader)`:
    - Attaches compiled vertex and fragment shaders to the program.
3. `gl.linkProgram(program)`:
    - Links the shaders into a complete GPU program.
4. Error Handling:
    - Verifies the program was successfully linked.

### Using the Program

-   Activates the WebGL program so it can be used for rendering.

```javascript
const program = createWebGLProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);
```

---

## 3. Sending Vertex Data to the GPU

### Define Vertex Data

```javascript
const triangleVertices = new Float32Array([
    0.0,
    0.5, // Top vertex
    -0.5,
    -0.5, // Bottom-left vertex
    0.5,
    -0.5, // Bottom-right vertex
]);
```

-   Defines the coordinates of the triangle vertices in normalized device coordinates (NDC).
    -   X and Y values range from `-1` to `1`.

### Create and Bind Buffer

```javascript
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
```

1. `gl.createBuffer()`:
    - Allocates GPU memory for storing vertex data.
2. `gl.bindBuffer(gl.ARRAY_BUFFER, buffer)`:
    - Binds the buffer to the `ARRAY_BUFFER` target.
3. `gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW)`:
    - Uploads the vertex data to the GPU.
    - `gl.STATIC_DRAW`: Indicates that the data will not change frequently.

### Link Buffer to Shader Attribute

```javascript
const aPositionLocation = gl.getAttribLocation(program, "aPosition");
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
```

1. `gl.getAttribLocation(program, "aPosition")`:
    - Finds the location of the `aPosition` attribute in the shader.
2. `gl.enableVertexAttribArray(aPositionLocation)`:
    - Enables the vertex attribute array for `aPosition`.
3. `gl.vertexAttribPointer`:
    - Configures how the buffer data is passed to the `aPosition` attribute.
    - Parameters:
        - `2`: Each vertex has 2 components (`x, y`).
        - `gl.FLOAT`: The data type is floating-point.
        - `false`: No normalization.
        - `0`: Stride (spacing between vertices) is 0 (tightly packed).
        - `0`: Offset (start from the beginning of the buffer).

---

## **4. Clearing and Drawing**

### Clear the Canvas

```javascript
gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
gl.clear(gl.COLOR_BUFFER_BIT);
```

1. `gl.clearColor(r, g, b, a)`:
    - Sets the background color to black (`0.0, 0.0, 0.0`) with full opacity (`1.0`).
2. `gl.clear(gl.COLOR_BUFFER_BIT)`:
    - Clears the canvas with the specified background color.

### Draw the Triangle

```javascript
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

1. `gl.drawArrays(mode, first, count)`:
    - Renders the triangle based on the vertex data.
    - Parameters:
        - `gl.TRIANGLES`: Indicates the vertices represent triangles.
        - `0`: Start at the first vertex.
        - `3`: Use 3 vertices to draw the triangle.

---

## Summary of Data Flow

### 1. JavaScript (CPU)

-   The WebGL program starts with JavaScript, which initializes and configures the rendering pipeline:
    1. _Define Vertex Data_:
        - The shapes (e.g., triangle, rectangle, circle) are described as arrays of vertices in normalized device coordinates (NDC).
    2. _Compile Shaders_:
        - The vertex and fragment shaders are compiled from GLSL source code into GPU-executable code.
    3. _Link Shaders into a Program_:
        - The compiled shaders are linked together into a single WebGL program, which the GPU will execute.
    4. _Upload Vertex Data to the GPU_:
        - Vertex data is uploaded into a buffer on the GPU using WebGL buffer functions (`gl.createBuffer`, `gl.bufferData`).
    5. _Configure Attributes_:
        - The buffer data is linked to shader attributes (e.g., `aPosition`) using functions like `gl.vertexAttribPointer` and `gl.enableVertexAttribArray`.

### 2. GPU

-   Once the draw call (`gl.drawArrays`) is made, the GPU takes over and performs the following steps:
    1. _Run the Vertex Shader_:
        - For each vertex in the shape, the vertex shader runs, transforming the vertex data into clip space and determining its position on the screen.
        - Output: `gl_Position`, which specifies where the vertex will appear.
    2. _Rasterization_:
        - The GPU takes the vertices and forms triangles (or other shapes, depending on the draw mode).
        - The triangles are rasterized into fragments (pixels).
    3. _Run the Fragment Shader_:
        - For each fragment (pixel), the fragment shader runs, determining the color of the pixel (e.g., red, blue).

### 3. Canvas

-   The final processed image is rendered onto the HTML `<canvas>` element:
    1. _Clear the Canvas_:
        - The canvas is cleared and filled with the specified background color using `gl.clearColor` and `gl.clear`.
    2. _Draw the Shape_:
        - The shape is drawn on the canvas using the specified draw mode (e.g., `TRIANGLES`, `LINE_LOOP`, `TRIANGLE_FAN`).

---

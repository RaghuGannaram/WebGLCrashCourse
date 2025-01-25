// Import shader sources
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

import { shapes } from "./geometry";

// WebGL initialization
const canvas = document.getElementById("glCanvas");
const gl = initializeWebGL(canvas);

// Compile shaders and create WebGL program
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
const program = createWebGLProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// Example usage
// Change the shapeName to draw different shapes
drawShape(gl, "circle");

// Function to initialize WebGL
function initializeWebGL(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported in this browser!");
        throw new Error("WebGL not supported");
    }
    return gl;
}

// Function to compile a shader
function compileShader(gl, source, type) {
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

// Function to create a WebGL program
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

// Function to draw a selected shape
function drawShape(gl, shapeName) {
    const shapeVertices = shapes[shapeName];
    if (!shapeVertices) {
        console.error(`Shape "${shapeName}" not found!`);
        return;
    }

    // Bind buffer and upload shape data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, shapeVertices, gl.STATIC_DRAW);

    // Link buffer data to shader attribute
    const aPositionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

    // Clear canvas and draw shape
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Choose draw mode based on shape
    switch (shapeName) {
        case "triangle":
        case "rectangle":
            gl.drawArrays(gl.TRIANGLES, 0, shapeVertices.length / 2);
            break;
        case "circle":
            gl.drawArrays(gl.TRIANGLE_FAN, 0, shapeVertices.length / 2);
            break;
        case "line":
            gl.drawArrays(gl.LINES, 0, shapeVertices.length / 2);
            break;
        case "polygon":
            gl.drawArrays(gl.LINE_LOOP, 0, shapeVertices.length / 2);
            break;
        default:
            console.error("Unsupported shape type");
            break;
    }
}

export const shapes = {
    triangle: new Float32Array([
        0.0,  0.5, // Top vertex
       -0.5, -0.5, // Bottom-left vertex
        0.5, -0.5  // Bottom-right vertex
    ]),
    rectangle: new Float32Array([
       -0.5,  0.5,  // Top-left
       -0.5, -0.5,  // Bottom-left
        0.5, -0.5,  // Bottom-right

       -0.5,  0.5,  // Top-left
        0.5, -0.5,  // Bottom-right
        0.5,  0.5   // Top-right
    ]),
    circle: generateCircleVertices(0.0, 0.0, 0.5, 50),
    line: new Float32Array([
        -0.5, 0.0,  // Start point
         0.5, 0.0   // End point
    ]),
    polygon: generatePolygonVertices(0.0, 0.0, 0.5, 6) // Hexagon
};

// Function to generate circle vertices
function generateCircleVertices(cx, cy, radius, numSegments) {
    const vertices = [cx, cy]; // Center of the circle
    const angleStep = (Math.PI * 2) / numSegments;

    for (let i = 0; i <= numSegments; i++) {
        const angle = i * angleStep;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    return new Float32Array(vertices);
}

// Function to generate polygon vertices
function generatePolygonVertices(cx, cy, radius, numSides) {
    const vertices = [];
    const angleStep = (Math.PI * 2) / numSides;

    for (let i = 0; i < numSides; i++) {
        const angle = i * angleStep;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    return new Float32Array(vertices);
}
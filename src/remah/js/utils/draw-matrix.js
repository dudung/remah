/*
  draw-matrix.js
  Draw matrix on canvas
  v0.0.1 - 20240713

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240713 Start this utility.
  - Choose kebab-case over snake_case, camelCase of PascalCase.
  - Draw matrix on canvas with only black and white colors.
*/


// Execute main function.
main();


// Define main function.
function main() {
  let c = createCanvas(400, 200);
  let m = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
    
  drawMatrixBW(m, c);
}


// Draw matrix on canvas with black and white colors
function drawMatrixBW(matrix, canvas) {
  let ctx = canvas.getContext('2d');
  
  let w = canvas.width / matrix[0].length;
  let h = canvas.height / matrix.length;
  
  console.log(w, h)
  
  for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix[i].length; j++) {
      ctx.fillStyle = matrix[i][j] ? 'black' : 'white';
      ctx.strokeStyle = matrix[i][j] ? 'white' : 'black';
      ctx.lineWidth = 0.5;
      
      ctx.beginPath()
      ctx.rect(j * w, i * h, w, h);
      ctx.fill();
      ctx.stroke()
    }
  }
}
 

// Draw canvas and append it to document.body
function createCanvas(width, height) {
  let can = document.createElement('canvas');
  can.width = width;
  can.height = height;
  can.style.width = width + 'px';
  can.style.height = height + 'px';
  can.style.border = '1px solid #ccc';
  document.body.appendChild(can);
  return can;
}

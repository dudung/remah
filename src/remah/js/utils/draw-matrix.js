/*
  draw-matrix.js
  Draw matrix on canvas
  v0.0.1 - 20240713

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240713 Start this utility.
  - Choose kebab-case over snake_case, camelCase of PascalCase.
  - Create drawMatrixBW() for black and white matrix drawing on canvas.
  - It would be better if the line width can be thinner.
*/


// Draw matrix on canvas with black and white colors
function drawMatrixBW(matrix, canvas) {
  let ctx = canvas.getContext('2d');
  
  let w = canvas.width / matrix[0].length;
  let h = canvas.height / matrix.length;
  
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

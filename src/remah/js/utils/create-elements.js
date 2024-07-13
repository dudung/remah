/*
  create-elements.js
  Create and append elements
  v0.0.1 - 20240713

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240713 Start this utility.
  - Create createCanvas() for drawMatrixBW() in draw-matrix.js.
*/


// Create canvas and append it to document.body
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

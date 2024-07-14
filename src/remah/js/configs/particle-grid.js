/*
  particle-grid.js
  Config file for particles position on grid
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Begin this config.
  - Design particles position on grid in configParticlesPosition(),
  - Convert particles position to positions matrix.
*/


// Convert particle position cofiguration to positions matrix.
function positionMatrixFromConfig(text, rows, cols) {
  let m = createZeroMatrix(rows, cols);
  
  let lines = text.split('\n');
  if(lines[lines.length - 1] == '') lines.pop();
  
  let positions = [];
  for(let l of lines) {
    let p1 = l.split(',');
    let x = parseInt(p1[0]);
    let y = parseInt(p1[1]);
    let p2 = [x, y];
    positions.push(p2);
  }
  
  for(let p of positions) {
    let i = p[0];
    let j = p[1];
    let colInRange = 0 <= i && i < m.length;
    let rowInRange = 0 <= j && j < m[0].length;
    if(rowInRange && colInRange) {
      m[i][j] = 1;
    }
  }
  
  return m;
}


// Create config for particles position on grid.
function configParticlesPosition() {
  let text = ""
  + "0,0\n"
  + "4,0\n"
  + "2,2\n"
  + "0,4\n"
  + "4,4\n"
  + "";
  
  return text;
}


// Create zero matrix.
function createZeroMatrix(rows, cols) {
  let m = [];
  for(let i = 0; i < rows; i++) {
    let row = []
    for(let j = 0; j < cols; j++) {
      row.push(0);
    }
    m.push(row);
  }
  
  return m;
}
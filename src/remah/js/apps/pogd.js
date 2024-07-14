/*
  pogd.js
  Particles on grid display
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Create simple app name pogd.
  - ..
*/


// Execute main function.
main();


// Define main function.
function main() {
  let config = configParticlesPosition();
  let ta = createTextarea(100, 200, config);
  
  let btn = createButton('Display', () => {
    displayParticleOnGrid(ta.value, can)
  });
  
  let can = createCanvas(200, 200);
}


// Define function to handle button click.
function displayParticleOnGrid(text, can) {
  let mat = positionMatrixFromConfig(text, 5, 5);
  drawMatrixBW(mat, can);
}
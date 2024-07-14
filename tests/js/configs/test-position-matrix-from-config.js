/*
  test-position-matrix-from-config.js
  Test convert config to position matrix
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Start this test.
  - Create zero matrix for position and convert config to it.
*/


// Execute main function.
testPositionMatrixFromConfig();


// Define main function.
function testPositionMatrixFromConfig() {
  let c = configParticlesPosition();
  let m = positionMatrixFromConfig(c, 4, 6);
  console.log(m);
}

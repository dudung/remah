/*
  pogd-sad-ui.js
  Particles on grid display with sad ui
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Create simple app named pogd.
  - Create simple app with three elements and an ui layout.
*/


// Define main function.
function pogdSadUi() {
  let e = createUI();
  e.ta.value = configParticlesPosition();
  e.btn.innerHTML = 'Display';
  e.btn.addEventListener('click', () => {
    let mat = positionMatrixFromConfig(e.ta.value, 10, 10);
    drawMatrixBW(mat, e.can);
  });
}

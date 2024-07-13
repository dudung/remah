/*
  test-animate-moving-button.js
  Test create and animate moving button
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Start this test.
  - Create multiple moving button elements and move them.
*/


// Execute main function.
testCreateMovingButton();


// Define main function.
function testCreateMovingButton() {
  createMovingButton('Start', 'Stop', button1Click);
  createMovingButton('Move', 'Stay', button2Click);
  createMovingButton('Moving', 'Still', button3Click);
  createMovingButton('On', 'Off', button4Click);
}


// Callback function for button 1
function button1Click(state) {
  console.log('button 1 state is', state);
}


// Callback function for button 2
function button2Click(state) {
  console.log('button 2 state is', state);
}


// Callback function for button 3
function button3Click(state) {
  console.log('button 3 state is', state);
}


// Callback function for button 4
function button4Click(state) {
  console.log('button 4 state is', state);
}

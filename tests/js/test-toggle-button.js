/*
  test-toggle-button.js
  Test create and append toggle button
  v0.0.1 - 20240713

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240713 Start this test.
  - Create multiple toggle button elements and show them.
*/


// Execute main function.
testCreateStartStopButton();


// Define main function.
function testCreateStartStopButton() {
  createToggleButton('Start', 'Stop', buttonClick);
  createToggleButton('Begin', 'End', buttonClick);
  createToggleButton('On', 'Off', buttonClick);
  createToggleButton('1', '0', buttonClick);
}


// Define the callback function
function buttonClick(state) {
  console.log("Status is ", state);
}
/*
  test-create-button.js
  Test create and append button
  v0.0.1 - 20240713

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Start this test.
  - Create multiple button elements and show them.
*/


// Execute main function.
testCreateButton();


// Define main function.
function testCreateButton() {
  createButton('Click', buttonClick1);
  createButton('Push', buttonClick2);
}


// Define the callback function for button1.
function buttonClick1() {
  console.log("button 1 is cliked");
}


// Define the callback function for button2.
function buttonClick2() {
  console.log("button 2 is cliked");
}
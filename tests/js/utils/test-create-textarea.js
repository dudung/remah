/*
  test-create-textarea.js
  Test create and append textarea with text
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Start this test.
  - Create multiple textarea elements with text and show them.
*/


// Execute main function.
testCreateTextarea();


// Define main function.
function testCreateTextarea() {
  createTextarea(50, 160, "ABCDEFGHIJKLMNOPQRSTUVWXYZ\n\n1234567890");
  let text = "" +
  "This is first line\n" +
  "Second line\n" +
  "Third line is this\n" +
  "A line\n" +
  "Another line\n" +
  "Last line.\n" +
  "";
  createTextarea(200, 200, text);
  createTextarea(100, 100, "Hello, world!\nMy name is also World!");
}

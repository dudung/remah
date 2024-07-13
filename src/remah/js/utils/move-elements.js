/*
  move-elements.js
  Create, append, and move elements
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Start this utility.
  - Create the use of setInternal() and stopInterval() for moving button.
*/


function createMovingButton(defaultCaption, otherCaption, callback) {
  let id = null;
  let btn = createToggleButton(defaultCaption, otherCaption, buttonClick);
  
  // Set style
  btn.style.position = 'relative';
  btn.style.display = 'block';
  
  return btn;  
  
  // Handle click event
  function buttonClick(state) {
    if(state == 1) {
      id = setInterval(moveButton, 1000);
      callback(1);
    } else {
      clearInterval(id);
      callback(0);
    }
  }
  
  // Move and stop button using setInterval() and clearInterval()
  function moveButton() {
    let left = btn.style.left;
    if(left == '') {
      left = 0;
    } else {
      left = parseInt(left);
    }
    left = left + 10;
    btn.style.left = left + 'px';
  }
}

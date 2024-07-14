/*
  layout-sad.js
  Layout for sad
  v0.0.1 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Begin this layout.
  - Copy from appss/sad.js to this layout-sad.js for more use.
*/


// Create ui and return the interactive elements, initially for sad.
function createUI() {
  let appDiv = document.createElement('div');
  with(appDiv.style) {
    border = '1px solid #eee';
    width = '400px';
    height = '302px';
    background = '#fff';
  }
  
  let can = document.createElement('canvas');
  with(can) {
    width = '300';
    height= '300';
    with(style) {
      width = '300px';
      height= '300px';
      background = 'white';
      float = 'left'
      border = '1px solid #888';
    }
  }
  
  let ta = document.createElement('textarea');
  with(ta.style) {
    width = '91px';
    height = '274px';
    overflowY = 'scroll';
    marginLeft = '1px';
    marginBottom = '-3px';
    fontSize = '10px';
  }
  
  let btn = document.createElement('button');
  btn.innerHTML = 'Start';
  with(btn.style) {
    width = '97px';
    marginLeft = '1px';
  }
    
  document.body.appendChild(appDiv);
    appDiv.appendChild(can);
    appDiv.appendChild(ta);
    appDiv.appendChild(btn);
  
  let elems = {
    can: can,
    ta: ta,
    btn: btn,
  }
  
  return elems;
}

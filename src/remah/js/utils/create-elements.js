/*
  create-elements.js
  Create and append elements
  v0.0.4 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Show texts in textarea.
  - Create createTextarea() and fill it with text.
  - Create simple button with callback function.
  
  20240713 Start this utility.
  - Create createCanvas() for drawMatrixBW() in draw-matrix.js.
  - Create simple toggle button from button element, width not fixed.
*/


// Create button with callback function
function createButton(caption, callback) {
  let btn = document.createElement('button');
  btn.innerHTML = caption;
  
  btn.addEventListener('click', callback);
  
  document.body.appendChild(btn);
  return btn;
}



// Create textarea
function createTextarea(width, height, text) {
  let ta = document.createElement('textarea');
  ta.value = text;
  ta.style.width = width + 'px';
  ta.style.height = height + 'px';
  ta.style.overflowY = 'scroll';
  document.body.append(ta);
  return(ta);
}


// Create button as toggle button.
function createToggleButton(defaultCaption, otherCaption, callback) {
  let btn = document.createElement('button');
  btn.innerHTML = defaultCaption;
  
  btn.addEventListener('click', (e) => {
    if(e.target.innerHTML == defaultCaption) {
      e.target.innerHTML = otherCaption;
      callback(1);
    } else {
      e.target.innerHTML = defaultCaption;
      callback(0); 
    }
  });
  
  document.body.appendChild(btn);
  return btn;
}


// Create canvas and append it to document.body.
function createCanvas(width, height) {
  let can = document.createElement('canvas');
  can.width = width;
  can.height = height;
  can.style.width = width + 'px';
  can.style.height = height + 'px';
  can.style.border = '1px solid #ccc';
  document.body.appendChild(can);
  return can;
}

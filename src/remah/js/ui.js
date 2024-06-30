/*
  ui.js
  Elements for user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start creating the UI with style 0.
*/


// Call main function
main();


// Define main function
function main() {
  uiStyle0();
}


// Create UI with style 0
function uiStyle0() {
  var outterDiv = document.createElement('div');
  with(outterDiv.style) {
    border = '1px solid #aaa';
    height = '200px';
    width = '400px';
  }

  var leftDiv = document.createElement('div');
  with(leftDiv.style) {
    border = '0px solid black';
    background = '#eee';
    width = '180px';
    height = '200px';
  }
  
  var inputArea = document.createElement('textarea');
  with(inputArea.style) {
    width = '172px';
    height = '164px';
    overflowY = 'scroll';
  }
  inputArea.name = "Input";
  
  var bClear = document.createElement('button');
  bClear.innerHTML = 'Clear';
  with(bClear.style) {
    width = '25%';
  }
  bClear.name = "Clear";

  var bLoad = document.createElement('button');
  bLoad.innerHTML = 'Load';
  with(bLoad.style) {
    width = '25%';
  }
  bLoad.name = "Load";

  var bRead = document.createElement('button');
  bRead.innerHTML = 'Read';
  with(bRead.style) {
    width = '25%';
  }
  bRead.name = "Read";

  var bStart = document.createElement('button');
  bStart.innerHTML = 'Start';
  with(bStart.style) {
    width = '25%';
  }
  bStart.name = "Start";
  
  
  outterDiv.appendChild(leftDiv);
    leftDiv.appendChild(inputArea);
    leftDiv.appendChild(bClear);
    leftDiv.appendChild(bLoad);
    leftDiv.appendChild(bRead);
    leftDiv.appendChild(bStart);
  
  document.body.appendChild(outterDiv);
}

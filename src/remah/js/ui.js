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
    border = '0px solid #aaa';
    width = '402px';
    height = '390px';
    background = 'none';
  }

  var leftDiv = document.createElement('div');
  with(leftDiv.style) {
    border = '0px solid black';
    background = 'none';
    width = '200px';
    height = '204px';
    float = 'left';
  }
  
  var inputArea = document.createElement('textarea');
  with(inputArea.style) {
    width = '193px';
    height = '151px';
    overflowY = 'scroll';
  }
  inputArea.name = "Input";
  
  var model = document.createElement('select');
  with(model.style) {
    width = "199px";
  }
  model.name = "Model";
  
  var options = [
    'Model &ndash; system',
    'MC &ndash; random motion',
    'DEM &ndash; bouncing disc',
  ];
  for(const [i, v] of options.entries()) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = v;
    model.add(opt);
  }    
  
  var bClear = document.createElement('button');
  bClear.innerHTML = 'Clear';
  with(bClear.style) {
    width = '50px';
  }
  bClear.name = "Clear";
  bClear.disabled = true;

  var bLoad = document.createElement('button');
  bLoad.innerHTML = 'Load';
  with(bLoad.style) {
    width = '50px';
  }
  bLoad.name = "Load";
  bLoad.disabled = true;

  var bRead = document.createElement('button');
  bRead.innerHTML = 'Read';
  with(bRead.style) {
    width = '50px';
  }
  bRead.name = "Read";
  bRead.disabled = true;

  var bStart = document.createElement('button');
  bStart.innerHTML = 'Start';
  with(bStart.style) {
    width = '49px';
  }
  bStart.name = "Start";
  bStart.disabled = true;
  
  var can = document.createElement('canvas');
  with(can.style) {
    border = '1px solid #888';
    background = '#fff';
    width = '200px';
    height = '200px';
    float = 'left';
  }
  
  var outputArea = document.createElement('textarea');
  with(outputArea.style) {
    width = '396px';
    height = '182px';
    overflowY = 'scroll';
    border = '1px solid #888';
  }
  outputArea.disabled = true;
  outputArea.name = "Oputput";
  
  outterDiv.appendChild(leftDiv);
    leftDiv.appendChild(inputArea);
    leftDiv.appendChild(model);
    leftDiv.appendChild(bClear);
    leftDiv.appendChild(bLoad);
    leftDiv.appendChild(bRead);
    leftDiv.appendChild(bStart);
  
  outterDiv.appendChild(can);
  outterDiv.appendChild(outputArea);
  
  document.body.appendChild(outterDiv);
}

/*
  ui.js
  Elements for user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start creating the UI with style 0.
*/


// Create UI with style 0
function uiStyle0() {
  var elList = [];
  
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
    height = '203px';
    float = 'left';
  }
  
  var model = document.createElement('select');
  with(model.style) {
    width = '199px';
  }
  model.name = 'sel-Model';
  elList.push(model.name);
  
  var options = [
    "Model &ndash; system",
    "MC &ndash; random motion",
    "DEM &ndash; bouncing disc",
  ];
  for(const [i, v] of options.entries()) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = v;
    model.add(opt);
  }
  
  var inputArea = document.createElement('textarea');
  with(inputArea.style) {
    width = '193px';
    height = '155px';
    overflowY = 'scroll';
    border = '1px solid #888';
  }
  inputArea.name = 'txa-Input';
  inputArea.disabled = true;
  elList.push(inputArea.name);
  
  var bClear = document.createElement('button');
  bClear.innerHTML = 'Clear';
  with(bClear.style) {
    width = '50px';
  }
  bClear.name = 'btn-Clear';
  bClear.disabled = true;
  elList.push(bClear.name);

  var bLoad = document.createElement('button');
  bLoad.innerHTML = 'Load';
  with(bLoad.style) {
    width = '50px';
  }
  bLoad.name = 'btn-Load';
  bLoad.disabled = true;
  elList.push(bLoad.name);

  var bRead = document.createElement('button');
  bRead.innerHTML = 'Read';
  with(bRead.style) {
    width = '50px';
  }
  bRead.name = 'btn-Read';
  bRead.disabled = true;
  elList.push(bRead.name);

  var bStart = document.createElement('button');
  bStart.innerHTML = 'Start';
  with(bStart.style) {
    width = '49px';
  }
  bStart.name = 'btn-Start';
  bStart.disabled = true;
  elList.push(bStart.name);
  
  var can = document.createElement('canvas');
  with(can.style) {
    border = '1px solid #888';
    background = '#fff';
    width = '200px';
    height = '200px';
    float = 'left';
  }
  can.name = 'can-Canvas';
  elList.push(can.name);
  
  var outputArea = document.createElement('textarea');
  with(outputArea.style) {
    width = '396px';
    height = '182px';
    overflowY = 'scroll';
    border = '1px solid #888';
  }
  outputArea.disabled = true;
  outputArea.name = 'txa-Output';
  elList.push(outputArea.name);
  
  outterDiv.appendChild(leftDiv);
    leftDiv.appendChild(model);
    leftDiv.appendChild(bClear);
    leftDiv.appendChild(bLoad);
    leftDiv.appendChild(bRead);
    leftDiv.appendChild(bStart);
    leftDiv.appendChild(inputArea);
  
  outterDiv.appendChild(can);
  outterDiv.appendChild(outputArea);
  
  document.body.appendChild(outterDiv);
  
  return elList;
}

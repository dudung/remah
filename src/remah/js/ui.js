/*
  ui.js
  Elements for user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Creating UI with style 0, elements layout and initial state.
*/


// Create UI with style 0
function uiStyle0() {
  var elIdList = [];
  
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
  model.id = 'sel_Model';
  elIdList.push(model.id);
  
  var options = [
    "Model &ndash; system",
    "None &ndash; static shapes",
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
    fontSize = '12px';
  }
  inputArea.id = 'txa_Input';
  inputArea.disabled = true;
  elIdList.push(inputArea.id);
  
  var bLoad = document.createElement('button');
  bLoad.innerHTML = 'Load';
  with(bLoad.style) {
    width = '50px';
  }
  bLoad.id = 'btn_Load';
  bLoad.disabled = true;
  elIdList.push(bLoad.id);

  var bRead = document.createElement('button');
  bRead.innerHTML = 'Read';
  with(bRead.style) {
    width = '50px';
  }
  bRead.id = 'btn_Read';
  bRead.disabled = true;
  elIdList.push(bRead.id);

  var bStart = document.createElement('button');
  bStart.innerHTML = 'Start';
  with(bStart.style) {
    width = '49px';
  }
  bStart.id = 'btn_Start';
  bStart.disabled = true;
  elIdList.push(bStart.id);
  
  var bAbout = document.createElement('button');
  bAbout.innerHTML = 'About';
  with(bAbout.style) {
    width = '50px';
  }
  bAbout.id = 'btn_About';
  elIdList.push(bAbout.id);
  
  var can = document.createElement('canvas');
  with(can.style) {
    border = '1px solid #888';
    background = '#fff';
    width = '200px';
    height = '200px';
    float = 'left';
  }
  can.width = '200';
  can.height = '200';
  can.id = 'can_Canvas';
  elIdList.push(can.id);
  
  var outputArea = document.createElement('textarea');
  with(outputArea.style) {
    width = '396px';
    height = '182px';
    overflowY = 'scroll';
    border = '1px solid #888';
  }
  outputArea.disabled = true;
  outputArea.id = 'txa_Output';
  elIdList.push(outputArea.id);
  
  outterDiv.appendChild(leftDiv);
    leftDiv.appendChild(model);
    leftDiv.appendChild(bLoad);
    leftDiv.appendChild(bRead);
    leftDiv.appendChild(bStart);
    leftDiv.appendChild(bAbout);
    leftDiv.appendChild(inputArea);
  
  outterDiv.appendChild(can);
  outterDiv.appendChild(outputArea);
  
  document.body.appendChild(outterDiv);
  
  return elIdList;
}

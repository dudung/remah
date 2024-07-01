/*
  mma_cancel.js
  Mixed Modeling Approaches
  v0.0.1 - 20240630

  Sparisoma Viridi | https://github.com/dudung
  
  20240702
  - Merge main.js, ui.js, event.js, greetings.js to this file.
  - Cancel this app, but keep it as documentation only.
*/


/*
  main.js
  Some tests for functions and methods
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Test UI style 0 and initial events.
*/

// Call main function
main();


// Define main function
function main() {
  var elementList = uiStyle0();
  setEventsForElementsWithId(elementList);
}


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


/*
  events.js
  Events between elements in user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start designing the events for UI with style 0.
*/


// Set events between elements
function setEventsForElementsWithId(list) {
  let sysId = 0;
  let el = {};
  let shapes = [];
  for(const [i, val] of list.entries()) {
    el[val] = window[list[i]];
  }
  
  el['sel_Model'].addEventListener('change',
    (e) => {
      sysId = e.target.selectedIndex;
      if(sysId > 0) {
        el['btn_Load'].disabled = false;
      } else {
        el['btn_Load'].disabled = true;
        el['btn_Read'].disabled = true;
        el['btn_Start'].disabled = true;
        el['txa_Input'].disabled = true;
      }
    }
  );
  
  el['btn_Load'].addEventListener('click',
    (e) => {
      let text = loadConfiguration(sysId);
      el['txa_Input'].value = text;
      el['btn_Read'].disabled = false;
      el['txa_Input'].disabled = false;
    }
  );
  
  el['btn_Read'].addEventListener('click',
    (e) => {
      el['btn_Start'].disabled = false;
      if(sysId == 1) {
        let src = el['txa_Input'].value;
        let dest = el['can_Canvas'].getContext('2d');
        drawShapes(src, dest);
      }
    }
  );
  
  el['btn_Start'].addEventListener('click',
    (e) => {
      let caption = e.target.innerHTML;
      
      if(caption == 'Start') {
        el['btn_Load'].disabled = true;
        el['btn_Read'].disabled = true;
        el['btn_About'].disabled = true;
        el['sel_Model'].disabled = true;
        el['txa_Input'].disabled = true;
        e.target.innerHTML = 'Stop';
      } else {
        el['btn_Load'].disabled = false;
        el['btn_Read'].disabled = false;
        el['btn_About'].disabled = false;
        el['sel_Model'].disabled = false;
        el['txa_Input'].disabled = false;
        e.target.innerHTML = 'Start';
      }
    }
  );
  
  el['btn_About'].addEventListener('click',
  (e) => {
      alert(
        "Remah 0.0.5\n" +
        "Mixed Modeling Approaches\n" +
        "https://github.com/dudung/remah\n" +
        "\n" +
        "MIT License\n" + 
        "Copyright (c) 2024 Sparisoma Viridi"
      );
    }
  );
}


function loadConfiguration(sysId) {
  let configText = [
  "",
  "circle 50,40,20\n"+
  "rect 150,40,-60,20\n"+
  "ellipse 50,40,20\n"+
  "line 40,120,30,50\n"
  ];
  return configText[sysId];
}

function drawShapes(src, dest) {
  let lines = src.split('\n');
  let n = lines.length;
  if(lines[n-1].length == 0);
  lines.pop();
  for(const l of lines) {
    let s = l.split(' ');
    if(s[0] == 'circle') {
      [cx, cy, r] = s[1].split(',');
      dest.beginPath();
      dest.arc(cx, cy, r, 0, 2*Math.PI);
      dest.stroke();
    }
  }    
}


/*
  greetings.js
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240629 Create this for testing, but confused.
*/


// Say hello to text
function sayHello(text) {
  return 'Hello, ' + text + '!';
}


// Test say hello
function test_sayHello() {
  console.log(sayHello("Remah"));
}

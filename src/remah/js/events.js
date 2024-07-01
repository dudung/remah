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
/*
  sad.js
  Stochastic Agent Dynamics
  v0.0.1 - 20240701

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240702 Continue developing the app.
  
  20240701 Restart first app on Remah.
  - Discuss the idea with GPT-4o and accept the suggested name [1].
  - Try to make it as simple as possbile with least number of elements.
  - Limit all variables as local, at least inside main function.
  - Elements are div, canvas, textarea, button.
  
  # Refs
  [1] url https://chatgpt.com/share/f158337d-278f-4084-bd61-d5db3429f509 [20240701]
*/


// Execute main function.
main();


// Define main function.
function main() {
  const el = createUI()
  loadDefaultParamsTo(el.ta);
  
  el.btn.addEventListener('click',
    (e) => {
      //let params = getParamsFromText(label, el.ta.value);
    }
  );
}


// Load default parameters to textarea as input element.
function loadDefaultParamsTo(ta) {
  var text = ""
  text += "60\n"
  text += ".10 .10 .10\n"
  text += ".10 .00 .10\n"
  text += ".10 .10 .10\n"
  text += "\n"
  text += "20\n"
  text += ".05 .05 .05\n"
  text += ".10 .05 .10\n"
  text += ".10 .20 .10\n"
  text += "\n"
  text += "20\n"
  text += ".10 .20 .10\n"
  text += ".10 .05 .10\n"
  text += ".05 .05 .05\n"
  ta.value = text;
}

// Create ui and return the interactive elements.
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
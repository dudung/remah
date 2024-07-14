/*
  sad.js
  Stochastic Agent Dynamics
  v0.0.3 - 20240714

  Sparisoma Viridi | https://github.com/dudung
  
  # Notes
  20240714 Move layout.
  - Move createUI() to layouts/layout-sad.js for more use.
  
  20240713 Try to continue the app after scattered activities.
  - Dig previous forgotten idea about the app.
  - Remove \n in last blocks obtained from textarea.
  
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
      if(e.target.innerHTML == 'Start') {
        e.target.innerHTML = 'Stop';
        
        let params = getParamsFrom(el.ta);
        simulate(params, el.can);
      } else {
        e.target.innerHTML = 'Start';
      }
    }
  );
}


// Perform simulation.
function simulate(params, can) {
}


// Get parameters from textarea.
function getParamsFrom(ta) {
  // Obtain the blocks from textarea.
  let text = ta.value;
  let blocks = text.split('\n\n');
  
  // Remove \n on the last block.
  let last = blocks.pop();
  if(last[last.length - 1] == '\n') {
    last = last.slice(0, -1);
    console.log('d');
  }
  blocks.push(last);
}


// Load default parameters to textarea as input element.
function loadDefaultParamsTo(ta) {
  var text = ""
  text += "INFO\n"
  text += "WORLD 100 100\n"
  text += "TYPES 3\n"
  text += "\n"
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

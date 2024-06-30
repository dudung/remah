/*
  events.js
  Events between elements in user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start designing the events for UI with style 0.
*/


//
let el = {};


// Set events between elements
function setEventsForElementsWithId(list) {
  for(const [i, val] of list.entries()) {
    el[val] = window[list[i]];
  }
  
  el['sel_Model'].addEventListener('change', (e) => {selChange(e)});
}


function selChange(e) {
  if(e.target.selectedIndex > 0) {
    el['btn_Load'].disabled = false;
  }
}
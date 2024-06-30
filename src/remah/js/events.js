/*
  events.js
  Events between elements in user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start designing the events for UI with style 0.
*/


// Set events between elements
function setEventsForElementsWithId(list) {
  let el = {};
  for(const [i, val] of list.entries()) {
    el[val] = window[list[i]];
  }
  console.log(list);
  console.log(els);
  
  els['sel_Model'].selectedIndex = 3;
}

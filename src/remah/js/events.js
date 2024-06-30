/*
  events.js
  Events between elements in user interface
  
  Sparisoma Viridi | https://github.com/dudung
  
  20240630 Start designing the events for UI with style 0.
*/




// Set events between elements
function setEventsForElementsWithId(list) {
  getElementsById(list);
}


// Create elements according its name pattern
function getElementsById(list) {
  for(const e of list) {
    let tag = e;
    console.log(tag);
  }
}


// Create abbreviation for elements tag
const elemDict = {
  'btn': 'button',
  'can': 'canvas',
  'sel': 'select',
  'txa': 'textarea',
}

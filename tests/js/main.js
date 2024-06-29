function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function scriptLoaded(name) {
  console.log(name + ' loaded successfully.');
}

let url = '';

url = '../../src/remah/js/greetings.js';
loadScript(url, function() {
  scriptLoaded(url)
  url = 'test_greetings.js';
  loadScript(url, function() {
    scriptLoaded(url);
    console.log(sayHello('World'));
  });
});


//url = 'test_greetings.js';
//loadScript(url, function() {scriptLoaded(url)});
//sayHello('World');
/*
	windpend.js
	Random wind blows a simple pendulum
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20191113
	1253 Derive this from cppcmf.js for KU1102-05.
	1445 Can animate but not yet right.
	20191211
	0853 Relayout.
	0939 Fin editing and transfer from abmdif.js app.
	
	References
	1. .
		 url
*/

// Define global variables
var params;
var taIn, taOut, caOut, caOut2;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var o, gravitational, spring, drag, vwind;
var data, colors;

// Execute main function
main();


// Define main function
function main() {
	initParams();
	createVisualElements();
}


// Initialize parameters
function initParams() {
	var p = "";
	p += "# Environment\n";
	p += "GFLD 0 -10 0\n";
	p += "SLEN 1\n";
	p += "ETAF 0.2\n"; // 18.5E-6 Pa.s
	p += "\n";
	p += "# Particle\n";
	p += "MASS 1\n";
	p += "DIAM 0.2\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0\n";
	p += "TEND 80\n";
	p += "TSTP 0.01\n";
	p += "TDAT 0.1\n";
	p += "TPRC 1\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -1 -2 -1\n";
	p += "RMAX +1 +0 +1\n";
	
	params = p;
	
	digit = 4;
	
	colors = [
		["#fff", "#fff"],
		["#000", "#000"],
		["#aaf", "#00f"],
		["#faa", "#f00"],
		["#afa", "#0f0"]
	];
}


// Load parameters
function loadParams() {
	clearText(taIn);
	addText(params).to(taIn);
}


// Read parameters
function readParams() {
var g = getValue("GFLD").from(taIn);
var l =  getValue("SLEN").from(taIn);
var eta = getValue("ETAF").from(taIn);

var m = getValue("MASS").from(taIn);
var D = getValue("DIAM").from(taIn);

tbeg = getValue("TBEG").from(taIn);
tend = getValue("TEND").from(taIn);
dt = getValue("TSTP").from(taIn);
Tdata = getValue("TDAT").from(taIn);
Tproc = getValue("TPRC").from(taIn);

var rmin = getValue("RMIN").from(taIn);
var rmax = getValue("RMAX").from(taIn);

corv = getValue("CORV").from(taIn);

iter = 0;
Niter = Math.floor(Tdata / dt);

xmin = rmin.x;
ymin = rmin.y;
zmin = rmin.z;
xmax = rmax.x;
ymax = rmax.y;
zmax = rmax.z;

t = tbeg;

o = new Grain();
o.m = m;
o.D = D;
o.r = new Vect3(0.707, -0.707, 0);
o.c = "#000";

gravitational = new Gravitational();
gravitational.setField(g);

spring = new Spring();
spring.setConstants(10000, 0);
spring.setUncompressedLength(l);
spring.setOrigin(new Vect3);

drag = new Drag();
drag.setField(new Vect3);
drag.setConstants(0, eta, 0);

XMIN = 0;
XMAX = caOut.width;
YMIN = caOut.height;
YMAX = 0;
ZMIN = -1;
ZMAX = 1;

vwind = 0;

var dthmin = -1.25;
var dthmax = 0.25;
var dth = [];
var dwvmin = -1;
var dwvmax = 3;
var dwv = [];
data = [[dthmin, dthmax, dth], [dwvmin, dwvmax, dwv]];
}


// Create visual elements
function createVisualElements() {
	// Create textarea for input
	taIn = document.createElement("textarea");
	with(taIn.style) {
		overflowY = "scroll";
		width = "214px";
		height = "200px";
	}
	
	// Create textarea for output
	taOut = document.createElement("textarea");
	with(taOut.style) {
		overflowY = "scroll";
		width = "214px";
		height = "200px";
	}
	
	// Create button for loading default parameters
	btLoad = document.createElement("button");
	with(btLoad) {
		innerHTML = "Load";
		id = "Load";
		style.width = "55px";
		disabled = false;
		addEventListener("click", buttonClick);
	}

	// Create button for reading shown parameters
	btRead = document.createElement("button");
	with(btRead) {
		innerHTML = "Read";
		id = "Read";
		style.width = "55px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for starting simulation
	btStart = document.createElement("button");
	with(btStart) {
		innerHTML = "Start";
		id = "Start";
		style.width = "55px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for giving information
	btInfo = document.createElement("button");
	with(btInfo) {
		innerHTML = "Info";
		id = "Info";
		style.width = "55px";
		disabled = false;
		addEventListener("click", buttonClick);
	}
	
	// Create canvas for output -- text
	caOut = document.createElement("canvas");
	caOut.width = "204";
	caOut.height = "204";
	with(caOut.style) {
		width = caOut.width + "px";
		height = caOut.height + "px";
		border = "1px solid #aaa";
		background = "#fff";
	}

	// Create canvas for output -- graphics
	caOut2 = document.createElement("canvas");
	caOut2.width = "204";
	caOut2.height = "229";
	with(caOut2.style) {
		width = caOut2.width + "px";
		height = caOut2.height + "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	
	// Create div for left part
	var dvLeft = document.createElement("div");
	with(dvLeft.style) {
		width = "220px";
		height = "442px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Create div for right part
	var dvRight = document.createElement("div");
	with(dvRight.style) {
		width = "206px";
		height = "442px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Append element in structured order
	document.body.append(dvLeft);
		dvLeft.append(taIn);
		dvLeft.append(taOut);
		dvLeft.append(btLoad);
		dvLeft.append(btRead);
		dvLeft.append(btStart);
		dvLeft.append(btInfo);
	document.body.append(dvRight);
		dvRight.append(caOut);
		dvRight.append(caOut2);
}


// Handle event of button click
function buttonClick() {
	var id = event.target.id;
	switch(id) {
	case "Load":
		btRead.disabled = false;
		loadParams();
	break;
	case "Read":
		btStart.disabled = false;
		readParams();
	break;
	case "Start":
		if(btStart.innerHTML == "Start") {
			btLoad.disabled = true;
			btRead.disabled = true;
			btInfo.disabled = true;
			btStart.innerHTML = "Stop";
			proc = setInterval(simulate, Tproc);
		} else {
			btLoad.disabled = false;
			btRead.disabled = false;
			btInfo.disabled = false;
			btStart.innerHTML = "Start";
			clearInterval(proc);
		}
	break;
	case "Info":
		var info = "";
		info += "windpend.js\n";
		info += "Wind blows a simple pendulum\n";
		info += "Sparisoma Viridi\n";
		info += "https://github.com/dudung/butiran.js\n"
		info += "Load  load parameters\n";
		info += "Read  read parameters\n";
		info += "Start start simulation\n";
		info += "Info  show this messages\n";
		info += "\n";
		addText(info).to(taOut);
	break;
	default:
	}
}


// Perform simulation
function simulate() {
	if(iter >= Niter) {
		iter = 0;
	}
	
	if(t == tbeg) {
		addText("#t\ttheta\tv\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = ("00" + t.toFixed(1)).slice(-5);
		var x = o.r.x;
		var y = o.r.y;
		var theta = Math.atan(x/-y);
		var qq = theta.toFixed(digit);
		var vv = vwind.toFixed(2);
		var text = tt + "\t" + qq + "\t" + vv;
		addText(text + "\n").to(taOut);
		
		data[0][2].push(parseFloat(qq));
		if(data[0][2].length > 400) data[0][2].splice(0, 1);

		data[1][2].push(parseFloat(vv));
		if(data[1][2].length > 400) data[1][2].splice(0, 1);
		
		vwind = 0.02 * (Random.randInt(0, 100) - 50);
		drag.setField(new Vect3(vwind, 0, 0));
	}
	
	var F = new Vect3;
	
	var FG = gravitational.force(o);
	F = Vect3.add(F, FG);
	
	var FD = drag.force(o);
	F = Vect3.add(F, FD);
	
	var FS = spring.force(o);
	F = Vect3.add(F, FS);
	
	var a = Vect3.div(F, o.m);
	o.v = Vect3.add(o.v, Vect3.mul(a, dt));
	o.r = Vect3.add(o.r, Vect3.mul(o.v, dt));

	clearCanvas(caOut);
	draw(o).onCanvas(caOut);
	
	clearCanvas(caOut2);
	drawSeriesOnCanvas(data, caOut2);
	
	if(t >= tend) {
		btLoad.disabled = false;
		btRead.disabled = false;
		btStart.disabled = true;
		btInfo.disabled = false;
		btStart.innerHTML = "Start";
		clearInterval(proc);
		addText("\n").to(taOut);
	}
	
	iter++;
	t += dt;
}

// Draw graph of data on canvas
function drawSeriesOnCanvas() {
	var series = arguments[0];
	var Nseries = series.length;
	
	var can = arguments[1];
	var width = can.width;
	var height = can.height;
	var cx = can.getContext("2d");
	
	//var h = height / Nseries;
	var h = height;
	var XMIN = 0;
	var XMAX = width;
	var YMIN = height;
	var YMAX = 0;
	
	var xmin = 0;
	var xmax = 400;
	var ymax = 1;
	var ymin = 0;
	
	var margin = 10;
	
	for(var s = 0; s < Nseries; s++) {
		//YMAX = s * h + margin;
		YMAX = margin;
		YMIN = YMAX + h - margin;
		ymin = series[s][0];
		ymax = series[s][1];
		var N = series[s][2].length;
		cx.beginPath();
		cx.strokeStyle = colors[s + 2][1];
		cx.lineWidth = 2;
		for(var i = 0; i < N; i++) {
			var x = i;
			var y = series[s][2][i] / 2;
			var p = transform(x, y);
			if(i == 0) {
				cx.moveTo(p[0], p[1]);
			} else {
				cx.lineTo(p[0], p[1]);
			}
		}
			console.log(N);
		cx.stroke();
		cx.closePath();
	}
	
	function transform(x, y) {
		var XX = (x - xmin) / (xmax - xmin) * (XMAX - XMIN)
		XX += XMIN;
		var YY = (y - ymin) / (ymax - ymin) * (YMAX - YMIN)
		YY += YMIN;
		return [XX, YY];
	}
}


// Clear canvas
function clearCanvas(caOut) {
	var width = caOut.width;
	var height = caOut.height;
	var cx = caOut.getContext("2d");
	cx.clearRect(0, 0, width, height);
}


// Draw grain on canvas
function draw() {
	var o = arguments[0];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			
			var x = o.r.x;
			var dx = x + o.D;
			var y = o.r.y;
			
			var lintrans = Transformation.linearTransform;
			var X = lintrans(x, [xmin, xmax], [XMIN, XMAX]);
			var DX = lintrans(dx, [xmin, xmax], [XMIN, XMAX]);
			var D = DX - X;
			var Y = lintrans(y, [ymin, ymax], [YMIN, YMAX]);
			
			cx.beginPath();
			cx.strokeStyle = o.c;
			cx.arc(X, Y, D, 0, 2 * Math.PI);
			cx.stroke();
			
			cx.fillStyle = o.c;
			cx.fill();
		}
	};
	return result;
}


// Clear a Textarea
function clearText() {
	var ta = arguments[0];
	ta.value = "";
}


// Add text to a textarea
function addText() {
	var text = arguments[0];
	var result = {
		to: function() {
			var ta = arguments[0];
			ta.value += text;
			ta.scrollTop = ta.scrollHeight;
		}
	};
	return result;
}


// Get parameter value from a Textarea
// From abmdif.js -- 20191211.0908
function getValue() {
	var key = arguments[0];
	var result = {
		from: function() {
			var ta = arguments[0];
			var lines = ta.value.split("\n");
			var Nl = lines.length;
			for(var l = 0; l < Nl; l++) {
				var words = lines[l].split(" ");
				var Nw = words.length;
				var value;
				if(words[0].indexOf(key) == 0) {
					if(Nw == 2) {
						value = parseFloat(words[1]);
					} else if(Nw == 4) {
						value = new Vect3(
							parseFloat(words[1]),
							parseFloat(words[2]),
							parseFloat(words[3])
						);
					}
					return value;
				}
			}
		}
	};
	return result;	
}
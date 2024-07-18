/*
	spfwfss.js
	Spherical particle floating on waving fluid surface
	
	Sparisoma Viridi | dudung@gmail.com
	Nurhayati | firstnur1708@gmail.com
	Johri Sabaryati | joyafarashy@gmail.com
	Dewi Muliyati | dmuliyati@gmail.com
	
	20180713
	Start creating this application based on slide posted at
	https://osf.io/94vsk/
	20180714
	Continue creating the application.
	20180802
	Fix water viscosity value from 1 Pa.s to 1 mPa.s and
	it does not work. Still use the previous value.
	Add direction of fluid surface wave with dirf.
	Modify fluid velocity, whose components is from vibration
	and traveling wave.
	20180929
	Change name according to new naming convention.
	CDN https://rawgit.com/dudung/butiran/master/app
	/md_spfwfss.html
	20181120
	Change to JS.
	20190529
	1129 Change name from md_spfwfss to spfwfs and start to
	move to app (new butiran.js).
	20190530
	1025 Migrate to (new) butiran.js library and add a
	reference.
	1310 Finish drawing wave.
	1724 Draw initial position as circle with background only.
	1829 Add physical parameters for forces;
	20190531
	0631 Update Github, still problem on surfing.
	0834 Try to fix periodic b.c. problem in viewing.
	1037 Still problem of continuity: work for particle but not
	for wave.
	1046 Fix b.c. between canvas.
	1124 Show data t, x, and y in taOut.
	1243 Cleaning code and test effect of drag.
	1311 Impememnt dy/dt for drag but has no effect.
	
	References
	1. Sparisoma Viridi, Nurhayati, Johri Sabaryati,
		 Dewi Muliyati, "Two-Dimensional Dynamics of Spherical
		 Grain Floating on the Propagating Wave Fluid Surface",
		 SPEKTRA: Jurnal Fisika dan Aplikasinya [], vol. 3,
		 no. 3, pp. , December 2018, url
		 https://doi.org/10.21009/SPEKTRA.033.01
*/

// Define global variables
var params;
var taIn, taOut, caOut1, caOut2, caOut3, caOut4;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var dx;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var wA, wT, wL;
var o, o0;
var buoyant, gravitational, drag;

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
	p += "WAMP 0.0200\n";
	p += "WTIM 1.75000\n";
	p += "WLEN 1.25000\n";
	p += "LSTP 0.0100\n";
	p += "RHOF 1000.0\n";
	p += "ETAF 8.9E-4\n";
	p += "TEMF 298\n";
	p += "GACC 0 -9.8067 0\n";
	p += "\n";
	p += "# Particle\n";
	p += "RHOG 500.0\n";
	p += "DIAM 0.1000\n";
	p += "POST 0.0000 0.0000 0.0000\n";
	p += "VELO 0.0000 0.0000 0.0000\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0000\n";
	p += "TEND 90.000\n";
	p += "TSTP 0.0050\n";
	p += "TDAT 0.1000\n";
	p += "TPRC 1\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -2.000 -0.125 -1.000\n";
	p += "RMAX +2.000 +0.125 +1.000\n";
	p += "\n";
	
	params = p;
	
	digit = 4;
}


// Load parameters
function loadParams() {
	clearText(taIn);
	addText(params).to(taIn);
}


// Read parameters
function readParams() {
tbeg = getValue("TBEG").from(taIn);
tend = getValue("TEND").from(taIn);
dt = getValue("TSTP").from(taIn);
Tdata = getValue("TDAT").from(taIn);
Tproc = getValue("TPRC").from(taIn);

wA = getValue("WAMP").from(taIn);
wT = getValue("WTIM").from(taIn);
wL = getValue("WLEN").from(taIn);
dx = getValue("LSTP").from(taIn);

iter = 0;
Niter = Math.floor(Tdata / dt);
t = tbeg;

var rhog = getValue("RHOG").from(taIn);
var D = getValue("DIAM").from(taIn);
var r = getValue("POST").from(taIn);
var v = getValue("VELO").from(taIn);

var V = (Math.PI / 6) * D * D * D;
var m = rhog * V;

o = new Grain();
o.m = m;
o.q = 0;
o.D = D;
o.r = r;
o.v = v;
o.c = ["#f00"];

o0 = new Grain();
o0.D = D;
o0.r = new Vect3(r);
o0.c = ["#fff", "#fcc"];

var rhof = getValue("RHOF").from(taIn);
var etaf = getValue("ETAF").from(taIn);
var Temf = getValue("TEMF").from(taIn);
var g = getValue("GACC").from(taIn);

buoyant = new Buoyant();
buoyant.setFluidDensity(rhof);
buoyant.setGravity(g);

gravitational = new Gravitational();
gravitational.setField(g);

drag = new Drag();
drag.setConstants(0, 3 * Math.PI * etaf * D, 0);

var rmin = getValue("RMIN").from(taIn);
var rmax = getValue("RMAX").from(taIn);

xmin = rmin.x;
ymin = rmin.y;
zmin = rmin.z;
xmax = rmax.x;
ymax = rmax.y;
zmax = rmax.z;

var xlength = xmax - xmin;
caOut1.xmin = xmin - 1.5 * xlength;
caOut1.xmax = caOut1.xmin + xlength;
caOut2.xmin = caOut1.xmax
caOut2.xmax = caOut2.xmin + xlength;
caOut3.xmin = caOut2.xmax
caOut3.xmax = caOut3.xmin + xlength;
caOut4.xmin = caOut3.xmax
caOut4.xmax = caOut4.xmin + xlength;

XMIN = 0;
XMAX = caOut1.width;
YMIN = caOut1.height;
YMAX = 0;
ZMIN = -1;
ZMAX = 1;
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
	
	// Create canvas for output
	var canHeight = "105";	
	caOut1 = document.createElement("canvas");
	caOut1.width = "439";
	caOut1.height = canHeight;
	with(caOut1.style) {
		width = caOut1.width +  "px";
		height = caOut1.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut2 = document.createElement("canvas");
	caOut2.width = "439";
	caOut2.height = canHeight;
	with(caOut2.style) {
		width = caOut2.width +  "px";
		height = caOut2.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut3 = document.createElement("canvas");
	caOut3.width = "439";
	caOut3.height = canHeight;
	with(caOut3.style) {
		width = caOut3.width +  "px";
		height = caOut3.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut4 = document.createElement("canvas");
	caOut4.width = "439";
	caOut4.height = canHeight;
	with(caOut4.style) {
		width = caOut4.width +  "px";
		height = caOut4.height +  "px";
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
		width = "442px";
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
		dvRight.append(caOut1);
		dvRight.append(caOut2);
		dvRight.append(caOut3);
		dvRight.append(caOut4);
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
		info += "spfwfss.js\n";
		info += "Spherical particle floating on waving fluid ";
		info += "surface\n";
		info += "Sparisoma Viridi, Nuryahati, Johri Sabaryati, Dewi Muliyai\n";
		info += "https://github.com/dudung/butiran.js\n";
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


// Define wave function
function waveFunction() {
	var x = arguments[0];
	var t = arguments[1];
	
	var A = wA;
	var T = wT;
	var lambda = wL;
	var omega = 2 * Math.PI / T;
	var k = 2 * Math.PI / lambda;
	
	var y = A * Math.sin(k * x - omega * t);
	return y;
}


// Create wave
function createWave() {
	var t = arguments[0];
	
	var x = [];
	var y = [];
	
	var xlength = xmax - xmin;
	var N = 4 * xlength / dx;
	for(var i = 0; i <= N; i++) {
		var xx = xmin - 1.5 * xlength + i * dx;
		var yy = waveFunction(xx, t);
		
		x.push(xx);
		y.push(yy);
	}
	
	var p = new Points();
	p.addSeries(x);
	p.addSeries(y);
	return p;
}


// Perform simulation
function simulate() {
	if(iter >= Niter) {
		iter = 0;
	}
	
	if(t == tbeg) {
		//       0.0740 -0.0009 -0.0162
		addText("#t      x       y\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = t.toFixed(digit);
		var xx = o.r.x.toFixed(digit);
		var yy = o.r.y.toFixed(digit);
		var info = tt + " " + xx + " " + yy + "\n";
		addText(info).to(taOut);
	}
		
	var F = new Vect3();
	
	// Calculate gravitational force
	var Fg = gravitational.force(o);
	F = Vect3.add(F, Fg);
		
	// Calculate buoyant force
	var V = (Math.PI / 6) * o.D * o.D * o.D;
	var yA = waveFunction(o.r.x + 0.5 * o.D, t);
	var yB = waveFunction(o.r.x - 0.5 * o.D, t);
	var yf = waveFunction(o.r.x, t);
	var Fb = buoyant.force(o, yA, yB, yf);
	F = Vect3.add(F, Fb);
	
	// Calculate drag force
	var dy = waveFunction(o.r.x, t + dt)
		- waveFunction(o.r.x, t);
	var vf = new Vect3(0, dy / dt, 0);
	drag.setField(vf);
	var Fd = drag.force(o)
	F = Vect3.add(F, Fd);
	
	// Apply Newton second law of motion
	var a = Vect3.div(F, o.m);
	
	// Implement Euler algorithm
	o.v = Vect3.add(o.v, Vect3.mul(a, dt));
	o.r = Vect3.add(o.r, Vect3.mul(o.v, dt));
	
	// Create wave curve
	p = createWave(t);
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
	clearCanvas(caOut4);
	
	// Draw object initial position
	draw(o0).onCanvas(caOut1);
	draw(o0).onCanvas(caOut2);
	draw(o0).onCanvas(caOut3);
	draw(o0).onCanvas(caOut4);
	
	// Draw object in all canvas
	draw(o).onCanvas(caOut1);
	draw(o).onCanvas(caOut2);
	draw(o).onCanvas(caOut3);
	draw(o).onCanvas(caOut4);
	
	// Draw wave in all canvas
	draw(p).onCanvas(caOut1);
	draw(p).onCanvas(caOut2);
	draw(p).onCanvas(caOut3);
	draw(p).onCanvas(caOut4);
	
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


// Clear canvas
function clearCanvas(caOut) {
	var width = caOut.width;
	var height = caOut.height;
	var cx = caOut.getContext("2d");
	cx.clearRect(0, 0, width, height);
}


// Draw Grain, Path, Points on canvas
function draw() {
	var o = arguments[0];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			var lintrans = Transformation.linearTransform;
			
			if(o instanceof Grain) {
				var xg = o.r.x;
				var dx = xg + o.D;
				var yg = o.r.y;
				
				var X, DX;
				if(ca.xmin == undefined) {
					X = lintrans(xg, [xmin, xmax], [XMIN, XMAX]);
					DX = lintrans(dx, [xmin, xmax], [XMIN, XMAX]);
				} else {
					X = lintrans(xg, [ca.xmin, ca.xmax], [XMIN, XMAX]);
					DX = lintrans(dx, [ca.xmin, ca.xmax], [XMIN, XMAX]);
				}
				
				var D = DX - X;
				var Y = lintrans(yg, [ymin, ymax], [YMIN, YMAX]);
				
				cx.beginPath();
				if(o.c instanceof Array) {
					cx.strokeStyle = o.c[0];
					if(o.c.length > 1) {
						cx.fillStyle = o.c[1];
					}
				} else {
					cx.strokeStyle = o.c;
				}
				
				if(o.c instanceof Array && o.c.length > 1) {
					cx.arc(X, Y, D, 0, 2 * Math.PI);
					cx.fill();
				}
				cx.lineWidth = "2";
				cx.arc(X, Y, D, 0, 2 * Math.PI);
				cx.stroke();
			} else if(o instanceof Path) {
				var qi = o.qi * 2 * Math.PI;
				var qf = o.qf * 2 * Math.PI;
				var L = o.l;
				var color = o.c;
				
				var N = Math.floor(L / ds);
				var q = qi;
				var dq = (qf - qi) / N;
				
				var xx = [];
				var yy = [];
				for(i = 0; i < N; i++) {
					var dx = ds * Math.cos(q);		
					x += dx;
					xx.push(x);
					sx.push(x);
					
					var dy = ds * Math.sin(q);		
					y += dy;
					yy.push(y);
					sy.push(y);
					
					q += dq;
				}
				
				cx.beginPath();
				cx.strokeStyle = color;
				cx.lineWidth = "1";
				for(i = 0; i < N; i++) {
					var X = lintrans(xx[i], [xmin, xmax], [XMIN, XMAX]);
					var Y = lintrans(yy[i], [ymin, ymax], [YMIN, YMAX]);
					if(i == 0) {
						cx.moveTo(X, Y);
					} else {
						cx.lineTo(X, Y);
					}
				}
				cx.stroke();
				
				cx.beginPath();
				var X = lintrans(xx[0], [xmin, xmax], [XMIN, XMAX]);
				var Y = lintrans(yy[0], [ymin, ymax], [YMIN, YMAX]);
				cx.strokeStyle = "#000";
				cx.arc(X, Y, 2, 0, 2 * Math.PI);
				cx.stroke();
				
			} else if(o instanceof Points) {
				var N = o.data[0].length;
				cx.beginPath();
				cx.lineWidth = "2";
				cx.strokeStyle = "#00f";
				for(var i = 0; i <= N; i++) {
					var X;
					if(ca.xmin == undefined) {
						X = lintrans(o.data[0][i], [xmin, xmax],
							[XMIN, XMAX]);
					} else {
						X = lintrans(o.data[0][i], [ca.xmin, ca.xmax],
							[XMIN, XMAX]);
					}
					var Y = lintrans(o.data[1][i], [ymin, ymax],
						[YMIN, YMAX]);
					if(i == 0) {
						cx.moveTo(X, Y);
					} else {
						cx.lineTo(X, Y);
					}
				}
				cx.stroke();
			}
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

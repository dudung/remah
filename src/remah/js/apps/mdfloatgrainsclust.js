/*
  mdfloatgrainsclust.js
  MD simulation of floating grains clustering
	Sparisoma Viridi | dudung@gmail.com
  Rizal Kurniadi | rijalk@itb.ac.id
  
  20240723
  0723 Start to implement stationary wave.
  0755 Start to create HCP.
  
  20240720
  1316 Finish merge mdfhcp.js and butiran.min.js v29 in this file.
  1411 Fix false edit between apps and temp for mdfloatgrainsclust.
  1603 Fix total particle in generating prograins by Nrat.
  1100 create other binding force.
  
  --
  mdfhcp.js
	Molecular dynamics simulation of floating hcp structure
	
	Sparisoma Viridi | dudung@gmail.com
	Veinardi Suendo | suendo@gmail.com
	
	20190709
	0958 Create from spfwfs as template.
	1006 Remove o0.
	1010 Try to add more than one o.
	1102 Try with 10 liniear configuration.
	1142 Fix wrong drawing D --> R.
	1150 Change coordinates on canvas1.
	1156 Implement gravitational-like attractive force.
	1208 Try to draw in xz plane.
	1218 Not yet success.
	1359 Better visualization.
	1741 Con to get data from app.
	1838 Find better wave parameters.
	20190710
	0522 Change data time output format to 2 digit every 1 s.
	0545 Create distribution function.
	0554 Change layout.
	
	References
	1. Sparisoma Viridi, Veinardi Suendo, "Molecular dynamics
	   simulation of floating sphere forming two-dimensional
		 hexagonal close packed structure", OSF,
		 url https://doi.org/10.17605/osf.io/a3gjv
*/


/*
  Define class of binding
  
	Sparisoma Viridi | dudung@gmail.com
  Rizal Kurniadi | rijalk@itb.ac.id
  
  20240723 Start this type of force.
  1101 Begin this class by modifying spring.js file.
*/
  
// Define class of Binding
class Binding {
	// Create constructor
	constructor() {
		// Set default spring constant
		this.k = 1; // N m^-1 
		
		// Set default spring uncompressed length
		this.l = 1; // m
		
		// Set default damping constant
		this.gamma = 1; // N s m^-1
		
		// Set maximum length
		this.lmax = 2 * this.l ; // m
	}
	
	// Set constants
	setConstants(k, gamma) {
		this.k = k;
		this.gamma = gamma;
	}
	
	// Set uncompressed length
	setUncompressedLength(l) {
		this.l = l;
	}
		
	// Set max length
	setMaxLength(lmax) {
		this.lmax = lmax;
	}
		
	// Calculate spring force
	force() {
		var f = new Vect3;
    if(arguments[0] instanceof Grain &&
      arguments[1] instanceof Grain) {
      var r1 = arguments[0].r;
      var r2 = arguments[1].r;
      var r12 = Vect3.sub(r1, r2);
      var u12 = r12.unit();
      var l12 = r12.len();
      var l = this.l;
      
      if(l12 < this.lmax) {
        
        var v1 = arguments[0].v;
        var v2 = arguments[1].v;
        var v12 = Vect3.sub(v1, v2);
        var k = this.k;
        var gamma = this.gamma;
        var ksi = l12 - l;
        var ksidot = v12.len();
        
        var fr = Vect3.mul(-k * ksi, u12);
        var fv = Vect3.mul(-gamma * ksidot, v12);
        
        f = Vect3.add(fr, fv);
      }
    }
		
		return f;
	}
}

// --- end of binding force ---//


// Define global variables
var params;
var taIn, taOut, caOut1, caOut2, caOut3, caOut4;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter, wstat;
var dx;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var wA, wT, wL;
var o, pconf;
var buoyant, gravitational, drag, normal, attractive;
var electrostatic; // 20240720 electrostatic force
var binding; // 20240723 binding force
var ND;

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
	p += "WAMP 0.01\n";
	p += "WTIM 0.200\n";
	p += "WLEN 0.40\n";
	p += "WSTA 1\n";  // 20240723 stationary wave
	p += "LSTP 0.0100\n";
	p += "RHOF 1000.0\n";
	p += "ETAF 8.9E-4\n";
	p += "TEMF 298\n";
	p += "GACC 0 -9.8067 0\n";
	p += "\n";
	p += "# Interaction\n";
	p += "KNXX 10000\n";
	p += "GNXX 10\n";
	p += "KAXX 0.01\n";
	p += "KBXX 0.02\n";  // 20240723 binding force
	p += "GBXX 0.1\n";  // 20240723 binding force
	p += "LBXX 0.2\n";  // 20240723 binding force
	p += "LBMX 0.4\n";  // 20240723 binding force
	p += "KQXX 2.0\n";  // 20240720 electrostatic constant
	p += "\n";
	p += "# Particle\n";
	p += "RHOG 500.0\n";
	p += "CHRG 0.28\n";  // 20240720 charge for prograins, not for neugrains
	p += "DIAM 0.1000\n";
	p += "POST 0.000 0.0000 0.0000\n";
	p += "VELO 0.0000 0.0000 0.0000\n";
	p += "NXYZ 10 1 10\n";
	p += "NRAT 0.5\n"; // 20240720 ratio of prograins to neugrains [0, 1]
	p += "CONF 1\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0\n";
	p += "TEND 100\n";
	p += "TSTP 0.005\n";
	p += "TDAT 1.000\n";
	p += "TPRC 1\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -2.0 -0.25 -2.0\n";
	p += "RMAX +2.0 +0.25 +2.0\n";
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
	
  // 20240723 stationary wave
  wstat = getValue("WSTA").from(taIn);
  //console.log(wstat);
  
  // 20240723 configuration
  pconf = getValue("CONF").from(taIn);
  //console.log(pconf);
  
	iter = 0;
	Niter = Math.floor(Tdata / dt);
	t = tbeg;

	var rhog = getValue("RHOG").from(taIn);
	var chrg = getValue("CHRG").from(taIn);
	var D = getValue("DIAM").from(taIn);
	var r = getValue("POST").from(taIn);
	var v = getValue("VELO").from(taIn);
	var NXYZ = getValue("NXYZ").from(taIn);
	

	var V = (Math.PI / 6) * D * D * D;
	var m = rhog * V;

	// Define initial position
	o = [];
	var Nx = NXYZ.x;
	var Ny = NXYZ.y;
	var Nz = NXYZ.z;

  // 20240720 for charge particles
  var N = Nx * Ny * Nz;
  var Nrat = getValue("NRAT").from(taIn);
  var Nptot = Nrat * N;
  
  var Np = 0;
	for(var ix = 0; ix < Nx; ix++) {
		for(var iy = 0; iy < Ny; iy++) {
			for(var iz = 0; iz < Nz; iz++) {
				oi = new Grain();
				oi.m = m;
				oi.D = D;
        
        // 20240720 random number
        let rnd = Math.random();
        if(rnd < Nrat && Np < Nptot) {
          oi.q = chrg;
          Np += 1;
        } else {
          oi.q = 0;
        }
        
        
        // from befor 20240723.
        if(pconf == 0) {
          var rndx = 0.01 * D * Math.random();
          var rndy = 0.00 * D * Math.random();
          var rndz = 0.01 * D * Math.random();
          
          var x = D * (ix - 0.5 * (Nx - 1)) * (1 + rndx);
          var y = D * (iy - 0.5 * (Ny - 1)) * (1 + rndy);
          var z = D * (iz - 0.5 * (Nz - 1)) * (1 + rndz);
          oi.r = Vect3.add(r, new Vect3(x, y, z));
          oi.v = v;
          oi.c = ["#f00"];
          o.push(oi);
        }
        
        // 20240723 create hexagonal close packed configuration.
        if(pconf == 1) {
          var rndx = 0.00 * D * Math.random();
          var rndy = 0.00 * D * Math.random();
          var rndz = 0.00 * D * Math.random();
          
          var x;
          if(iz % 2 == 0) {
            x = D * (ix - 0.5 * (Nx - 1)) * (1 + rndx);
          } else {
            x = D * (ix - 0.5 * (Nx - 1)) * (1 + rndx + 0.125);
          }
          
          var z = D * (iz - 0.5 * (Nz - 1)) * (1 + rndz + 0.05);
          
          var y = D * (iy - 0.5 * (Ny - 1)) * (1 + rndy);
          oi.r = Vect3.add(r, new Vect3(x, y, z));
          oi.v = v;
          oi.c = ["#f00"];
          o.push(oi);
        }
        
        // Other configuration
        
			}
		}
	}

	var rhof = getValue("RHOF").from(taIn);
	var etaf = getValue("ETAF").from(taIn);
	var Temf = getValue("TEMF").from(taIn);
	var g = getValue("GACC").from(taIn);
	var kN = getValue("KNXX").from(taIn);
	var gN = getValue("GNXX").from(taIn);
	var kA = getValue("KAXX").from(taIn);
	var kQ = getValue("KQXX").from(taIn); // 20240720

	buoyant = new Buoyant();
	buoyant.setFluidDensity(rhof);
	buoyant.setGravity(g);

	gravitational = new Gravitational();
	gravitational.setField(g);

	drag = new Drag();
	drag.setConstants(0, 3 * Math.PI * etaf * D, 0);

	normal = new Normal();
	normal.setConstants(kN, gN);

	attractive = new Gravitational();
	attractive.setConstant(kA);
  
  // 20240720 electrostatic force
	electrostatic = new Electrostatic();
	electrostatic.setConstant(kQ);
  
  // 20240723 binding force
	var kB = getValue("KBXX").from(taIn);
	var gB = getValue("GBXX").from(taIn);
	var lB = getValue("LBXX").from(taIn);
	var lBmax = getValue("LBMX").from(taIn);
	binding = new Binding();
	binding.setConstants(kB, gB);
  binding.setUncompressedLength(lB);
  binding.setMaxLength(lBmax);
  console.log(kB, gB, lB, lBmax);
  
	var rmin = getValue("RMIN").from(taIn);
	var rmax = getValue("RMAX").from(taIn);
	
	xmin = rmin.x;
	ymin = rmin.y;
	zmin = rmin.z;
	xmax = rmax.x;
	ymax = rmax.y;
	zmax = rmax.z;

	caOut1.xmin = xmin;
	caOut1.xmax = xmax;
	
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
		height = "207px";
	}
	
	// Create textarea for output
	taOut = document.createElement("textarea");
	with(taOut.style) {
		overflowY = "scroll";
		width = "464px";
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
	caOut1 = document.createElement("canvas");
	caOut1.width = "430";
	caOut1.height = "110";
	with(caOut1.style) {
		width = caOut1.width +  "px";
		height = caOut1.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut2 = document.createElement("canvas");
	caOut2.width = "430";
	caOut2.height = "430";
	with(caOut2.style) {
		width = caOut2.width +  "px";
		height = caOut2.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut3 = document.createElement("canvas");
	caOut3.width = "248";
	caOut3.height = "211";
	with(caOut3.style) {
		width = caOut3.width +  "px";
		height = caOut3.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
		
	// Create div for left part
	var dvLeft = document.createElement("div");
	with(dvLeft.style) {
		width = "470px";
		height = "450px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Create div for right part
	var dvRight = document.createElement("div");
	with(dvRight.style) {
		width = "334px";
		height = "450px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Append element in structured order
	document.body.append(dvLeft);
		dvLeft.append(taIn);
		dvLeft.append(caOut3);
		dvLeft.append(taOut);
		dvLeft.append(btLoad);
		dvLeft.append(btRead);
		dvLeft.append(btStart);
		dvLeft.append(btInfo);
	document.body.append(dvRight);
		dvRight.append(caOut1);
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
		info += "mdfhcp.js\n";
		info += "Molecular dynamics simulation of HCP structure\n";
		info += "Sparisoma Viridi, Veinardi Suendo\n";
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
	
	var yr = A * Math.sin(k * x - omega * t);
	var yl = A * Math.sin(k * x + omega * t);
  
  // 20240723 stationary wave
  //console.log(wstat);
  var y = (wstat == 1) ? yr + yl : yr;
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
		//       00 000
		addText("#t x   y\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = ("00" + t.toFixed(0)).slice(-2);
		
		var C = 0;
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				var ri = o[i].r;
				var rj = o[j].r;
				var rij = Vect3.sub(ri, rj).len();
				var Ri = 0.5 * o[i].D;
				var Rj = 0.5 * o[j].D;
				var ksi = Math.max(0, Ri + Rj - rij);
				if(ksi > 0) C++;
			}
		}
		C = ("000" + C).slice(-3);
		
		var Davg = 0;
		for(var i = 0; i < o.length; i++) {
			Davg += o[i].D;
		}
		Davg /= o.length;
		
		var Nclass = 100;
		ND = [];
		ND.length = Nclass;
		ND.fill(0);
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				var ri = o[i].r;
				var rj = o[j].r;
				var rij = Vect3.sub(ri, rj).len();
				var k = Math.floor((rij - 0.5 *Davg) / (Davg / Nclass));
				if(k < ND.length) ND[k]++
			}
		}
		var NDtot = 0;
		for(var i = 0; i < ND.length; i++) {
			NDtot += ND[i];
		}
		var NDstr = [];
		for(var i = 0; i < ND.length; i++) {
			ND[i] /= NDtot;
			NDstr.push(ND[i].toFixed(2));
		}
		var NDstra = "";
		for(var i = 0; i < ND.length; i++) {
			NDstra += NDstr[i];
			if(i < ND.length - 1) {
				NDstra += " ";
			}
		}
		
		var info = tt + " " + C + " " + NDstra + "\n";
		addText(info).to(taOut);
	}
	
	// Calculate total force acted on all particles
	var SF = [];
	for(var i = 0; i < o.length; i++) {

		var F = new Vect3();
		
		// Calculate gravitational force
		var Fg = gravitational.force(o[i]);
		F = Vect3.add(F, Fg);
			
		// Calculate buoyant force
		var V = (Math.PI / 6) * o[i].D * o[i].D * o[i].D;
		var yA = waveFunction(o[i].r.x + 0.5 * o[i].D, t);
		var yB = waveFunction(o[i].r.x - 0.5 * o[i].D, t);
		var yf = waveFunction(o[i].r.x, t);
		var Fb = buoyant.force(o[i], yA, yB, yf);
		F = Vect3.add(F, Fb);
		
		// Calculate drag force
		var dy = waveFunction(o[i].r.x, t + dt)
			- waveFunction(o[i].r.x, t);
		var vf = new Vect3(0, dy / dt, 0);
		drag.setField(vf);
		var Fd = drag.force(o[i])
		F = Vect3.add(F, Fd);
		
		// Calculate normal force
		var Fn = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fni = normal.force(o[i], o[j]);
				Fn = Vect3.add(Fn, Fni);
			}
		}
		F = Vect3.add(F, Fn);
		
    /*
    
		// Calculate attractive force
		var Fa = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fai = attractive.force(o[i], o[j]);
				Fa = Vect3.add(Fa, Fai);
			}
		}
		F = Vect3.add(F, Fa);
		
		// 20240720 Calculate electrostatic force
		var Fq = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fqi = electrostatic.force(o[i], o[j]);
				Fq = Vect3.add(Fq, Fqi);
			}
		}
		F = Vect3.add(F, Fq);
    
    */
    
    
    // 20240723 Calculate binding force
		var Fb = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fbi = binding.force(o[i], o[j]);
				Fb = Vect3.add(Fb, Fbi);
			}
		}
		F = Vect3.add(F, Fb);
    
		SF.push(F);
	}
	
	// Update motion variables
	for(var i = 0; i < o.length; i++) {
		// Apply Newton second law of motion
		var a = Vect3.div(SF[i], o[i].m);
		
		// Implement Euler algorithm
		o[i].v = Vect3.add(o[i].v, Vect3.mul(a, dt));
		o[i].r = Vect3.add(o[i].r, Vect3.mul(o[i].v, dt));
	}
	
	// Create wave curve
	p = createWave(t);
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
	
	// Draw object in all canvas
	for(var i = 0; i < o.length; i++) {
		draw(o[i]).onCanvas(caOut1);
		draw(o[i], "xz").onCanvas(caOut2);
	}
	
	// Draw wave in all canvas
	draw(p).onCanvas(caOut1);
	
	drawDist(ND, caOut3);
	
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


// Draw distribution on canvas
function drawDist() {
	var x = arguments[0];
	var N = x.length;
	
	var can = arguments[1];
	var cx = can.getContext("2d");
	
	var lx = 9;
	var ly = 10;
	var dx = (can.width - 2 * lx) / N;
	var xo = lx;
	var yo = can.height - ly;
	var h = can.height - 2 * ly;
	
	cx.beginPath();
	for(var i = 0; i < N; i++) {
		cx.rect(xo + i * dx, yo, dx, -h * x[i]);
	}
	cx.stroke();
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
	var plane = arguments[1];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			var lintrans = Transformation.linearTransform;
			
			if(o instanceof Grain) {
				var xg = o.r.x;
				var dx = xg + 0.5 * o.D;
				var yg = o.r.y;
				
				if(plane != undefined) {
					xg = o.r.x;
					yg = o.r.z;
				}
				
				var X, DX;
				if(ca.xmin == undefined) {
					X = lintrans(xg, [xmin, xmax], [0, ca.width]);
					DX = lintrans(dx, [xmin, xmax], [0, ca.width]);
				} else {
					X = lintrans(xg, [ca.xmin, ca.xmax], [0, ca.width]);
					DX = lintrans(dx, [ca.xmin, ca.xmax], [0, ca.width]);
				}
				
				var D = DX - X;
				var Y = lintrans(yg, [ymin, ymax], [ca.height, 0]);
				
				if(plane != undefined) {
					Y = lintrans(yg, [zmin, zmax], [ca.height, 0]);
				}
				
				cx.beginPath();
        
        /*
				if(o.c instanceof Array) {
					cx.strokeStyle = o.c[0];
					if(o.c.length > 1) {
						cx.fillStyle = o.c[1];
					}
				} else {
					cx.strokeStyle = o.c;
				}
        */
				
        // 20240720 change style for charged particles
        if(o.q > 0) {
          cx.strokeStyle = '#f00';
          cx.fillStyle = '#fcc';
        } else {
          cx.strokeStyle = '#ccc';
          cx.fillStyle = '#eee';
        }
        
        /*
				if(o.c instanceof Array && o.c.length > 1) {
					cx.arc(X, Y, D, 0, 2 * Math.PI);
					cx.fill();
				}
        */
        
				cx.lineWidth = "2";
				cx.arc(X, Y, D, 0, 2 * Math.PI);
				cx.stroke();
        
        // 20240720 fill the grains
				cx.arc(X, Y, D, 0, 2 * Math.PI);
				cx.fill();
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


/*
  butiran.min.js
  Sparisoma Viridi
  
  v29 - 11 Dec 2023
  url https://github.com/dudung/butiran.js/releases/tag/v29
*/

!function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e){class n{constructor(){0==arguments.length?(this.x=0,this.y=0,this.z=0):3==arguments.length?(this.x=arguments[0],this.y=arguments[1],this.z=arguments[2]):1==arguments.length&&(arguments[0]instanceof n&&(this.x=arguments[0].x),this.y=arguments[0].y,this.z=arguments[0].z)}strval(){var t="(";return t+=this.x+", ",t+=this.y+", ",t+=this.z,t+=")"}static add(){for(var t=arguments.length,e=0,i=0,r=0,s=0;s<t;s++)e+=arguments[s].x,i+=arguments[s].y,r+=arguments[s].z;return new n(e,i,r)}static sub(){var t=arguments[0].x-arguments[1].x,e=arguments[0].y-arguments[1].y,i=arguments[0].z-arguments[1].z;return new n(t,e,i)}static mul(){var t,e,i,r=arguments[0],s=arguments[1];return r instanceof n?(t=r.x*s,e=r.y*s,i=r.z*s):s instanceof n&&(t=r*s.x,e=r*s.y,i=r*s.z),new n(t,e,i)}static div(){var t=arguments[0],e=arguments[1],i=t.x/e,r=t.y/e,s=t.z/e;return new n(i,r,s)}static dot(){var t=arguments[0],e=arguments[1];return t.x*e.x+t.y*e.y+t.z*e.z}static cross(){var t=arguments[0],e=arguments[1],i=t.y*e.z-t.z*e.y,r=t.z*e.x-t.x*e.z,s=t.x*e.y-t.y*e.x;return new n(i,r,s)}len(){return Math.sqrt(n.dot(this,this))}unit(){var t=this.len(),e=new n;return t>0&&(e=n.div(this,t)),e}neg(){var t=-this.x,e=-this.y,i=-this.z;return new n(t,e,i)}}t.exports=function(){return n}},function(t,e,n){var i=n(0)();function r(){13==arguments.length?(this.i=arguments[0],this.m=arguments[1],this.D=arguments[2],this.q=arguments[3],this.c=arguments[4],this.r=arguments[5],this.v=arguments[6],this.A=arguments[7],this.k=arguments[8],this.M=arguments[9],this.I=arguments[10],this.the=arguments[11],this.w=arguments[12]):1==arguments.length?(this.i=arguments[0].i,this.m=arguments[0].m,this.D=arguments[0].D,this.q=arguments[0].q,this.c=arguments[0].c,this.r=arguments[0].r,this.v=arguments[0].v,this.A=arguments[0].A,this.k=arguments[0].k,this.M=arguments[0].M,this.I=arguments[0].I,this.the=arguments[0].the,this.w=arguments[0].w):(this.i=0,this.m=1,this.D=1,this.q=1,this.c="#000",this.r=new i,this.v=new i,this.A=0,this.k=new Array,this.M=0,this.I=10,this.the=0,this.w=0),this.strval=function(){var t="(";return t+=this.i+", ",t+=this.m+", ",t+=this.D+", ",t+=this.q+", ",t+=this.c+", ",t+=this.r.strval()+", ",t+=this.v.strval()+", ",t+=this.A+", ",t+=this.k+", ",t+=this.M+", ",t+=this.I+", ",t+=this.the+", ",t+=this.w+")"}}t.exports=function(){return r}},function(t,e,n){var i=n(0)();function r(){0==arguments.length?(this.r=new i,this.s=[],this.s.push(new i(1,0,0)),this.s.push(new i(0,1,0)),this.s.push(new i(0,0,1))):1==arguments.length?(this.r=arguments[0],this.s=[],this.s.push(new i(1,0,0)),this.s.push(new i(0,1,0)),this.s.push(new i(0,0,1))):4==arguments.length&&(this.r=arguments[0],this.s=[],this.s.push(arguments[1]),this.s.push(arguments[2]),this.s.push(arguments[3]));var t=i.div(this.s[0],2),e=i.div(this.s[1],2),n=i.div(this.s[2],2),r=t.neg(),s=e.neg(),a=n.neg();this.p=[],this.p.push(i.add(this.r,r,s,a)),this.p.push(i.add(this.r,t,s,a)),this.p.push(i.add(this.r,t,e,a)),this.p.push(i.add(this.r,r,e,a)),this.p.push(i.add(this.r,r,s,n)),this.p.push(i.add(this.r,t,s,n)),this.p.push(i.add(this.r,t,e,n)),this.p.push(i.add(this.r,r,e,n)),this.strval=function(){var t="(";return t+=this.r.strval()+", ",t+="[",t+=this.s[0].strval()+", ",t+=this.s[1].strval()+", ",t+=this.s[2].strval()+"",t+="], ",t+="[",t+=this.p[0].strval()+", ",t+=this.p[1].strval()+", ",t+=this.p[2].strval()+", ",t+=this.p[3].strval()+", ",t+=this.p[4].strval()+", ",t+=this.p[5].strval()+", ",t+=this.p[6].strval()+", ",t+=this.p[7].strval()+"",t+="]",t+=")"}}t.exports=function(){return r}},function(t,e){class n{constructor(){this.name="Sequence",this.value=[0,0,0,0,0,1,1,1,1,1],this.pos=0,1==arguments.length&&(this.value=arguments[0]),this.end=this.value.length}ping(){var t=this.value[this.pos];return this.pos++,this.pos==this.end&&(this.pos=0),t}static test(){for(var t=new n,e=0;e<16;e++)console.log(t.ping())}}t.exports=function(){return n}},function(t,e,n){var i=n(1)(),r=n(5),s=n(0)(),a=n(2)(),o=n(6),l=n(7)(),h=n(8)(),c=n(9)(),u=n(10)(),d=n(11)(),f=n(12)(),p=n(13)(),v=n(14)(),g=n(15),b=n(3)(),m=n(16)(),y=n(17)(),w=n(18),x=n(19)(),S=n(20),I=n(21)(),E=n(22),T=n(23)(),k=n(24)(),N=n(25),A=n(26),B=n(27),M=n(28)(),C=n(29)(),O=n(30);"undefined"!=typeof window&&(window.Grain=i,window.Style=r,window.Vect3=s,window.Box=a,window.RGB=o,window.Buoyant=l,window.Drag=h,window.Electrostatic=c,window.Gravitational=u,window.Magnetic=d,window.Normal=f,window.Spring=p,window.Generator=v,window.Random=g,window.Sequence=b,window.Timer=m,window.Sample=y,window.Tablet=w,window.Pile=x,window.Path=T,window.Polynomial=I,window.Integration=S,window.Transformation=E,window.Points=k,window.TabText=N,window.TabCanvas=A,window.Parse=B,window.Tabs=M,window.Bgroup=C,window.Veio=O)},function(t,e){t.exports={createStyle:function(t){return function(t){var e=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");if(n.type="text/css",n.styleSheet)n.styleSheet.cssText=t;else{var i=document.createTextNode(t);n.append(i)}e.append(n)}(t)},changeStyleAttribute:function(t,e,n){return function(t,e,n){for(var i=document.styleSheets.length,r=document.styleSheets,s=0;s<i;s++)r[s].rules[0].selectorText==t&&(r[s].rules[0].style[e]=n)}(t,e,n)},getStyleAttribute:function(t,e){return function(t,e){for(var n,i=document.styleSheets.length,r=document.styleSheets,s=0;s<i;s++)r[s].rules[0].selectorText==t&&(n=r[s].rules[0].style[e]);return n}(t,e)}}},function(t,e){function n(t,e,n){var i=n.toString(16),r=e.toString(16),s=t.toString(16);return i.length<2&&(i="0"+i),r.length<2&&(r="0"+r),s.length<2&&(s="0"+s),"#"+s+r+i}t.exports={int2rgb:function(t,e,i){return n(t,e,i)},double2rgb:function(t,e,i){return function(t,e,i){var r=Math.round(255*i),s=Math.round(255*e);return n(Math.round(255*t),s,r)}(t,e,i)}}},function(t,e,n){var i=n(0)();class r{constructor(){this.rho=1e3,this.g=new i(0,0,-10)}setFluidDensity(t){this.rho=t}setGravity(t){this.g=t}force(){var t=new i;if(arguments[0]instanceof Grain)if(1==arguments.length){var e=arguments[0].D,n=Math.PI/6*e*e*e,r=this.g.len(),s=this.rho,a=this.g.unit().neg();t=i.mul(s*r*n,a)}else if(2==arguments.length){e=arguments[0].D;var o=arguments[1];n=0;if((u=arguments[0].r.y)<o-.5*e)n=Math.PI/6*e*e*e;else if(o-.5*e<=u&&u<=o+.5*e){var l=.25*e*e*((I=o-u)+.5*e),h=-1/3*(I*I*I+e*e*e/8);n=Math.PI*(l+h)}else n=0;r=this.g.len(),s=this.rho,a=this.g.unit().neg();t=i.mul(s*r*n,a)}else if(4==arguments.length){var c,u,d=arguments[0].r.x,f=(e=arguments[0].D,this.g),p=d+.5*e,v=d-.5*e,g=arguments[1],b=arguments[2],m=(o=arguments[3],new i(p,g,0)),y=new i(v,b,0),w=i.sub(m,y).unit(),x=f.unit(),S=i.cross(i.cross(x,w),w);s=this.rho;if((u=arguments[0].r.y)<o-.5*e)c=Math.PI/6*s*e*e*e*f.len(),S=i.mul(-1,x);else if(o-.5*e<=u&&u<=o+.5*e){var I,E=.25*e*e*((I=o-u)+.5*e),T=-1/3*(I*I*I+e*e*e/8);c=Math.PI*s*(E+T)*f.len()}else c=0;t=i.mul(c,S)}return t}}t.exports=function(){return r}},function(t,e,n){var i=n(0)(),r=n(1)();class s{constructor(){this.c0=0,this.c1=0,this.c2=0,this.vf=new i}setConstants(t,e,n){this.c0=t,this.c1=e,this.c2=n}setField(t){this.vf=t}force(){var t=new i;if(arguments[0]instanceof r){var e=this.c0,n=this.c1,s=this.c2,a=this.vf,o=arguments[0].v,l=i.sub(o,a),h=l.unit(),c=l.len(),u=e+n*c+s*(c*c);t=i.mul(u,h.neg())}return t}}t.exports=function(){return s}},function(t,e,n){var i=n(0)(),r=n(1)();class s{constructor(){this.k=8987551787,this.E=new i(1,0,0)}setField(t){this.E=t,delete this.k}setConstant(t){this.k=t,delete this.E}force(){var t=new i;if(null!=this.E&&arguments[0]instanceof r){var e=arguments[0].q,n=this.E;t=i.mul(e,n)}if(null!=this.k&&arguments[0]instanceof r&&arguments[1]instanceof r){var s=arguments[0].q,a=arguments[1].q,o=arguments[0].r,l=arguments[1].r,h=i.sub(o,l),c=h.unit(),u=h.len(),d=this.k;t=i.mul(d*s*a/(u*u),c)}return t}}t.exports=function(){return s}},function(t,e,n){var i=n(0)(),r=n(1)();class s{constructor(){this.G=6.67408e-11,this.g=new i(0,0,-9.80665)}setField(t){this.g=t,delete this.G}setConstant(t){this.G=t,delete this.g}force(){var t=new i;if(null!=this.g&&arguments[0]instanceof r){var e=arguments[0].m,n=this.g;t=i.mul(e,n)}if(null!=this.G&&arguments[0]instanceof r&&arguments[1]instanceof r){var s=arguments[0].m,a=arguments[1].m,o=arguments[0].r,l=arguments[1].r,h=i.sub(o,l),c=h.unit(),u=h.len(),d=this.G;t=i.mul(-d*s*a/(u*u),c)}return t}}t.exports=function(){return s}},function(t,e,n){var i=n(0)(),r=n(1)();class s{constructor(){this.k=1e-7,this.B=new i(1,0,0)}setField(t){this.B=t,delete this.k}setConstant(t){this.k=t,delete this.B}force(){var t=new i;if(null!=this.B&&arguments[0]instanceof r){var e=arguments[0].q,n=arguments[0].v,s=this.B;t=i.mul(e,i.cross(n,s))}if(null!=this.k&&arguments[0]instanceof r&&arguments[1]instanceof r){var a=arguments[0].q,o=arguments[1].q,l=arguments[0].r,h=arguments[1].r,c=i.sub(l,h),u=c.len(),d=arguments[0].v,f=arguments[1].v,p=this.k,v=i.cross(d,i.cross(f,c));t=i.mul(p*a*o/(u*u),v)}return t}}t.exports=function(){return s}},function(t,e,n){var i=n(0)(),r=n(1)(),s=n(2)();class a{constructor(){this.k=1e4,this.gamma=10}setConstants(t,e){this.k=t,this.gamma=e}force(){var t=new i;if(arguments[0]instanceof r&&arguments[1]instanceof r){var e=arguments[0].D,n=arguments[1].D,a=arguments[0].r,o=arguments[1].r,l=(A=i.sub(a,o)).unit(),h=A.len(),c=arguments[0].v,u=arguments[1].v,d=(B=i.sub(c,u)).unit(),f=this.k,p=this.gamma,v=.5*(e+n),g=Math.max(0,v-h),b=B.len()*Math.sign(g),m=i.mul(f*g,l),y=i.mul(-p*b,d);t=i.add(m,y)}else if(arguments[0]instanceof r&&arguments[1]instanceof s){e=arguments[0].D,a=arguments[0].r,c=arguments[0].v;var w=[],x=arguments[1],S=(o=x.r,x.s[0].unit());w.push(S);var I=x.s[1].unit();w.push(I);var E=x.s[2].unit();w.push(E);var T=S.neg();w.push(T);var k=I.neg();w.push(k);var N=E.neg();w.push(N);l=(A=i.sub(a,o)).unit(),u=new i,d=(B=i.sub(c,u)).unit();for(var A,B,M=[],C=0;C<w.length;C++){var O=i.add(x.s[0],x.s[1],x.s[2]),P=i.dot(A,w[C]),z=Math.abs(.5*i.dot(O,w[C]));M.push(P-z)}var q=M[0],R=-1;for(C=1;C<M.length;C++)M[C]<q&&(q=M[C],R=C);var F=[];for(C=0;C<M.length;C++)F.push(parseFloat(M[C].toFixed(3)));console.log(F);for(f=0,C=0;C<M.length;C++)M[C]>0&&(f=C+1);if(console.log("side: "+["I","R","U","F","L","D","B"][f]),R>-1){var L=w[R];O=i.add(x.s[0],x.s[1],x.s[2]),i.dot(O,L)}}return t}}t.exports=function(){return a}},function(t,e,n){var i=n(0)(),r=n(1)();class s{constructor(){this.k=1,this.l=1,this.gamma=1,this.o=new i}setConstants(t,e){this.k=t,this.gamma=e}setUncompressedLength(t){this.l=t}setOrigin(t){this.o=t}force(){var t=new i;if(1==arguments.length){if(arguments[0]instanceof r){var e=arguments[0].r,n=this.o,s=(b=i.sub(e,n)).unit(),a=b.len(),o=this.l,l=arguments[0].v,h=new i,c=i.sub(l,h),u=this.k,d=this.gamma,f=a-o,p=c.len(),v=i.mul(-u*f,s),g=i.mul(-d*p,c);t=i.add(v,g)}}else if(2==arguments.length&&arguments[0]instanceof r&&arguments[1]instanceof r){var b;e=arguments[0].r,n=arguments[1].r,s=(b=i.sub(e,n)).unit(),a=b.len(),o=this.l,l=arguments[0].v,h=arguments[1].v,c=i.sub(l,h),u=this.k,d=this.gamma,f=a-o,p=c.len(),v=i.mul(-u*f,s),g=i.mul(-d*p,c);t=i.add(v,g)}return t}}t.exports=function(){return s}},function(t,e,n){var i=n(3)();class r{constructor(t,e,n){this.t=0,this.dt=.001,this.sequence=[],this.amplitude=[],3==arguments.length&&(this.dt=t,this.sequence=e,this.amplitude=n)}restart(){this.t=0;for(var t=this.sequence.length,e=0;e<t;e++)this.sequence[e].pos=0}ping(){var t=[];t.push(this.t),this.t+=this.dt;for(var e=this.sequence.length,n=0;n<e;n++){var i=this.sequence[n].ping();i*=this.amplitude[n],t.push(i)}return t}static test(){for(var t=new i([0,0,0,0,0,1,1,1,1,1]),e=new i([0,0,1,1]),n=new r(.001,[t,e],[8,10]),s=0;s<15;s++){var a=n.ping();console.log(a)}}}t.exports=function(){return r}},function(t,e){function n(t,e){var n=Math.random()*(e-t)+t;return n=Math.round(n)}t.exports={randInt:function(t,e){return n(t,e)},randIntN:function(t,e,i){return function(t,e,i){for(var r=[],s=0;s<i;s++)r.push(n(t,e));return r}(t,e,i)}}},function(t,e){class n{constructor(t,e){this.func=t,this.period=e,this.ticking=!1,this.uid=0}start(){this.ticking||(this.ticking=!0,this.uid=setInterval(this.func,this.period))}stop(){this.ticking&&(this.ticking=!1,clearInterval(this.uid))}static ts(){var t=new Date;return""+("00"+t.getHours()).slice(-2)+("00"+t.getMinutes()).slice(-2)+("00"+t.getSeconds()).slice(-2)}}t.exports=function(){return n}},function(t,e){class n{constructor(t,e){this.period=t,this.dt=e,this.maxCount=parseInt(t/e),this.count=this.maxCount}sampling(){var t=!1;return this.count>=this.maxCount&&(this.count=0,t=!0),this.count++,t}}t.exports=function(){return n}},function(t,e){function n(t){for(var e=t.length,n=t[0].length,i=0,r=0;r<e;r++)for(var s=0;s<n;s++)i=t[r][s]>i?t[r][s]:i;return i}t.exports={createBlockTablet:function(t,e,n){return function(t,e,n){for(var i=[],r=0;r<n;r++){for(var s=[],a=0;a<e;a++){for(var o=[],l=0;l<t;l++){var h=0==l||l==t-1||0==a||a==e-1||0==r||r==n-1?0:1;o.push(h)}s.push(o)}i.push(s)}return i}(t,e,n)},setMaxValue:function(t,e){return function(t,e){for(var n=t.length,i=t[0].length,r=t[0][0].length,s=0;s<n;s++)for(var a=0;a<i;a++)for(var o=0;o<r;o++)t[s][a][o]*=e}(t,e)},stepDissolve:function(t){return function(t){for(var e=t.length,n=t[0].length,i=t[0][0].length,r=0;r<e;r++)for(var s=0;s<n;s++)for(var a=0;a<i;a++)if(0<a&&a<i-1&&0<s&&s<n-1&&0<r&&r<e-1){var o=t[r][s][a],l=0;0==t[r][s][a-1]&&l++,0==t[r][s][a+1]&&l++,0==t[r][s-1][a]&&l++,0==t[r][s+1][a]&&l++,0==t[r-1][s][a]&&l++,0==t[r+1][s][a]&&l++,(o-=l)<0&&(o=0),t[r][s][a]=o}}(t)},createHollowCylinderTablet:function(t,e,n,i,r){return function(t,e,n,i,r){for(var s=[],a=t/2,o=e/2,l=i/2,h=r/2,c=.5*(0+t-1),u=.5*(0+e-1),d=0;d<n;d++){for(var f=[],p=0;p<e;p++){for(var v=[],g=0;g<t;g++){var b=1<1*(g-c)*(g-c)/(l*l)+1*(p-u)*(p-u)/(h*h)&&1*(g-c)*(g-c)/(a*a)+1*(p-u)*(p-u)/(o*o)<1?1:0;b=0==g||g==t-1||0==p||p==e-1||0==d||d==n-1?0:b,v.push(b)}f.push(v)}s.push(f)}return s}(t,e,n,i,r)},getRemains:function(t){return function(t){for(var e=t.length,n=t[0].length,i=t[0][0].length,r=0,s=0;s<e;s++)for(var a=0;a<n;a++)for(var o=0;o<i;o++)r+=t[s][a][o];return r}(t)},createEllipsoidTablet:function(t,e,n){return function(t,e,n){for(var i=[],r=t/2,s=e/2,a=n/2,o=.5*(0+t-1),l=.5*(0+e-1),h=.5*(0+n-1),c=0;c<n;c++){for(var u=[],d=0;d<e;d++){for(var f=[],p=0;p<t;p++){var v=1*(p-o)*(p-o)/(r*r)+1*(d-l)*(d-l)/(s*s)+1*(c-h)*(c-h)/(a*a)<1?1:0;v=0==p||p==t-1||0==d||d==e-1||0==c||c==n-1?0:v,f.push(v)}u.push(f)}i.push(u)}return i}(t,e,n)},createCylinderTablet:function(t,e,n){return function(t,e,n){for(var i=[],r=t/2,s=e/2,a=.5*(0+t-1),o=.5*(0+e-1),l=0;l<n;l++){for(var h=[],c=0;c<e;c++){for(var u=[],d=0;d<t;d++){var f=1*(d-a)*(d-a)/(r*r)+1*(c-o)*(c-o)/(s*s)<1?1:0;f=0==d||d==t-1||0==c||c==e-1||0==l||l==n-1?0:f,u.push(f)}h.push(u)}i.push(h)}return i}(t,e,n)},getProjectionOf:function(t){return function(t){var e=t.length,n=t[0].length,i=t[0][0].length;return{onPlane:function(r){var s;if("xy"==r){for(var a=[],o=0;o<n;o++){for(var l=[],h=0;h<i;h++){for(var c=0,u=0;u<e;u++)c+=t[u][o][h];l.push(c)}a.push(l)}s=a}else if("yz"==r){for(a=[],u=0;u<e;u++){for(l=[],o=0;o<n;o++){for(c=0,h=0;h<i;h++)c+=t[u][o][h];l.push(c)}a.push(l)}s=a}else if("xz"==r){for(a=[],u=0;u<e;u++){for(l=[],h=0;h<i;h++){for(c=0,o=0;o<n;o++)c+=t[u][o][h];l.push(c)}a.push(l)}s=a}return s}}}(t)},getMaxProjection:function(t){return n(t)},normalizeProjection:function(t){return function(t){for(var e=t.length,i=t[0].length,r=n(t),s=0;s<e;s++)for(var a=0;a<i;a++)procj[s][a]/=r}(t)},normalizeProjectionInitial:function(t,e){return function(t,e){for(var n=t.length,i=t[0].length,r=0;r<n;r++)for(var s=0;s<i;s++)t[r][s]/=e}(t,e)}}},function(t,e){class n{constructor(){var t=arguments.length,e=[];if(0==t){throw new Error("Pile requires at least one dimension size")}if(1==t){this.Nx=arguments[0];for(var n=0;n<this.Nx;n++){var i=0;e.push(i)}}else if(2==t){this.Nx=arguments[0],this.Ny=arguments[1];for(var r=0;r<this.Ny;r++){var s=[];for(n=0;n<this.Nx;n++){i=0;s.push(i)}e.push(s)}}else if(3==t){this.Nx=arguments[0],this.Ny=arguments[1],this.Nz=arguments[2];for(var a=0;a<this.Nz;a++){var o=[];for(r=0;r<this.Ny;r++){for(s=[],n=0;n<this.Nx;n++){i=0;s.push(i)}o.push(s)}e.push(o)}}this.value=e,this.dimension=t}setFill(t){this.fillType=t}fillGrid(){var t=arguments.length;if(0==t){var e="Pile is empty";throw new Error(e)}if(t!=this.dimension){e="Dimension mismatch";throw new Error(e)}if(1==t)for(var n=arguments[0][0],i=arguments[0][1],r=n;r<=i;r++)null==this.fillType?this.value[r]=1:this.value[r]=this.fillType;else if(2==t){n=arguments[0][0],i=arguments[0][1];for(var s=arguments[1][0],a=arguments[1][1],o=s;o<=a;o++)for(r=n;r<=i;r++)null==this.fillType?this.value[o][r]=1:this.value[o][r]=this.fillType}else if(3==t){n=arguments[0][0],i=arguments[0][1],s=arguments[1][0],a=arguments[1][1];for(var l=arguments[2][0],h=arguments[2][1],c=l;c<=h;c++)for(o=s;o<=a;o++)for(r=n;r<=i;r++)null==this.fillType?this.value[c][o][r]=1:this.value[c][o][r]=this.fillType}}}t.exports=function(){return n}},function(t,e){function n(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++){var l=2*t(a)-t(a+r/2);l+=2*t(a+r),s+=l*=r/3,a+=r}return s}function i(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++){var l=7*t(a)+32*t(a+r/4);l+=12*t(a+2*r/4),l+=32*t(a+3*r/4)+7*t(a+r),s+=l*=r/90,a+=r}return s}function r(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++){var l=t(a)+3*t(a+r/3);l+=3*t(a+2*r/3)+t(a+r),s+=l*=r/8,a+=r}return s}function s(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++){var l=t(a)+4*t(a+r/2)+t(a+r);s+=l*=r/6,a+=r}return s}function a(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++){s+=(t(a)+t(a+r))*r/2,a+=r}return s}function o(t,e,n,i){for(var r=(n-e)/i,s=0,a=e+r/2,o=0;o<i;o++){s+=t(a)*r,a+=r}return s}t.exports={integMilneError:function(t,e,i,r){return function(t,e,i,r){for(var s=1,a=n(t,e,i,s),o=1;o>r;){var l=n(t,e,i,s*=2);o=Math.abs(l-a),a=l}return a}(t,e,i,r)},integMilneN:function(t,e,i,r){return n(t,e,i,r)},integBooleError:function(t,e,n,r){return function(t,e,n,r){for(var s=1,a=i(t,e,n,s),o=1;o>r;){var l=i(t,e,n,s*=2);o=Math.abs(l-a),a=l}return a}(t,e,n,r)},integBooleN:function(t,e,n,r){return i(t,e,n,r)},integSimps38Error:function(t,e,n,i){return function(t,e,n,i){for(var s=1,a=r(t,e,n,s),o=1;o>i;){var l=r(t,e,n,s*=2);o=Math.abs(l-a),a=l}return a}(t,e,n,i)},integSimps38N:function(t,e,n,i){return r(t,e,n,i)},integSimpsError:function(t,e,n,i){return function(t,e,n,i){for(var r=1,a=s(t,e,n,r),o=1;o>i;){var l=s(t,e,n,r*=2);o=Math.abs(l-a),a=l}return a}(t,e,n,i)},integSimpsN:function(t,e,n,i){return s(t,e,n,i)},integTrapezError:function(t,e,n,i){return function(t,e,n,i){for(var r=1,s=a(t,e,n,r),l=1;l>i;){var h=o(t,e,n,r*=2);l=Math.abs(h-s),s=h}return s}(t,e,n,i)},integTrapezN:function(t,e,n,i){return a(t,e,n,i)},integRectError:function(t,e,n,i){return function(t,e,n,i){for(var r=1,s=o(t,e,n,r),a=1;a>i;){var l=o(t,e,n,r*=2);a=Math.abs(l-s),s=l}return s}(t,e,n,i)},integRectNBeg:function(t,e,n,i){return function(t,e,n,i){for(var r=(n-e)/i,s=0,a=e,o=0;o<i;o++)s+=t(a)*r,a+=r;return s}(t,e,n,i)},integRectNMid:function(t,e,n,i){return o(t,e,n,i)},integRectNEnd:function(t,e,n,i){return function(t,e,n,i){for(var r=(n-e)/i,s=0,a=e+r,o=0;o<i;o++)s+=t(a)*r,a+=r;return s}(t,e,n,i)}}},function(t,e){class n{constructor(t){this.coefs=[0],this.order=0,arguments.length>0&&(this.coefs=t,this.calcOrder())}calcOrder(){var t=this.coefs.length;this.order=t}setCoefs(t){this.coefs=t,this.calcOrder()}getCoefs(){return this.coefs}value(t){for(var e=1,n=0,i=this.order,r=0;r<i;r++){n+=this.coefs[r]*e,e*=t}return n}}t.exports=function(){return n}},function(t,e){t.exports={linearTransform:function(t,e,n){return function(t,e,n){var i=e[0],r=e[1],s=n[0];return(t-i)*((n[1]-s)/(r-i))+s}(t,e,n)}}},function(t,e){class n{constructor(){this.qi=arguments[0],this.qf=arguments[1],this.l=arguments[2],this.c=arguments[3]}setQi(){this.qi=arguments[0],this.calcOrder()}setQf(){this.qf=arguments[0]}setQ(){this.qi=arguments[0],this.qf=arguments[1]}setL(){this.l=arguments[0]}setL(){this.c=arguments[0]}}t.exports=function(){return n}},function(t,e){class n{constructor(){this.data=[]}addSeries(){this.data.push(arguments[0])}}t.exports=function(){return n}},function(t,e){var n,i=[];function r(t){for(var e=document.getElementsByClassName("tablinks"),n=e.length,i=0;i<n;i++){var r=e[i].className.replace("active","");e[i].className=r}var s=document.getElementsByClassName("tabcontent");for(n=s.length,i=0;i<n;i++)s[i].style.display="none";var a=t.target;if(null!=a){a.className+=" active";var o="ta"+a.id.substring(3);document.getElementById(o).style.display="block"}else{o=t;e[0].className+=" active",s[0].style.display="block"}}t.exports={createTabTextIO:function(t,e,n){return function(t,e,n){Style.createStyle("\n\t.tab {\n\t\toverflow: hidden;\n\t\twidth: 200px;\n\t\theight: 300px;\n\t\tbackground: #f1f1f1;\n\t\tborder: 1px solid #ccc;\n\t\tfloat: left;\n\t}\n\t"),Style.createStyle("\n\t.tab button {\n\t\tbackground: #ddd;\n\t\tfloat: left;\n\t\toutline: none;\n\t\tborder: none;\n\t\tpadding: 6px 6px;\n\t\twidth: 60px;\n\t\theight: 28px;\n\t\tcursor: pointer;\n\t\twhite-space: nowrap;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\t"),Style.createStyle("\n\t.tab button:hover {\n\t\tbackground: #e7e7e7;\n\t\tcolor: #000;\n\t}\n\t"),Style.createStyle("\n\t.tab button.active {\n\t\tbackground: #f1f1f1;\n\t\tcolor: #000;\n\t}\n\t"),Style.createStyle("\n\t.divcontent {\n\t\tclear: both;\n\t\tpadding: 4px 4px;\n\t\tbackground: inherit;\n\t}\n\t"),Style.createStyle("\n\t.tabcontent {\n\t\twidth: 182px;\n\t\tdisplay: none;\n\t\tpadding: 4px 6px;\n\t\toverflow-Y: scroll;\n\t\tborder: 1px solid #aaa;\n\t}\n\t"),width=n.width,height=n.height;var s=t.length,a=document.createElement("div");a.className="tab",Style.changeStyleAttribute(".tab","width",width),Style.changeStyleAttribute(".tab","height",height),e.append(a);var o=Math.floor(parseInt(n.width)/s)+"px";Style.changeStyleAttribute(".tab button","width",o);for(var l=0;l<s;l++){var h=document.createElement("button");h.id="btn"+t[l],h.innerHTML=t[l],h.className="tablinks",h.addEventListener("click",r),a.append(h)}var c=document.createElement("div");for(c.className="divcontent",c.id="divMenu",l=0;l<s;l++){var u=document.createElement("textarea");u.id="ta"+t[l],i.push(u.id),u.innerHTML=t[l],u.className="tabcontent",c.append(u)}a.append(c);var d=Style.getStyleAttribute(".tab button","paddingTop"),f=Style.getStyleAttribute(".tab button","paddingBottom"),p=Style.getStyleAttribute(".tab button","height"),v=parseInt(height)-parseInt(p)-parseInt(d)-parseInt(f)+"px";Style.changeStyleAttribute(".divcontent","height",v);var g=Style.getStyleAttribute(".divcontent","paddingTop"),b=Style.getStyleAttribute(".divcontent","paddingBottom"),m=Style.getStyleAttribute(".tabcontent","borderWidth"),y=parseInt(v)-parseInt(g)-parseInt(b)+2*parseInt(m)+"px";Style.changeStyleAttribute(".tabcontent","height",y);var w=Style.getStyleAttribute(".tabcontent","paddingLeft"),x=Style.getStyleAttribute(".tabcontent","paddingRight"),S=parseInt(width)-parseInt(w)-parseInt(x)-10+"px";return Style.changeStyleAttribute(".tabcontent","width",S),r(0),i}(t,e,n)},openTabText:function(t){return r(t)},setId:function(t){return function(t){n=i[t]}(t)},pop:function(){return t=document.getElementById(n),e=t.value,i=e.split("\n"),r=i.pop(),e=i.join("\n"),t.value=e,r;var t,e,i,r},push:function(t){return function(t){var e=document.getElementById(n),i=e.value,r=i.split("\n");r.push(t),i=r.join("\n"),e.value=i}(t)}}},function(t,e){var n=[];function i(t){for(var e=document.getElementsByClassName("tablinkscan"),n=e.length,i=0;i<n;i++){var r=e[i].className.replace("active","");e[i].className=r}var s=document.getElementsByClassName("tabcontentcan");for(n=s.length,i=0;i<n;i++)s[i].style.display="none";var a=t.target;if(null!=a){a.className+=" active";var o="can"+a.id.substring(3);document.getElementById(o).style.display="block"}else{o=t;e[0].className+=" active",s[0].style.display="block"}}t.exports={createTabCanvasIO:function(t,e,r){return function(t,e,r){Style.createStyle("\n\t.tabcan {\n\t\toverflow: hidden;\n\t\twidth: 200px;\n\t\theight: 300px;\n\t\tbackground: #f1f1f1;\n\t\tborder: 1px solid #ccc;\n\t\tfloat: left;\n\t}\n\t"),Style.createStyle("\n\t.tabcan button {\n\t\tbackground: #ddd;\n\t\tfloat: left;\n\t\toutline: none;\n\t\tborder: none;\n\t\tpadding: 6px 6px;\n\t\twidth: 60px;\n\t\theight: 28px;\n\t\tcursor: pointer;\n\t\twhite-space: nowrap;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\t"),Style.createStyle("\n\t.tabcan button:hover {\n\t\tbackground: #e7e7e7;\n\t\tcolor: #000;\n\t}\n\t"),Style.createStyle("\n\t.tabcan button.active {\n\t\tbackground: #f1f1f1;\n\t\tcolor: #000;\n\t}\n\t"),Style.createStyle("\n\t.divcontentcan {\n\t\tclear: both;\n\t\tpadding: 4px 4px;\n\t\tbackground: inherit;\n\t}\n\t"),Style.createStyle("\n\t.tabcontentcan {\n\t\twidth: 182px;\n\t\tdisplay: none;\n\t\tpadding: 4px 6px;\n\t\toverflow-Y: scroll;\n\t\tborder: 1px solid #aaa;\n\t}\n\t"),width=r.width,height=r.height;var s=t.length,a=document.createElement("div");a.className="tabcan",Style.changeStyleAttribute(".tabcan","width",width),Style.changeStyleAttribute(".tabcan","height",height),e.append(a);var o=Math.floor(parseInt(r.width)/s)+"px";Style.changeStyleAttribute(".tabcan button","width",o);for(var l=0;l<s;l++){var h=document.createElement("button");h.id="btc"+t[l],h.innerHTML=t[l],h.className="tablinkscan",h.addEventListener("click",i),a.append(h)}var c=document.createElement("div");for(c.className="divcontentcan",c.id="divMenuCan",l=0;l<s;l++){var u=document.createElement("textarea");u.id="can"+t[l],n.push(u.id),u.innerHTML=t[l],u.className="tabcontentcan",c.append(u)}a.append(c);var d=Style.getStyleAttribute(".tabcan button","paddingTop"),f=Style.getStyleAttribute(".tabcan button","paddingBottom"),p=Style.getStyleAttribute(".tabcan button","height"),v=parseInt(height)-parseInt(p)-parseInt(d)-parseInt(f)+"px";Style.changeStyleAttribute(".divcontent","height",v);var g=Style.getStyleAttribute(".divcontentcan","paddingTop"),b=Style.getStyleAttribute(".divcontentcan","paddingBottom"),m=Style.getStyleAttribute(".tabcontentcan","borderWidth"),y=parseInt(v)-parseInt(g)-parseInt(b)+2*parseInt(m)+"px";Style.changeStyleAttribute(".tabcontentcan","height",y);var w=Style.getStyleAttribute(".tabcontentcan","paddingLeft"),x=Style.getStyleAttribute(".tabcontentcan","paddingRight"),S=parseInt(width)-parseInt(w)-parseInt(x)-10+"px";return Style.changeStyleAttribute(".tabcontentcan","width",S),i(0),n}(t,e,r)},openTabCanvas:function(t){return i(t)},setId:function(t){return function(t){n[t]}(t)},pop:function(){return t=document.getElementById(taId),e=t.value,n=e.split("\n"),i=n.pop(),e=n.join("\n"),t.value=e,i;var t,e,n,i},push:function(t){return function(t){var e=document.getElementById(taId),n=e.value,i=n.split("\n");i.push(t),n=i.join("\n"),e.value=n}(t)}}},function(t,e,n){var i=n(0)();t.exports={getFrom:function(t){return function(t){return{valueOf:function(e){for(var n,r=t.split("\n"),s=r.length,a=0;a<s;a++)if(-1!=r[a].indexOf(e)){var o=r[a].split(" "),l=o.length;if(2==l)n=parseFloat(o[1]);else if(4==l){var h=parseFloat(o[1]),c=parseFloat(o[2]),u=parseFloat(o[3]);n=new i(h,c,u)}else 5==l&&(n=[parseFloat(o[1]),parseFloat(o[2]),parseFloat(o[3]),parseFloat(o[4])])}return n},column:function(e){for(var n=t.split("\n"),i=n.length,r=[],s=0;s<i;s++){var a=n[s].split(" ");r.push(parseFloat(a[e]))}return r},valueBetween:function(e,n){for(var i,r,s=t.split("\n"),a=s.length,o=[],l=0;l<a;l++)0==s[l].indexOf(e)&&(i=l),0==s[l].indexOf(n)&&(r=l);for(l=i+1;l<r-1;l++)for(var h=s[l].split(" "),c=0;c<h.length;c++){var u=parseFloat(h[c]);o.push(u)}return o}}}(t)}}},function(t,e){class n{constructor(){if(0==arguments.length){var t="Tabs requires id (and parentId) as arguments";throw new Error(t)}if(1==arguments.length){this.id=arguments[0],this.parentId="document.body";t="Tabs "+this.id+" assumes that parent is document.body";console.warn(t)}else this.id=arguments[0],this.parentId=arguments[1];if(null!=document.getElementById(this.id)){t=this.id+" exists";throw new Error(t)}this.createAllStyle(this.id),this.tabcs="tab"+this.id,this.tabbtncs="tab"+this.id+" button",this.tablinkscs="tablinks"+this.id,this.divcontcs="divcontent"+this.id,this.tabcontcs="tabcontent"+this.id,localStorage.setItem(this.tablinkscs,this.tablinkscs),localStorage.setItem(this.tabcontcs,this.tabcontcs);var e=document.createElement("div");(e.id=this.id,e.className=this.tabcs,this.tab=e,"document.body"==this.parentId)?document.body.append(this.tab):document.getElementById(this.parentId).append(this.tab);this.tabs=[],this.tabsType=[]}setBackground(t){Style.changeStyleAttribute("."+this.tabcs,"background",t)}setWidth(t){Style.changeStyleAttribute("."+this.tabcs,"width",t)}setHeight(t){Style.changeStyleAttribute("."+this.tabcs,"height",t)}addTab(t,e){var n=this.id+"div";if(null!=(r=document.getElementById(n))&&r.remove(),this.tabs.indexOf(t)<0)this.tabs.push(t),this.tabsType.push(e);else{var i="Duplicate label "+t+" is igonered";console.warn(i)}for(var r,s=this.tabs.length,a=0;a<s;a++){var o,l=this.id+this.tabs[a];if(null==(o=document.getElementById(l)))(o=document.createElement("button")).id=l,o.className=this.tablinkscs,o.innerHTML=this.tabs[a],o.addEventListener("click",this.toggleContent),this.tab.append(o)}null==(r=document.getElementById(n))&&((r=document.createElement("div")).id=n,r.className=this.divcontcs,this.tab.append(r));var h=parseInt(Style.getStyleAttribute("."+this.tabcs,"width"))-parseInt(Style.getStyleAttribute("."+this.divcontcs,"paddingLeft"))-parseInt(Style.getStyleAttribute("."+this.divcontcs,"paddingRight"))-14+"px";Style.changeStyleAttribute("."+this.tabcontcs,"width",h);var c=parseInt(Style.getStyleAttribute("."+this.tabcs,"height"))-parseInt(Style.getStyleAttribute("."+this.divcontcs,"paddingTop"))-parseInt(Style.getStyleAttribute("."+this.divcontcs,"paddingBottom"))-38+"px";Style.changeStyleAttribute("."+this.tabcontcs,"height",c);for(a=0;a<s;a++){var u;l=this.id+this.tabs[a]+"content";if(null==(u=document.getElementById(l)))0==this.tabsType[a]?((u=document.createElement("textarea")).className=this.tabcontcs,u.innerHTML=this.tabs[a]):1==this.tabsType[a]&&((u=document.createElement("canvas")).className=this.tabcontcs,u.width=parseInt(h),u.height=parseInt(c),u.getContext("2d").font="12px Courier",u.getContext("2d").fillText(this.tabs[a],2,10),u.getContext("2d").beginPath(),u.getContext("2d").arc(45,45,20,0,2*Math.PI),u.getContext("2d").stroke(),u.getContext("2d").beginPath(),u.getContext("2d").arc(55,25,10,0,2*Math.PI),u.getContext("2d").stroke()),u.id=l,r.append(u)}this.updateTabButtonsWidth(),this.toggleContent(0)}removeTab(t){var e=this.tabs.indexOf(t),n=this.tabs.splice(e,1);if(this.tabsType.splice(e,1),e<0){var i="Unexisting label "+t+" for removing is igonered";console.warn(i)}var r=this.id+n;document.getElementById(r).remove(),this.updateTabButtonsWidth();var s=this.id+n+"content";document.getElementById(s).remove(),this.toggleContent(0)}updateTabButtonsWidth(){var t=this.tabs.length;if(document.getElementsByClassName(this.tablinkscs).length==t){var e=Style.getStyleAttribute("."+this.tabcs,"width"),n=parseInt(e)/t+"px";Style.changeStyleAttribute("."+this.tabbtncs,"width",n)}}getStyleClassName(){var t=[];return t.push(this.tabcs),t.push(this.tabbtncs),t.push(this.tablinkscs),t.push(this.tabcontcs),t}toggleContent(){if(null!=event){for(var t=event.target.parentElement,e=localStorage.getItem("tablinks"+t.id),n=localStorage.getItem("tabcontent"+t.id),i=(l=document.getElementsByClassName(e)).length,r=0;r<i;r++){var s=l[r].className.replace("active","");l[r].className=s}for(i=(h=document.getElementsByClassName(n)).length,r=0;r<i;r++)h[r].style.display="none";var a=event.target;a.className+=" active";var o=a.id+"content";document.getElementById(o).style.display="block"}else{r=arguments[0],o=this.id,e=localStorage.getItem("tablinks"+o),n=localStorage.getItem("tabcontent"+o);var l=document.getElementsByClassName(e),h=document.getElementsByClassName(n);if(l.length>0&&h.length>0){s=l[r].className.replace("active","");l[r].className=s,l[r].className+=" active",h[r].style.display="block"}}}createAllStyle(t){Style.createStyle(".tab"+t+" {\n\t\t\toverflow: hidden;\n\t\t\twidth: 240px;\n\t\t\theight: 200px;\n\t\t\tbackground: #f1f1f1;\n\t\t\tborder: 1px solid #ccc;\n\t\t\tfloat: left;\n\t\t}\n\t\t"),Style.createStyle(".tab"+t+" button {\n\t\t\tbackground: #ddd;\n\t\t\tfloat: left;\n\t\t\toutline: none;\n\t\t\tborder: none;\n\t\t\tpadding: 6px 6px;\n\t\t\twidth: 60px;\n\t\t\theight: 28px;\n\t\t\tcursor: pointer;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t}\n\t\t"),Style.createStyle(".tab"+t+" button:hover {\n\t\t\tbackground: #e7e7e7;\n\t\t\tcolor: #000;\n\t\t}\n\t\t"),Style.createStyle(".tab"+t+" button.active {\n\t\t\tbackground: #f1f1f1;\n\t\t\tcolor: #000;\n\t\t}\n\t\t"),Style.createStyle(".divcontent"+t+" {\n\t\t\tclear: both;\n\t\t\tpadding: 4px 4px;\n\t\t\tbackground: inherit;\n\t\t}\n\t\t"),Style.createStyle(".tabcontent"+t+" {\n\t\t\twidth: 182px;\n\t\t\tdisplay: none;\n\t\t\tpadding: 4px 6px;\n\t\t\toverflow-Y: scroll;\n\t\t\tborder: 1px solid #aaa;\n\t\t\tbackground: #fff;\n\t\t\tmargin: 0px;\n\t\t}\n\t\t")}textarea(t){var e=this.tabs.indexOf(t),n=this.id+this.tabs[e]+"content",i=document.getElementById(n);if(!(i instanceof HTMLTextAreaElement)){var r="Tabs "+this.id+" "+t+" is not as a textarea";throw new Error(r)}return i}canvas(t){var e=this.tabs.indexOf(t),n=this.id+this.tabs[e]+"content",i=document.getElementById(n);if(!(i instanceof HTMLCanvasElement)){var r="Tabs "+this.id+" "+t+" is not as a canvas";throw new Error(r)}return i}element(t){var e=this.tabs.indexOf(t),n=this.id+this.tabs[e]+"content";return document.getElementById(n)}text(t){var e=this.tabs.indexOf(t),n=this.id+this.tabs[e]+"content",i=document.getElementById(n);if(i instanceof HTMLTextAreaElement){var r=i.value.split("\n");return{push:function(t){1==r.length&&0==r[0].length?r[0]=t:r.push(t);var e=r.join("\n");i.value=e},pop:function(){var t=r.pop(),e=r.join("\n");return i.value=e,t},popAll:function(){return i.value,r},clear:function(){i.value=""}}}var s=this.id+" "+this.tabs[e]+" is not a textarea";throw new Error(s)}graphic(t){var e=this.tabs.indexOf(t),n=this.id+this.tabs[e]+"content",i=document.getElementById(n),r=i instanceof HTMLCanvasElement,s=i.getContext("2d");if(r)return i.RANGE=[0,i.height,i.width,0],{setCoord:function(t){i.range=t},getCoord:function(){return i.range},getCOORD:function(){return i.RANGE},setLineColor:function(t){s.strokeStyle=t},setFillColor:function(t){s.fillStyle=t},trect:function(t,e,n,r){var s=Transformation.linearTransform(t,[i.range[0],i.range[2]],[i.RANGE[0],i.RANGE[2]]),a=Transformation.linearTransform(e,[i.range[1],i.range[3]],[i.RANGE[1],i.RANGE[3]]);return[s,a,Transformation.linearTransform(t+n,[i.range[0],i.range[2]],[i.RANGE[0],i.RANGE[2]])-s,Transformation.linearTransform(e+r,[i.range[1],i.range[3]],[i.RANGE[1],i.RANGE[3]])-a]},rect:function(t,e,n,i){var r=this.trect(t,e,n,i);s.rect(r[0],r[1],r[2],r[3])},strokeRect:function(t,e,n,i){var r=this.trect(t,e,n,i);s.strokeRect(r[0],r[1],r[2],r[3])},fillRect:function(t,e,n,i){var r=this.trect(t,e,n,i);s.fillRect(r[0],r[1],r[2],r[3])},arc:function(t,e,n,i,r){var a=this.trect(t,e,n,n);s.beginPath(),s.arc(a[0],a[1],a[2],i,r),s.stroke()},strokeCircle:function(t,e,n){this.arc(t,e,n,0,2*Math.PI)},fillCircle:function(t,e,n){this.arc(t,e,n,0,2*Math.PI),s.fill()},setPointType:function(t){i.pointType=t},setPointSize:function(t){i.pointSize=t},point:function(t,e){var n=i.pointSize,r=i.pointType;if("circle"==r){var a=this.trect(t,e,n,n);s.beginPath(),s.arc(a[0],a[1],.5*n,0,2*Math.PI),s.stroke()}else if("box"==r){a=this.trect(t,e,n,n);var o=.5*n;s.strokeRect(a[0]-o,a[1]-o,n,n)}},points:function(t,e){for(var n=t.length,i=e.length,r=Math.min(n,i),s=0;s<r;s++)this.point(t[s],e[s])},lines:function(t,e){var n=t.length,i=e.length,r=Math.min(n,i);s.beginPath();for(var a=0;a<r;a++){var o=t[a],l=e[a],h=this.trect(o,l,0,0);0==a?s.moveTo(h[0],h[1]):s.lineTo(h[0],h[1])}s.stroke()},clear:function(){s.clearRect(0,0,i.width,i.height)}};var a=this.id+" "+this.tabs[e]+" is not a canvas";throw new Error(a)}}t.exports=function(){return n}},function(t,e){class n{constructor(){if(0==arguments.length){var t="Bgroup requires id (and parentId) as arguments";throw new Error(t)}if(1==arguments.length){this.id=arguments[0],this.parentId="document.body";t="Bgroup "+this.id+" assumes that parent is document.body";console.warn(t)}else this.id=arguments[0],this.parentId=arguments[1];if(null!=document.getElementById(this.id)){t=this.id+" exists";throw new Error(t)}this.createAllStyle(this.id),this.bgroupcs="bgroup"+this.id,this.buttoncs="button"+this.id;var e=document.createElement("div");(e.id=this.id,e.className=this.bgroupcs,this.bgroup=e,"document.body"==this.parentId)?document.body.append(this.bgroup):document.getElementById(this.parentId).append(this.bgroup);this.buttons=[],this.funcs=[]}setBackground(t){Style.changeStyleAttribute("."+this.bgroupcs,"background",t)}setWidth(t){Style.changeStyleAttribute("."+this.bgroupcs,"width",t)}setHeight(t){Style.changeStyleAttribute("."+this.bgroupcs,"height",t)}addButton(t,e){if(this.buttons.indexOf(t)<0)this.buttons.push(t);else{var n="Duplicate label "+t+" is igonered";console.warn(n)}for(var i=this.buttons.length,r=0;r<i;r++){var s,a=this.id+this.buttons[r];if(null==(s=document.getElementById(a)))(s=document.createElement("button")).id=a,s.className=this.buttoncs,s.innerHTML=this.buttons[r],s.addEventListener("click",buttonClick),this.bgroup.append(s)}}removeButton(t){var e=this.buttons.indexOf(t),n=this.buttons.splice(e,1);if(e<0){var i="Unexisting label "+t+" for removing is igonered";console.warn(i)}var r=this.id+n;document.getElementById(r).remove(),this.updateTabButtonsWidth()}disable(t){var e=this.buttons.indexOf(t);if(e<0){var n="Disable button "+t+" of unexisting is igonered";console.warn(n)}else{var i=this.id+this.buttons[e];document.getElementById(i).disabled=!0}}enable(t){var e=this.buttons.indexOf(t);if(e<0){var n="Enable button "+t+" of unexisting is igonered";console.warn(n)}else{var i=this.id+this.buttons[e];document.getElementById(i).disabled=!1}}setCaption(t){var e=this.buttons.indexOf(t),n=this.id+this.buttons[e];if(!(e<0))return{to:function(t){document.getElementById(n).innerHTML=t}};var i="Set button caption "+t+" of unexisting is igonered";console.warn(i)}createAllStyle(t){Style.createStyle(".bgroup"+t+" {\n\t\t\toverflow: hidden;\n\t\t\twidth: 150px;\n\t\t\theight: 100px;\n\t\t\tbackground: #f1f1f1;\n\t\t\tborder: 1px solid #ccc;\n\t\t\tpadding: 4px 4px;\n\t\t\tfloat: left;\n\t\t}\n\t\t"),Style.createStyle(".button"+t+" {\n\t\t\tbackground: #ddd;\n\t\t\tfloat: left;\n\t\t\twidth: 60px;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t}\n\t\t")}}t.exports=function(){return n}},function(t,e,n){var i=n(0)();t.exports={clearText:function(){return function(){arguments[0].value=""}(arguments[0])},clearCanvas:function(){return function(){var t=arguments[0],e=t.width,n=t.height;t.getContext("2d").clearRect(0,0,e,n)}(arguments[0])},addText:function(){return function(){var t=arguments[0];return{to:function(){var e=arguments[0];e.value+=t,e.scrollTop=e.scrollHeight}}}(arguments[0])},getValue:function(){return function(){var t=arguments[0];return{from:function(){for(var e=arguments[0].value.split("\n"),n=e.length,r=0;r<n;r++){var s,a=e[r].split(" "),o=a.length;if(0==a[0].indexOf(t))return 2==o?s=parseFloat(a[1]):4==o?s=new i(parseFloat(a[1]),parseFloat(a[2]),parseFloat(a[3])):3==o&&((s=[]).push(parseFloat(a[1])),s.push(parseFloat(a[2]))),s}}}}(arguments[0])}}}]);

/* end of butiran.min.js */

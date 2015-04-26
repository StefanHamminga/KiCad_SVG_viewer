var translateIncrement = 1;
var scaleIncrement = 0.002; // My mouse has a deltaY of 100, we multiply by this and add the resulting to the scale
var scaleInvert = true;     // true means pushing the mouse wheel away makes the PCB bigger
var rotateIncrement = 45;   // Guess...

var container = document.getElementById("boardContainer");
var projectName = "VacuBot";

// Layer stack, priority is z-height. Priorities under 10 and over 50 won't be flipped. Many TODOs here.
var layers = [
	{ label: "Engineering Change of Order 1", id: "Eco1_User", priority: 56, opacity: 1 },
	{ label: "Engineering Change of Order 2", id: "Eco2_User", priority: 55, opacity: 1 },

	{ label: "User comments",                 id: "Cmts_User", priority: 52, opacity: 1 },
	{ label: "User drawings",                 id: "Dwgs_User", priority: 51, opacity: 0.7 },

	{ label: "Front fabrication",             id: "F_Fab",     priority: 46, opacity: 1 },
	{ label: "Front courtyard",               id: "F_CrtYd",   priority: 45, opacity: 0.7 },

	{ label: "Front paste",                   id: "F_Paste",   priority: 39, opacity: 0.5 },
	{ label: "Front adhesive",                id: "F_Adhes",   priority: 38, opacity: 0.5 },
	{ label: "Front silkscreen",              id: "F_SilkS",   priority: 37, opacity: 1 },
	{ label: "Front soldermask",              id: "F_Mask",    priority: 36, opacity: 0.5 },
	{ label: "Front copper",                  id: "F_Cu",      priority: 35, opacity: 0.5 },
	{ label: "Back copper",                   id: "B_Cu",      priority: 34, opacity: 0.5 },
	{ label: "Back soldermask",               id: "B_Mask",    priority: 33, opacity: 0.5 },
	{ label: "Back silkscreen",               id: "B_SilkS",   priority: 32, opacity: 0.5 },
	{ label: "Back adhesive",                 id: "B_Adhes",   priority: 31, opacity: 0.5 },
	{ label: "Back paste",                    id: "B_Paste",   priority: 30, opacity: 0.5 },

	{ label: "Back courtyard",                id: "B_CrtYd",   priority: 21, opacity: 0.5 },
	{ label: "Back fabrication",              id: "B_Fab",     priority: 20, opacity: 0.5 },

	{ label: "Board edges",                   id: "Edge_Cuts", priority: 6, opacity: 1 },
	{ label: "Margins",                       id: "Margin",    priority: 5, opacity: 1 }
];

var getSVG = function(fileName) {
  xmlHttpRequest = new XMLHttpRequest()
  xmlHttpRequest.open("GET", fileName, false);
  xmlHttpRequest.send("");
  return xmlHttpRequest.responseXML.documentElement;
}

var svg;
var svgs = [];

layers.forEach(function (layer) {
	svg = document.importNode(getSVG("./" + projectName + "-" + layer.id + ".svg"), true);
	svg.id = layer.id;
	svg.style.zIndex = layer.priority;
	svg.style.opacity = layer.opacity;
	svg.style.transform = "translate(0, 0) scale(1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
	container.appendChild(svg);
	svgs.push(svg);
});

var regTranslate = /(.*translate\()([0-9\.\-]+)([\s\ \-,]+)([0-9\.\-]+)(\).*)/i;
var regScale = /(.*scale\()([0-9\.\-]+)([\s\ \-,]+)([0-9\.\-]+)(\).*)/i;
var regRotate = /(.*rotateX\()([0-9\.\-]+)(deg\).*rotateY\()([0-9\.\-]+)(deg\).*rotateZ\()([0-9\.\-]+)(deg\).*)/i;

var translate = function (x, y) {
	svgs.forEach( function(s) {
		curTr = "" + s.style.transform;
		curTr = curTr.match(regTranslate);

		s.style.transform = curTr[1] + curTr[2] + curTr[3] + curTr[4] + curTr[5];
		var discard = s.offsetHeight;
	});
}

var scale = function (n) {
	svgs.forEach( function(s) {
		curTr = "" + s.style.transform;
		curTr = curTr.match(regScale);

		curTr[2] = parseFloat(curTr[2]) + n;

		s.style.transform = curTr[1] + curTr[2] + curTr[3] + curTr[2] + curTr[5];
	});
}

var rotate = function (x, y, z) {
	svgs.forEach( function(s) {
		curTr = "" + s.style.transform;
		curTr = curTr.match(regRotate);

		curTr[2] = parseInt(curTr[2]);
		curTr[4] = parseInt(curTr[4]);
		curTr[6] = parseInt(curTr[6]);

		if (y != 0 && (curTr[6] != 0 || curTr[6] != 180)) {
			curTr[6] = curTr[6] * -1;
		}

		if (curTr[4] >= 90 || curTr[4] < -90) {
			curTr[2] -= x;
			curTr[6] -= z;
		} else {
			curTr[2] += x;
			curTr[6] += z;
		}
		curTr[4] += y;

		if (curTr[2] > 180) {
			curTr[2] -= 360;
		} else if (curTr[2] < -180) {
			curTr[2] += 360;
		}
		if (curTr[4] > 180) {
			curTr[4] -= 360;
		} else if (curTr[4] < -180) {
			curTr[4] += 360;
		}
		if (curTr[6] > 180) {
			curTr[6] -= 360;
		} else if (curTr[6] < -180) {
			curTr[6] += 360;
		}

		s.style.transform = curTr[1] + curTr[2] + curTr[3] + curTr[4] + curTr[5] + curTr[6] + curTr[7];
	});
}


var fixScaling = function () {
	svgs.forEach( function(s) {
		s.style.position = "static";
	});
	svgs.forEach( function(s) {
		s.style.display='none';
		s.offsetHeight; // no need to store this anywhere, the reference is enough
		s.style.display='';
		s.style.position = "absolute";
	});
}

// Event handlers
document.getElementById('resetView').onmousedown = function () {
	svgs.forEach( function(s) {
		s.style.transform = "translate(0, 0) scale(1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
	});
}

document.getElementById('rotateL').onmousedown = function () {
	rotate(0, 0, -45);
}

document.getElementById('rotateR').onmousedown = function () {
	rotate(0, 0, 45);
}

document.getElementById('rotateY').onmousedown = function () {
	rotate(0, 180, 0);
}

document.addEventListener('wheel', function (event) {
	scale(scaleIncrement * event.deltaY * ( scaleInvert ? -1 : 1 ));
	fixScaling();
}, false);

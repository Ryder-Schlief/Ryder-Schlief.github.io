
const canvas = document.getElementById("canvas");

const color = `rgb(125, 125, 125)`;

var h = innerHeight;
var w = innerWidth;

var offset = {
	x: 0,
	y: 0
}

var center = {
	x: w / 2,
	y: h / 2
}

const size = 500;

const arcOffset = 10;

const arcs = 15;

var zoom = 0;

var ctx = canvas.getContext("2d");

var home = document.getElementById("home-container");
var works = document.getElementById("works-container");
var about = document.getElementById("about-container");
var navbar = document.getElementById("navbar");
var navWorks = document.getElementById("nav-works");
var navHighlight = document.getElementById("nav-highlight");
var navAbout = document.getElementById("nav-about");

window.onload = function() {
	canvas.classList.add("visible");
	updateDivs(true);
	updateCanvas();
}

window.onresize = function() {
	updateCanvas();
}

window.onhashchange = function() {
	updateDivs(false);
}

function updateDivs(instant) {
	var duration = 750;
	if (instant) {
		duration = 0;
	}

	home.classList.remove("visible");
	works.classList.remove("visible");
	about.classList.remove("visible");
	navWorks.classList.remove("selected");
	navHighlight.classList.remove("selected");
	navAbout.classList.remove("selected");

	if (window.location.hash == "#works") {
		navWorks.classList.add("selected");
		smoothTransition({ x: 0, y: -h/1.25 }, 1.5, duration);
		document.title = "Ryder Schlief - Works";
		setTimeout(addVisible, duration/1.75, works);
		setTimeout(addVisible, duration/1.75, navbar);
	} else if (window.location.hash == "#about") {
		navAbout.classList.add("selected");
		smoothTransition({ x: -w/1.75, y: -h/1.75 }, 2.25, duration);
		document.title = "Ryder Schlief - About";
		setTimeout(addVisible, duration/1.75, about);
		setTimeout(addVisible, duration/1.75, navbar);
	} else {
		smoothTransition({ x: 0, y: 0 }, 1, duration);
		document.title = "Ryder Schlief - Home";
		setTimeout(addVisible, duration/1.75, home);
		navbar.classList.remove("visible");
	}
}

function addVisible(element) {
	element.classList.add("visible");
}

function smoothTransition(targetOffset, targetZoom, duration) {
	const startOffset = { x: offset.x, y: offset.y };
	const startZoom = zoom;
	var startTime = null;
  
	requestAnimationFrame(updateOffset);

	function updateOffset(timestamp) {
		if (!startTime) {
			startTime = timestamp;
		}

		const time = (timestamp - startTime) / duration;
		const progress = curve(time);

		if (progress < 1) {
			offset.x = startOffset.x + (targetOffset.x - startOffset.x) * progress;
			offset.y = startOffset.y + (targetOffset.y - startOffset.y) * progress;
			zoom = startZoom + (targetZoom - startZoom) * progress;

			requestAnimationFrame(updateOffset);
		} else {
			offset = targetOffset;
			zoom = targetZoom;
		}
	}
}

function curve(x){
	// cubic bezier curve
	const y = Math.pow((1 - x), 3) * 0 + Math.pow(3*(1 - x), 2) * x * 0.4 + 3*(1 - x) * x*x * 1 + x*x*x * 1;
	return y;
}

function updateCanvas() {
	canvas.height = innerHeight;
	canvas.width = innerWidth;
	h = innerHeight;
	w = innerWidth;

	center = {
		x: w / 2,
		y: h / 2
	}
}

var timeDelta, timeLast = 0, time = Math.random() * 600;

requestAnimationFrame(loop);

function loop(timeNow) {
	timeDelta = (timeNow - timeLast) / 1000;
	timeLast = timeNow;
	time += timeDelta;

	ctx.clearRect(0, 0, w, h);

	ctx.strokeStyle = color;
	ctx.lineWidth = 1 * zoom;

	for (let i = 0; i < arcs; i++) {
		const arcRadius = (arcOffset + ((size - arcOffset) / (arcs-1)) * i) * zoom;

		var x = center.x + offset.x;
		var y = center.y + offset.y;

		// draw arc
		ctx.beginPath();
		ctx.arc(x, y, arcRadius, 0, Math.PI*2);
		ctx.stroke()


		// draw circle
		const velocity = ((Math.PI * 2) * (50 - (i * 1))) / 600;
		const distance = Math.PI + (time * velocity);
		const modDistance = distance % (Math.PI*2);
		angle = modDistance;
		//angle = angle % Math.PI*2;

		x = x + arcRadius * Math.cos(angle);
		y = y + arcRadius * Math.sin(angle);

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, 3 * zoom, 0, Math.PI*2);
		ctx.fill();
	}

	requestAnimationFrame(loop)
}
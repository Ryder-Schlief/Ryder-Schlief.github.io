const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var h = innerHeight;
var w = innerWidth;

var pos = {
	x: 2,
	y: 2
}
var center = {
	x: w/pos.x,
	y: h/pos.y
}

window.onresize = function() {
	updateCanvas();
}

function updateCanvas() {
	canvas.height = innerHeight;
	canvas.width = innerWidth;
	h = innerHeight;
	w = innerWidth;

	center = {
		x: w/pos.x,
		y: h/pos.y
	};
}

// animation
const size = 250
var distance = size + 100;
var expand = 35;
var spacing = 10;
var dir = 1;
var dots = 20;
var flip = 1;
var zoom = 0;

var index = 0; // used to cancel animations when a new one is selected

// these are essentially the 3 axis' of rotation
var rotationOffset = 0.5;
var angleOffset = Math.PI*2;
var offsetOffset = 0; // what is this naming convention what am i doing

var rotations = new Array((dots+1)*(expand+1));
for (var i = 0; i <= dots*expand; i++) {
	rotations[i] = 0//(Math.random()*2-1) * 0.1;
}

// no angle array bc i dont think i really need it?

var offsets = new Array(dots*expand);
for (var i = 0; i <= dots*expand; i++) {
	offsets[i] = (Math.PI*2/dots)*(i%dots) + Math.random()*(Math.PI*2/dots);
}

var order = new Array((dots+1)*(expand+1));
for (var i = 0; i <= dots*expand; i++) {
	var offset = offsetOffset+offsets[i];
	if (offset%(2*Math.PI) < Math.PI) {
		order[i] = 1;
	} else {
		order[i] = -1;
	}
}

var speeds = new Array(dots*expand);
for (var i = 0; i <= dots*expand; i++) {
	speeds[i] = Math.random() * 0.035 + 0.01;
}

var sizes = new Array(dots*expand);
for (var i = 0; i <= dots*expand; i++) {
	sizes[i] = (Math.random() * 6)/(Math.random() * 2 + 1) + 0.5;
}

var colours = new Array(dots*expand);
for (var i = 0; i <= dots*expand; i++) {
	var colour = 50 + Math.random() * 100;
	colours[i] = "rgb(" + colour + ", " + colour + ", " + colour + ")";
}

requestAnimationFrame(loop);

var timeLast = 0;

var test = document.getElementById("test");

function loop(timeNow){
	if (timeLast !== 0) {
		const timeDelta = (timeNow - timeLast) / 1000;
		timeLast = timeNow;

		//test.textContent = rotation;

		for (var i = 0; i < (dots+1)*expand; i++) {
			offsets[i] += timeDelta * speeds[i];
			var offset = offsetOffset+offsets[i];
			if (offsetOffset < 0) { // had some weird niche cases when moving to a negative offset so this is here just in case
				offset += 2*Math.PI;
			}
			if (offset%(2*Math.PI) < Math.PI) {
				order[i] = 1;
			} else {
				order[i] = -1;
			}
		}

		draw();
	}

	timeLast = timeNow;
	requestAnimationFrame(loop);
}

function draw() {
	ctx.clearRect(0, 0, w, h);

	// main circle
	ctx.beginPath();
	ctx.arc(center.x, center.y, size*zoom, 0, 2*Math.PI);
	ctx.fillStyle = "rgb(10, 12, 15)";
	ctx.strokeStyle = "transparent";
	ctx.fill();
	ctx.stroke();

	// dots
	for (let i = 0; i < dots*expand; i++) {
		// what the fuck am i looking at
		var x = (Math.sin(offsetOffset+offsets[i])) * (Math.floor(i/dots)*spacing + distance) * (rotationOffset + rotations[i])// * dir;
		var y = (Math.cos(offsetOffset+offsets[i])) * (Math.floor(i/dots)*spacing + distance);
		// now add the rotation logic
		// rotation matrices for the win
		var vector = {
			x: x*Math.cos(angleOffset)-y*Math.sin(angleOffset),
			y: x*Math.sin(angleOffset)+y*Math.cos(angleOffset)
		};

		if (order[i] == 1) {
			ctx.globalCompositeOperation = "source-over";
		} else if (order[i] == -1) {
			ctx.globalCompositeOperation = "destination-over";
		} else {
			console.log("ORDER ERROR");
		}

		ctx.beginPath();
		ctx.arc(vector.x*zoom+center.x, vector.y*zoom+center.y, sizes[i]*zoom, 0, 2*Math.PI);
		ctx.fillStyle = colours[i];
		ctx.fill();
	}
}

// animations
window.onhashchange = function() {
	change();
}

window.onload = function() {
	if (window.location.hash == "#home") {
		move(1.5, 2.5, 1, Math.PI/2.5, 0.3, 0, 15000, index);
	} else if (window.location.hash == "#about") {
		move(3.5, 2.5, 2, Math.PI/2.5, -0.5, 0, 0, index)
	} else if (window.location.hash == "#test") {
		move(1.5, 1.5, 1.5, Math.PI/1.5, 0.7, 0, 0, index)
	}
	updateCanvas();
}

function change() {
	if (window.location.hash == "#home") {
		move(1.5, 2.5, 1, Math.PI/2.5, 0.3, 0, 1500, index);
	} else if (window.location.hash == "#about") {
		move(3.5, 2.5, 2, Math.PI/2.5, -0.5, -Math.PI/2, 1500, index)
	} else if (window.location.hash == "#test") {
		move(1.5, 1.5, 1.5, Math.PI/1.5, 0.7, 2, 1500, index)
	}
}

function move(targetX, targetY, targetZoom, targetAngle, targetRotation, targetOffset, duration, currentIndex) {
	index++;
	currentIndex++;
	const startX = pos.x;
	const startY = pos.y;
	const startZoom = zoom;
	const startAngle = angleOffset;
	const startRotation = rotationOffset;
	const startOffset = offsetOffset;

	var startTime = null;

	requestAnimationFrame(moveUpdate);

	function moveUpdate(timestamp){
		if (!startTime) {
			startTime = timestamp;
		}

		const time = (timestamp - startTime) / duration;
		const progress = curve(time); // eventually add some kind of smoothing curve

		if (progress < 1) {
			pos.x = startX + (targetX - startX) * progress;
			pos.y = startY + (targetY - startY) * progress;
			center = {
				x: w/pos.x,
				y: h/pos.y
			};

			angleOffset = startAngle + (targetAngle - startAngle) * progress;

			offsetOffset = startOffset + (targetOffset - startOffset) * progress;

			var previous = rotationOffset;
			rotationOffset = startRotation + (targetRotation - startRotation) * progress;
			if (previous < 1 && rotationOffset >= 1) {
				dir *= -1;
			} else if (previous > -1 && rotationOffset <= -1) {
				dir *= -1;
			}

			zoom = startZoom + (targetZoom - startZoom) * progress;

			if (currentIndex >= index) {
				requestAnimationFrame(moveUpdate);
			}
		} else {
			pos.x = targetX;
			pos.y = targetY;
			center = {
				x: w/pos.x,
				y: h/pos.y
			};

			angleOffset = targetAngle;

			offsetOffset = targetOffset;

			zoom = targetZoom;

			rotationOffset = targetRotation;

			var moving = false;

			index = 0;
		}
	}
}

function curve(x) {
	//const y = x; // linear curve
	const y = Math.pow((1 - x), 3) * 0 + Math.pow(3*(1 - x), 2) * x * 0.4 + 3*(1 - x) * x*x * 1 + x*x*x * 1; // cubic bezier curve
	return y;
}
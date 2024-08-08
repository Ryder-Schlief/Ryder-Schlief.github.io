const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var h = innerHeight;
var w = innerWidth;

var pos = {
	x: 3.5,
	y: 2.5
}
var center = {
	x: w/pos.x,
	y: h/pos.y
}

window.onload = function() {
	updateCanvas();
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
var size = 350
var angle = Math.PI/2.5;
var distance = size + 7.5;
var expand = 75;
var spacing = 10;
var dir = 1;
var dots = 19;
var rotation = 0.3;
var flip = 1;

// i "add an extra dot" here because we have to skip the first dot when drawing because of the fact that indexing starts at 0
// could probably be fixed by a 2d array but this works so idrc
var offsets = new Array((dots+1)*expand);
for (var i = 0; i < (dots+1)*expand; i++) {
	offsets[i] = Math.random() * (Math.PI*2/dots);
}
var speeds = new Array((dots+1)*expand);
for (var i = 0; i < (dots+1)*expand; i++) {
	speeds[i] = Math.random() * 0.035 + 0.01;
}
var sizes = new Array((dots+1)*expand);
for (var i = 0; i < (dots+1)*expand; i++) {
	sizes[i] = (Math.random() * 6)/(Math.random() * 2 + 1) + 0.5;
}
var colours = new Array((dots+1)*expand);
for (var i = 0; i < (dots+1)*expand; i++) {
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

		//angle += timeDelta * 0.1;

		for (var i = 0; i < (dots+1)*expand; i++) {
			offsets[i] += timeDelta * speeds[i];
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
	ctx.arc(center.x, center.y, size, 0, 2*Math.PI);
	ctx.fillStyle = "rgb(15, 15, 19)";
	ctx.strokeStyle = "transparent";
	ctx.fill();
	ctx.stroke();

	// dots
	for (let a = 0; a < expand; a++) {
		for (let i = 1; i <= dots; i++) {
			// what the fuck am i looking at
			var x = (Math.sin((Math.PI*2/dots)*i+offsets[i*a])) * (a*spacing + distance) * /*Math.sqrt(Math.cos(angle)*Math.cos(angle) + Math.sin(angle)*Math.sin(angle)) * */rotation;
			var y = (Math.cos((Math.PI*2/dots)*i+offsets[i*a])) * (a*spacing + distance);
			// now add the rotation logic
			// rotation matrices for the win
			var vector = {
				x: x*Math.cos(angle)-y*Math.sin(angle),
				y: x*Math.sin(angle)+y*Math.cos(angle)
			};

			var m = (Math.sin(angle)-0)/(Math.cos(angle)-0);
			// theres probably a better way to do this weird if statement thing
			if (vector.y < -1/m*vector.x) {
				if (flip == 1) {
					ctx.globalCompositeOperation = "destination-over";
				} else {
					ctx.globalCompositeOperation = "source-over";
				}
			} else {
				if (flip == -1) {
					ctx.globalCompositeOperation = "destination-over";
				} else {
					ctx.globalCompositeOperation = "source-over";
				}
			}

			ctx.beginPath();
			ctx.arc(vector.x+center.x, vector.y+center.y, sizes[i*a], 0, 2*Math.PI);
			ctx.fillStyle = colours[i*a];
			ctx.fill();
		}
	}
}

window.onhashchange = function() {
	change();
}

function change() {
	if (window.location.hash == "#home") {
		move(3.5, 2.5, 350, Math.PI/2.5, 0.3, 500);
	} else if (window.location.hash == "#about") {
		move(3.5, 2.5, 450, Math.PI/2.5, -0.5, 500)
	} else if (window.location.hash == "#test") {
		move(1.5, 1.5, 550, Math.PI/1.5, 0.7, 500)
	}
}

function move(targetX, targetY, targetSize, targetAngle, targetRotation, duration) {
	const startX = pos.x;
	const startY = pos.y;
	const startSize = size;
	const startAngle = angle;
	const startRotation = rotation;

	var startTime = null;

	requestAnimationFrame(moveUpdate);

	function moveUpdate(timestamp){
		if (!startTime) {
			startTime = timestamp;
		}

		const time = (timestamp - startTime) / duration;
		const progress = time; // eventually add some kind of smoothing curve

		if (progress < 1) {
			pos.x = startX + (targetX - startX) * progress;
			pos.y = startY + (targetY - startY) * progress;
			center = {
				x: w/pos.x,
				y: h/pos.y
			};

			angle = startAngle + (targetAngle - startAngle) * progress;

			size = startSize + (targetSize - startSize) * progress;
			distance = size + 7.5;

			var previous = rotation;
			rotation = startRotation + (targetRotation - startRotation) * progress;
			if (previous < 1 && rotation >= 1) {
				dir *= -1;
				flip *= -1;
			} else if (previous > -1 && rotation <= -1) {
				dir *= -1;
				flip *= -1;
			}

			if (previous > 0 && rotation <= 0 || previous < 0 && rotation >= 0) {
				flip *= -1;
			}

			requestAnimationFrame(moveUpdate);
		} else {
			pos.x = targetX;
			pos.y = targetY;
			center = {
				x: w/pos.x,
				y: h/pos.y
			};

			angle = targetAngle;

			size = targetSize;
			distance = size + 7.5;
			rotation = targetRotation;
		}
	}
}
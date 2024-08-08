const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var h = innerHeight;
var w = innerWidth;

var center = {
	x: w/3.5,
	y: h/2.5
};

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
}

// animation
var size = 350
var length = 3;
var angle = Math.PI/2.5;
var distance = size/length + 1;
var expand = 350;
var dir = 1;
var dots = 5;

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
	sizes[i] = (Math.random() * 7)/(Math.random() * 2 + 1) + 0.5;
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

		/*length += (timeDelta * dir + (dir * length/10)) * 0.05;
		test.textContent = length;
		if (length <= 1) {
			dir = 1;
		} else if (length >= 1000) {
			dir = -1;
		}
		distance = size/length + 1;*/

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
			var x = (Math.cos(angle)*Math.sin((Math.PI*2/dots)*i+offsets[i*a])-length*Math.sin(angle)*Math.cos((Math.PI*2/dots)*i+offsets[i*a])) * (a + distance) + center.x;
			var y = (Math.sin(angle)*Math.sin((Math.PI*2/dots)*i+offsets[i*a])+length*Math.cos(angle)*Math.cos((Math.PI*2/dots)*i+offsets[i*a])) * (a + distance) + center.y;

			var m = (Math.sin(angle)-0)/(Math.cos(angle)-0);
			// theres probably a better way to do this weird if statement thing
			if (y-center.y < -1/m*(x-center.x)) {
				if (dir == 1) {
					ctx.globalCompositeOperation = "destination-over";
				} else {
					ctx.globalCompositeOperation = "source-over";
				}
			} else {
				if (dir == -1) {
					ctx.globalCompositeOperation = "destination-over";
				} else {
					ctx.globalCompositeOperation = "source-over";
				}
			}

			ctx.beginPath();
			ctx.arc(x, y, sizes[i*a], 0, 2*Math.PI);
			ctx.fillStyle = colours[i*a];
			ctx.fill();
		}
	}
}
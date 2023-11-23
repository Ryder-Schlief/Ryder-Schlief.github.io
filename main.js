
const canvas = document.getElementById("canvas");

const color = `rgb(150, 150, 150)`;

var h = innerHeight;
var w = innerWidth;

var center = {
	x: w / 2,
	y: h / 2
}

const size = 400;

const offset = 10;

const arcs = 15;

var ctx = canvas.getContext("2d");

window.onload = window.onresize = function(){
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
	ctx.lineWidth = 1;

	for (let i = 0; i < arcs; i++) {
		const arcRadius = offset + ((size - offset) / (arcs-1)) * i;

		// draw arc
		ctx.beginPath();
		ctx.arc(center.x, center.y, arcRadius, 0, Math.PI*2);
		ctx.stroke()


		// draw circle
		const velocity = ((Math.PI * 2) * (50 - (i * 1))) / 600;
		const distance = Math.PI + (time * velocity);
		const modDistance = distance % (Math.PI*2);
		angle = modDistance;
		//angle = angle % Math.PI*2;

		var x = center.x + arcRadius * Math.cos(angle);
		var y = center.y + arcRadius * Math.sin(angle);

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, 3.5, 0, Math.PI*2);
		ctx.fill();
	}

	requestAnimationFrame(loop)
}

// this is some of the worst code i have ever written

const black = `rgb(20, 20, 20)`;
const gray = `rgb(30, 30, 30)`;
const platinum = `rgb(230, 230, 230)`;

const canvas = document.querySelector('#canvas');

const ctx = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

const increment = 100;

// [x, y, timer, x_offset, speed]
const right_points_0 = Array.from({ length: 31 }, (_, index) => [0, increment * index, Math.random() * 6.3, w - w/5, Math.random() * 0.1 + .95]);
const right_points_1 = Array.from({ length: 31 }, (_, index) => [0, increment * index, Math.random() * 6.3, w - w/10, Math.random() * 0.1 + .95]);
const left_points_0 = Array.from({ length: 31 }, (_, index) => [0, increment * index, Math.random() * 6.3, 0 + w/5, -Math.random() * 0.1 + .95]);
const left_points_1 = Array.from({ length: 31 }, (_, index) => [0, increment * index, Math.random() * 6.3, 0 + w/10, -Math.random() * 0.1 + .95]);
ctx.fillStyle = black;
ctx.fillRect(0, 0, w, h);

const interval = setInterval(() => {
	ctx.clearRect(0, 0, w, increment * (right_points_0.length-1));

	right_points_0.forEach(point => move(point));
	drawPolygon(ctx, right_points_0, true, increment * (right_points_0.length-1), gray);

	right_points_1.forEach(point => move(point));
	drawPolygon(ctx, right_points_1, true, increment * (right_points_1.length-1), black);

	left_points_0.forEach(point => move(point, -1));
	drawPolygon(ctx, left_points_0, false, increment * (left_points_0.length-1), gray);

	left_points_1.forEach(point => move(point, -1));
	drawPolygon(ctx, left_points_1, false, increment * (left_points_1.length-1), black);
}, 10)


function move(point) {
	point[2] += 0.015 * point[4];
	point[0] = Math.sin(point[2]) * 25 + point[3];
}

function curve(t){
	const p1 = [0, 0];
	const p2 = [0, 0.5];
	const p3 = [1, 0.5];
	const p4 = [1, 1];

	var y = Math.pow((1 - t), 3) * p1[0] + 3*t * Math.pow((1 - t), 2) * p2[0] + 3*Math.pow(t, 2) * (1 - t) * p3[0] + Math.pow(t, 3) * p4[0];
	// var x = Math.pow((1 - t), 3) * p1[1] + 3*t * Math.pow((1 - t), 2) * p2[1] + 3*Math.pow(t, 2) * (1 - t) * p3[1] + Math.pow(t, 3) * p4[1];
	return y;
}

function drawPolygon(ctx, points, right, bottom, color){
	// background
	ctx.fillStyle = color;
	ctx.strokeStyle = color;

	ctx.beginPath();
	if(right){
		ctx.moveTo(w, 0);
	}else{
		ctx.moveTo(0, 0);
	}
	for(var i = 0; i < points.length; i++){
		ctx.lineTo(points[i][0], points[i][1]);
	}
	if(right){
		ctx.lineTo(w, bottom);
	}else{
		ctx.lineTo(0, bottom);
	}
	ctx.closePath();
	ctx.fill();

	// lines
	ctx.strokeStyle = platinum;
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for(var i = 1; i < points.length; i++){
		ctx.lineTo(points[i][0], points[i][1]);
	}
	ctx.stroke();

	// circles
	for(var i = 0; i < points.length; i++){
		drawCircle(ctx, points[i]);
	}
}

function drawCircle(ctx, point){
	ctx.fillStyle = black;
	ctx.beginPath();
	ctx.arc(point[0], point[1], 5, 0, 2*Math.PI, false);
	ctx.fill();

	ctx.strokeStyle = platinum;
	ctx.beginPath();
	ctx.arc(point[0], point[1], 5, 0, 2*Math.PI, false);
	ctx.stroke();
}
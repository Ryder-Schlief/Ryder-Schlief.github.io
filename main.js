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
const right_points_0 = Array.from({ length: h/100 + 1 }, (_, index) => [0, increment * index, Math.random() * 6.3, w - w/3.9, Math.random() * 0.1 + .95]);
const right_points_1 = Array.from({ length: h/100 + 1 }, (_, index) => [0, increment * index, Math.random() * 6.3, w - w/15, Math.random() * 0.1 + .95]);
const left_points_0 = Array.from({ length: h/100 + 1 }, (_, index) => [0, increment * index, Math.random() * 6.3, 0 + w/3.9, -Math.random() * 0.1 + .95]);
const left_points_1 = Array.from({ length: h/100 + 1 }, (_, index) => [0, increment * index, Math.random() * 6.3, 0 + w/15, -Math.random() * 0.1 + .95]);
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

function moveIndicator(element, x0, x1) {
	const indicator_left = document.getElementById('nav-indicator-left');
	const indicator_right = document.getElementById('nav-indicator-right');
	const navItemRect = element.getBoundingClientRect();

	indicator_left.style.transform = `translate(${x0}px, ${navItemRect.top + navItemRect.height/2.875}px)`;
	indicator_right.style.transform = `translate(${x1}px, ${navItemRect.top + navItemRect.height/2.875}px)`;

	navItems = document.querySelectorAll('.nav-item');
	navItems.forEach(function (item) {
		item.classList.remove('active');
	})
	element.classList.add('active')
}

const body = document.body;
const html = document.documentElement;

const indicator_right = document.getElementById('nav-indicator-right');
const indicator_left = document.getElementById('nav-indicator-left');
const nav_items = document.getElementById('nav-items');

const divs = 3;

function Scroll(y) {
	const title = document.getElementById('title').getBoundingClientRect();
	const about = document.getElementById('about').getBoundingClientRect();
	const projects = document.getElementById('projects').getBoundingClientRect();
	const contact = document.getElementById('contact').getBoundingClientRect();

	if (y == 0) {
		y = 0
	}else if (y == 1) {
		y = about.top+window.scrollY;
	}else if (y == 2) {
		y = projects.top+window.scrollY;
	} else if (y == 3) {
		y = contact.top+window.scrollY;
	}
	window.scrollTo({top: y, left: 0, behavior: "smooth"});
}

let previousScroll = -1;
let selectedNav = 0; // this will prevent some weird edge cases when the user scrolls in between two sections because of how the nav logic works - hard to really explain
// essentially, if we are scrolling up but are on a nav above this one, don't do anything (and reverse for scrolling down)

window.onscroll = updateNavMenu;

updateNavMenu(false); // update the nave menu when the webpage is loaded - this is reduntant if the user has already scrolled but if not it wont initialize the nav pointers to the right place

function updateNavMenu(init) {
	let y = 0;
	let x0 = 0;
	let x1 = 0;

	const title = document.getElementById('title').getBoundingClientRect();
	const about = document.getElementById('about').getBoundingClientRect();
	const projects = document.getElementById('projects').getBoundingClientRect();
	const contact = document.getElementById('contact').getBoundingClientRect();

	if (window.scrollY < previousScroll) {
		// scrolling up
		if (window.scrollY <= 10) {
			updateNavMenuText(0);
			selectedNav = 0;
			y = 320;
			x0 = 30;
			x1 = 215;
		} else if (window.scrollY <= about.top+window.scrollY + 100) {
			if (selectedNav < 1) return;
			updateNavMenuText(1);
			selectedNav = 1;
			y = 432;
			x0 = 10;
			x1 = 235;
		} else if (window.scrollY <= projects.top+window.scrollY + 100) {
			if (selectedNav < 2) return;
			updateNavMenuText(2);
			selectedNav = 2;
			y = 543;
			x0 = -40;
			x1 = 285;
		} else if(window.scrollY <= contact.top+window.scrollY) {
			if (selectedNav < 3) return;
			updateNavMenuText(3);
			selectedNav = 3;
			y = 655;
			x0 = -20;
			x1 = 265;
		}
	} else {
		// scrolling down
		if(window.scrollY >= projects.bottom+window.scrollY) {
			updateNavMenuText(3);
			selectedNav = 3;
			y = 655;
			x0 = -20;
			x1 = 265;
		} else if (window.scrollY >= about.bottom+window.scrollY) {
			if (selectedNav > 2) return; 
			updateNavMenuText(2);
			selectedNav = 2;
			y = 543;
			x0 = -40;
			x1 = 285;
		} else if (window.scrollY >= title.bottom+window.scrollY - 100) {
			if (selectedNav > 1) return; 
			updateNavMenuText(1);
			selectedNav = 1;
			y = 432;
			x0 = 10;
			x1 = 235;
		} else if (window.scrollY >= 0) {
			if (selectedNav > 0) return; 
			updateNavMenuText(0);
			selectedNav = 0;
			y = 320;
			x0 = 30;
			x1 = 215;
		}
	}
	previousScroll = window.scrollY;

	if (!init) {
		indicator_right.classList.add('notransition');
		indicator_left.classList.add('notransition');
	}

	indicator_right.style.transform = `translate(${x1}px, ${y}px)`
	indicator_left.style.transform = `translate(${x0}px, ${y}px)`

	if (!init) {
		indicator_left.offsetHeight;
		indicator_left.offsetWidth;
		indicator_right.offsetHeight;
		indicator_right.offsetWidth;

		indicator_right.classList.remove('notransition');
		indicator_left.classList.remove('notransition');
	}
}

function updateNavMenuText(i) {
	document.getElementsByClassName('nav-item')[0].classList.remove('active');
	document.getElementsByClassName('nav-item')[1].classList.remove('active');
	document.getElementsByClassName('nav-item')[2].classList.remove('active');
	document.getElementsByClassName('nav-item')[3].classList.remove('active');
	document.getElementsByClassName('nav-item')[i].classList.add('active');
}
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
		y = (about.top+window.scrollY - ((about.bottom+window.scrollY)-(about.top+window.scrollY))/2);
	}else if (y == 2) {
		y = (projects.top+window.scrollY - ((projects.bottom+window.scrollY)-(projects.top+window.scrollY))/2);
	} else if (y == 3) {
		y = (contact.top+window.scrollY - ((contact.bottom+window.scrollY)-(contact.top+window.scrollY))/2);
	}
	window.scrollTo({top: y, left: 0, behavior: "smooth"});
}

window.onscroll = updateNavMenu;

updateNavMenu(); // update the nave menu when the webpage is loaded - this is reduntant if the user has already scrolled but if not it wont initialize the nav pointers to the right place
function updateNavMenu(){
	let y = 0;
	let x0 = 0;
	let x1 = 100;

	const about = document.getElementById('about').getBoundingClientRect();
	const projects = document.getElementById('projects').getBoundingClientRect();
	const contact = document.getElementById('contact').getBoundingClientRect();

	y = window.scrollY;

	//if (y < )

	// convert overall scroll to percentage through each div (from 0 to n of n divs)
	a = (about.top+window.scrollY - ((about.bottom+window.scrollY)-(about.top+window.scrollY))/2);
	p = (projects.top+window.scrollY - ((projects.bottom+window.scrollY)-(projects.top+window.scrollY))/2);
	c = (contact.top+window.scrollY - ((contact.bottom+window.scrollY)-(contact.top+window.scrollY))/2);
	if (y < a) {
		//between middle of home and middle of about
		y = (y) / (a);
		x0 = 30 - 20*y;
		x1 = 215 + 20*y;
		//x1 = 30 - 20*y;
	}else if (y < p) {
		//between middle of about and middle of projects
		y = (y) / (p-a) - 0.03806;
		x0 = 10 - 50*(y-1);
		x1 = 235 + 50*(y-1);
		//x1 = 10 - 50*(y-1);;
	}else if (y < c) {
		//between middle of projects and middle of contact
		y = (y) / (c-p) - 0.00079;
		x0 = -40 + 20*(y-2);
		x1 = 285 - 20*(y-2);
		//x1 = -40 + 20*(y-2);
	}
	y = y / divs;
	//y = y / (contact.top+window.scrollY - ((contact.bottom+window.scrollY)-(contact.top+window.scrollY))/2);
	
	rect = nav_items.getBoundingClientRect();
	indicator_right.style.transform = `translate(${x1}px, ${(rect.height - rect.height/4) * y + rect.top + rect.height/8}px)`
	indicator_left.style.transform = `translate(${x0}px, ${(rect.height - rect.height/4) * y + rect.top + rect.height/8}px)`
}

function getHeight(){
	const title = document.getElementById('title').getBoundingClientRect();
	const about = document.getElementById('about').getBoundingClientRect();
	const projects = document.getElementById('projects').getBoundingClientRect();
	const contact = document.getElementById('contact').getBoundingClientRect();

	return title.height + about.height + projects.height + contact.height;
}

//initializeIndicator();

function initializeIndicator() {
	const hash = window.location.hash;

	// get the corresponding navigation item
	let navItem = document.querySelector(`[href="${hash}"]`);

	let x0 = 25;
	let x1 = 225;
	if (navItem) {
		// theres gotta be a better way to do this without hardcoding the values but whatev
		if (hash == "#about") {
			x0 = 0;
			x1 = 250;
		} else if (hash == "#projects") {
			x0 = -50;
			x1 = 300;
		} else if (hash == "#contact") {
			x0 = -25;
			x1 = 275;
		}
	}else {
		navItem = document.querySelector(`[href="#home"]`);
	}

	navItem.classList.add('active');

	navItemRect = navItem.getBoundingClientRect();

	indicator_left.classList.add('notransition');
	indicator_right.classList.add('notransition');

	indicator_left.style.transform = `translate(${x0}px, ${navItemRect.top + navItemRect.height/2.875}px)`;
	indicator_right.style.transform = `translate(${x1}px, ${navItemRect.top + navItemRect.height/2.875}px)`;

	indicator_left.offsetHeight;
	indicator_left.offsetWidth;
	indicator_right.offsetHeight;
	indicator_right.offsetWidth;

	indicator_left.classList.remove('notransition');
	indicator_right.classList.remove('notransition');
}
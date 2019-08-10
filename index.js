var clock_tmpl = {
	board: {top: 0, left: 0, height: 120, width: 258},
	k: {scale: 1, shift: 57, shift_2: 74},
	digit_parts: {
	qL1: { p0: { x: 20, y: 20 }, p1: { x: 10, y: 20 }, p2: { x: 10, y: 10 }, p3: { x: 20, y: 10 } },
	qL2: { p0: { x: 20, y: 65 }, p1: { x: 10, y: 65 }, p2: { x: 10, y: 55 }, p3: { x: 20, y: 55 } },
	qL3: { p0: { x: 20, y: 110 }, p1: { x: 10, y: 110 }, p2: { x: 10, y: 100 }, p3: { x: 20, y: 100 } },
	qR1: { p0: { x: 60, y: 20 }, p1: { x: 50, y: 20 }, p2: { x: 50, y: 10 }, p3: { x: 60, y: 10 } },
	qR2: { p0: { x: 60, y: 65 }, p1: { x: 50, y: 65 }, p2: { x: 50, y: 55 }, p3: { x: 60, y: 55 } },
	qR3: { p0: { x: 60, y: 110 }, p1: { x: 50, y: 110 }, p2: { x: 50, y: 100 }, p3: { x: 60, y: 100 } },
	vL1: { p0: { x: 20, y: 55 }, p1: { x: 10, y: 55 }, p2: { x: 10, y: 20 }, p3: { x: 20, y: 20 } },
	vL2: { p0: { x: 20, y: 100 }, p1: { x: 10, y: 100 }, p2: { x: 10, y: 65 }, p3: { x: 20, y: 65 } },
	vR1: { p0: { x: 60, y: 55 }, p1: { x: 50, y: 55 }, p2: { x: 50, y: 20 }, p3: { x: 60, y: 20 } },
	vR2: { p0: { x: 60, y: 100 }, p1: { x: 50, y: 100 }, p2: { x: 50, y: 65 }, p3: { x: 60, y: 65 } },
	h1: { p0: { x: 50, y: 20 }, p1: { x: 20, y: 20 }, p2: { x: 20, y: 10 }, p3: { x: 50, y: 10 } },
	h2: { p0: { x: 50, y: 65 }, p1: { x: 20, y: 65 }, p2: { x: 20, y: 55 }, p3: { x: 50, y: 55 } },
	h3: { p0: { x: 50, y: 110 }, p1: { x: 20, y: 110 }, p2: { x: 20, y: 100 }, p3: { x: 50, y: 100 } },
	},
	dot: {
	d1: { p0: { x: 134, y: 47 }, p1: { x: 124, y: 47 }, p2: { x: 124, y: 37 }, p3: { x: 134, y: 37 } },
	d2: { p0: { x: 134, y: 83 }, p1: { x: 124, y: 83 }, p2: { x: 124, y: 73 }, p3: { x: 134, y: 73 } }
	}
}

var digit_parts = {
	0: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL1", "vL2", "vR1", "vR2", "h1", "h3" ],
	1: [ "qR1", "qR2", "qR3", "vR1", "vR2" ],
	2: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL2", "vR1", "h1", "h2", "h3" ],
	3: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vR1", "vR2", "h1", "h2", "h3" ],
	4: [ "qL1", "qL2", "qR1", "qR2", "qR3", "vL1", "vR1", "vR2", "h2" ],
	5: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL1", "vR2", "h1", "h2", "h3" ],
	6: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL1", "vL2", "vR2", "h1", "h2", "h3" ],
	7: [ "qL1", "qR1", "qR2", "qR3", "vR1", "vR2", "h1" ],
	8: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL1", "vL2", "vR1", "vR2", "h1", "h2", "h3" ],
	9: [ "qL1", "qL2", "qL3", "qR1", "qR2", "qR3", "vL1", "vR1", "vR2", "h1", "h2", "h3" ]
};

var ctx;
var clock;
var position = [];
var digit_on_color;
var digit_off_color;
var timer;

function draw_part(part, color) {			
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(part.p0.x, part.p0.y);
	ctx.lineTo(part.p1.x, part.p1.y);
	ctx.lineTo(part.p2.x, part.p2.y);
	ctx.lineTo(part.p3.x, part.p3.y);
	ctx.fill();
}

function draw_digit(digit, field, color) {
	for (e in digit_parts[digit])
		draw_part(field[digit_parts[digit][e]], color);
}

function draw_dot(o, color) {
	draw_part(o, color);
}

function shift_position(o, x) {
	for (e1 in o)
		for (e2 in o[e1])
			o[e1][e2].x += x;
}

function scale_objects(x) {
	for (e1 in clock.digit_parts)
		for (e2 in clock.digit_parts[e1]) {
			clock.digit_parts[e1][e2].x = Math.round(clock.digit_parts[e1][e2].x * x);
			clock.digit_parts[e1][e2].y = Math.round(clock.digit_parts[e1][e2].y * x);
		}
	clock.k.shift = Math.round(clock.k.shift * x);
	clock.k.shift_2 = Math.round(clock.k.shift_2 * x);
	
	for (e1 in clock.dot)
		for (e2 in clock.dot[e1]) {
			clock.dot[e1][e2].x = Math.round(clock.dot[e1][e2].x * x);
			clock.dot[e1][e2].y = Math.round(clock.dot[e1][e2].y * x);
		}
}

function copyObject(x) {
	var o = new Object();
	
	for (e in x)
		if (typeof x[e] == "object")
			o[e] = copyObject(x[e]);
		else 
			o[e] = x[e];
	
	return o;
}

// start clock
// 1. получить текущее время
// 2. определить час и минуты 
// 3. если до начала следующей минуты/и часа ещё достатточно времени установить текущее время
//    иначе подождать и установить следующее время
// 4. определить сколько времени до начала следующей секунды
// 5. установить интервал для запуска следующей секунды

function set_time(minutes, hours) {
	draw_digit(8, position[2], digit_off_color);
	draw_digit(Math.trunc(minutes / 10), position[2], digit_on_color);
	draw_digit(8, position[3], digit_off_color);
	draw_digit(minutes % 10, position[3], digit_on_color);

	if (hours == 24) {
		hours = 0;
		draw_digit(8, position[0], digit_off_color);
		draw_digit(8, position[1], digit_off_color);
		draw_digit(0, position[1], digit_on_color);
	} else {
		draw_digit(8, position[0], digit_off_color);
		if (Math.trunc(hours / 10) != 0)
			draw_digit(Math.trunc(hours / 10), position[0], digit_on_color);
		draw_digit(8, position[1], digit_off_color);
		draw_digit(hours % 10, position[1], digit_on_color);
	}
}

function dots_off() {
	draw_dot(clock.dot.d1, digit_off_color);
	draw_dot(clock.dot.d2, digit_off_color);
}

function dots_on(next_time, minute, hour, sec) {
	var time = Date.now();

	do {
		sec++;
		next_time += 1000;
		if (sec == 60) {
			sec = 0;
			minute++;
			if (minute == 60) {
				minute = 0;
				hour++;
			}
			if (next_time > time)
				set_time(minute, hour);
		}
	} while (next_time < time)
	
	//console.log(sec + " " + time);
	draw_dot(clock.dot.d1, digit_on_color);
	draw_dot(clock.dot.d2, digit_on_color);
	
	timer = setTimeout("dots_off()", 500);
	timer = setTimeout(function() { dots_on(next_time, minute, hour, sec) }, next_time - time);
}

var time;
var minute;
var hour;

function init() {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext)
		ctx = canvas.getContext('2d');
	else
		throw new Error();
		
	clock = copyObject(clock_tmpl);
	// calc size and position of canvas
	var h0 = window.innerWidth * (clock.board.height / clock.board.width);
	if (h0 <= window.innerHeight) {
		scale = h0 / clock.board.height;
		clock.board.left = 0;
		clock.board.top = Math.round((window.innerHeight - h0) / 2);
		clock.board.width = window.innerWidth;
		clock.board.height = h0;
	} else {
		var w0 = window.innerHeight * (clock.board.width / clock.board.height);
		scale = w0 / clock.board.width;
		clock.board.left = Math.round((window.innerWidth - w0) / 2);
		clock.board.top = 0;
		clock.board.width = w0;
		clock.board.height = window.innerHeight;
	}
	// set canvas size and position
	canvas.style.position = "absolute";
	canvas.style.left = clock.board.left + "px";
	canvas.style.top = clock.board.top + "px";
	canvas.width =  clock.board.width;
	canvas.height = clock.board.height;
	// calc positions and sizes of objects
	scale_objects(scale);	
	position[0] = clock.digit_parts;
	for (i = 1; i < 4; i++)
		position[i] = copyObject(clock.digit_parts);

	shift_position(position[1], clock.k.shift);
	shift_position(position[2], clock.k.shift + clock.k.shift_2);
	shift_position(position[3], clock.k.shift * 2 + clock.k.shift_2);
	// draw board
	digit_on_color = getComputedStyle(canvas).getPropertyValue("--digit-on-color-");
	digit_off_color = getComputedStyle(canvas).getPropertyValue("--digit-off-color-");
	if (digit_on_color == "")
		digit_on_color = "#f0f0f0";
	if (digit_off_color == "")
		digit_off_color = "#959595";
	draw_digit(8, position[0], digit_off_color);
	draw_digit(8, position[1], digit_off_color);
	draw_digit(8, position[2], digit_off_color);
	draw_digit(8, position[3], digit_off_color);
	draw_dot(clock.dot.d1, digit_off_color);
	draw_dot(clock.dot.d2, digit_off_color);

	time = Date.now();
	minute = Math.trunc(time / 60000) % 60;
	hour = Math.trunc(time / 3600000) % 24 - (new Date().getTimezoneOffset() / 60);
	if (hour >= 24)
		hour -= 24;
	set_time(minute, hour);
}

init();

var sec = Math.trunc(time / 1000) % 60;
var next_time = time + (1000 - (time % 1000));

if (time % 1000 < 500) {
	draw_dot(clock.dot.d1, digit_on_color);
	draw_dot(clock.dot.d2, digit_on_color);
	timer = setTimeout("dots_off()", 500 - time);
	timer = setTimeout(function() { dots_on(next_time, minute, hour, sec) }, 1000 - time);
} else
	timer = setTimeout(function() { dots_on(next_time, minute, hour, sec) }, 1000 - time);

window.onresize = init;

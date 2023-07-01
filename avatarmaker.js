const {createCanvas} = require('canvas');
const fs = require('fs');



const makeAvatar = fileName=>{
	let canvas = createCanvas(100,100);
	let ctx = canvas.getContext('2d');

	class Square{
		constructor(x,y,width,height,level){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.level = level;
		}

	}
	let rnd = (max)=>{
		max = Number(max);
		return Math.floor(Math.random() * (max+1));
	}
	let width = 136*3.85;
	let height = 75.8*3.85;
	let square = new Square(canvas.width/2 - width/2 ,canvas.height/2 - height/2,width,height,10);
	let red = Math.floor(Math.random()*255);
	let green = Math.floor(Math.random()*255);
	let blue = Math.floor(Math.random()*255);
	ctx.fillRect(0,0,canvas.width,canvas.height);
	let drawFractals = (square)=>{
		if(square.level <= 0) return;
		//ctx.fillStyle = `rgb(${rnd(255)},${rnd(255)},${rnd(255)})`;
		ctx.fillStyle = `rgb(${rnd(red)},${rnd(green)},${rnd(blue)})`;
		// ctx.fillStyle = `rgb(${rnd(red)},${rnd(green)},${rnd(blue)})`;
		//red>0?red-=.001:green>0?green-=.001:blue>0?blue-=.001:0;
		ctx.fillRect(square.x,square.y,square.width,square.height);
		let topLeft = new Square(square.x-square.width/2,square.y-square.height/2,square.width/2,square.height/2,square.level-1);
		drawFractals(topLeft);
		let topRight = new Square(square.x+square.width,square.y-square.height/2,square.width/2,square.height/2,square.level-1);
		drawFractals(topRight);
		let bottomRight = new Square(square.x+square.width,square.y+square.height,square.width/2,square.height/2,square.level-1);
		drawFractals(bottomRight);
		let bottomLeft = new Square(square.x-square.width/2,square.y+square.height,square.width/2,square.height/2,square.level-1);
		drawFractals(bottomLeft);
	}

	const RANGE = -50;
	let drawFractals2 = (square)=>{
		if(square.level <= 0) return;
		// ctx.fillStyle = `rgb(${rnd(255)},${rnd(255)},${rnd(255)})`;
		ctx.fillStyle = `rgb(${rnd(red)},${rnd(green)},${rnd(blue)})`;
		red>0?red-=.001:green>0?green-=.001:blue>0?blue-=.001:0;
		ctx.fillRect(square.x,square.y,square.width,square.height);
		let topLeft = new Square(square.x-square.width/2 - RANGE,square.y-square.height/2-RANGE,square.width/2,square.height/2,square.level-1);
		drawFractals(topLeft);
		let topRight = new Square(square.x+square.width+RANGE,square.y-square.height/2-RANGE,square.width/2,square.height/2,square.level-1);
		drawFractals(topRight);
		let bottomRight = new Square(square.x+square.width+RANGE,square.y+square.height+RANGE,square.width/2,square.height/2,square.level-1);
		drawFractals(bottomRight);
		let bottomLeft = new Square(square.x-square.width/2-RANGE,square.y+square.height+RANGE,square.width/2,square.height/2,square.level-1);
		drawFractals(bottomLeft);
	}
	drawFractals2(square);

	var string = canvas.toDataURL().split(',')[1]; 
	var buffer = new Buffer.from(string, 'base64');
	fs.writeFileSync(fileName, buffer);
}

module.exports = {
	makeAvatar
}

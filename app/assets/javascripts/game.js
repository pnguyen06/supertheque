var timer = function () {
	count = count - 1;
	if(count === 0) {
		//document.getElementById("canvas").classList.add("hide");
		clearInterval(counter);
	}
}

// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
var count = 5;
var counter = setInterval(timer,1000);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "assets/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "assets/beyonce.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "assets/alcohol1.png";

var monster2Ready = false;
var monster2Image = new Image();
monster2Image.onload = function () {
	monster2Ready = true;
};
monster2Image.src = "assets/alcohol2.png";

document.getElementById("reset").onclick=function(){
	location.reload()
};

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monster2 = {};
var monstersCaught = 0;

var begin = function() {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
  	e.preventDefault();
  }
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));		
	monster.y = 0;
};
var reset2 = function () {
	// Throw the monster somewhere on the screen randomly
	monster2.x = 32 + (Math.random() * (canvas.width - 64));
	monster2.y = 0;
};

// Update game objects
var update = function (modifier) {
	if (count > 0) {
		if (38 in keysDown) { // Player holding up
			hero.y -= hero.speed * modifier;
		}
		if (40 in keysDown) { // Player holding down
			hero.y += hero.speed * modifier;
		}
		if (37 in keysDown) { // Player holding left
			hero.x -= hero.speed * modifier;
		}
		if (39 in keysDown) { // Player holding right
			hero.x += hero.speed * modifier;
		}

		// Moster movement
		monster.y += (Math.random()*3);
		monster2.y += (Math.random()*3);
	}


	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
	if (
		hero.x <= (monster2.x + 32)
		&& monster2.x <= (hero.x + 32)
		&& hero.y <= (monster2.y + 32)
		&& monster2.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset2();
	}

	// Prevent hero from going past the screen
	if (hero.x >= canvas.width - heroImage.width) {
		hero.x = 0;
	}
	else if (hero.x <= 0) {
		hero.x = canvas.width - heroImage.width;
	}
	if (hero.y >= canvas.height - heroImage.height) {
		hero.y = canvas.height - heroImage.height;
	}
	else if (hero.y <= 0) {
		hero.y = 0;
	}

	// Respawn monster
	if (monster.y >= canvas.height - monsterImage.height) {
		reset();
	}
	if (monster2.y >= canvas.height - monster2Image.height) {
		reset2();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (monster2Ready) {
		ctx.drawImage(monster2Image, monster2.x, monster2.y);
	}

	document.getElementById("timer").innerHTML= count + " SECONDS REMAIN";


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "18px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Drinks saved: " + monstersCaught, 32, 32);
	ctx.fillText("Seconds remaining: " + count, 32, 64);
	document.getElementById("score").innerHTML= monstersCaught + " DRINKS SAVED";
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
begin();
reset();
reset2();
main();
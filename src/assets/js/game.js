(function(window, document, undefined) {
	'use strict';

	var GRAVITY = 0.5; // Gravity, to make jump go back to the ground. Used for Peach and animals
	var MOVE_TICK_FRAME_NUMBER = 8; // When peach moves, she has 2 sprites to animate her. This defines the number of frame before switching sprite used
	var WORLD_TICK_FRAME_NUMBER = 7; // The number of frame before switching wrld image to animate it
	var WORLD_IMAGE_NUMBER = 4; // The number of world images to animated some elements
	var CELL_SIZE = 32;
	var PEACH_WIDTH = 32;
	var PEACH_HEIGHT = 64;
	var PEACH_VELOCITY_X = 3; // The number of pixels to move every frame
	var PEACH_JUMP = 2;
	
	// Animal type list (specific sprites and animation)
	var ANIMAL_TYPE_GOOMBA = 1;
	var ANIMAL_TYPE_TURTLE = 2;
	
	// Movement direction
	var MOVE_LEFT = -1;
	var MOVE_STOP = 0;
	var MOVE_RIGHT = 1;
	
	var SCREEN_WIDTH = 16;
	var SCREEN_HEIGHT = 10;
	
	// Animal position on tileset
	var GOOMBA_SPRITE_X = 2;
	var GOOMBA_SPRITE_Y = 12;
	var GOOMBA_VELOCITY_X = 1.5; // The number of pixels a animal moves every frame

	var CELL_PLATFORM = 1;
	var CELL_BLOCK = 2;
	var CELL_EMPTY = 3;
	var CENTER_Y_LIMIT = CELL_SIZE * 2; // The number of pixels to let's peach centered on screen and move world instead of peach

	var isWorldMapReady = false;

	// The wolrd map. Array on tiles par cell.
	var worldMapDesign = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 25, 26, 26, 26, 26, 26, 26, 26, 26, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 26, 26, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 9, 10, 11, 0, 12, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 9, 10, 11, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 15, 33, 33, 33, 33, 13, 14, 15, 0, 16, 0, 0, 17, 10, 10, 10, 10, 11, 0, 12, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 16, 0, 13, 14, 15, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 14, 15, 12, 16, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 45, 0, 16, 0, 13, 14, 15, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 0, 0, 0, 25, 26, 26, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 21, 10, 10, 19, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 14, 15, 16, 16, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 41, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, 22, 0, 0, 25, 26, 27, 0, 0, 25, 26, 27, 0, 0, 25, 26, 27, 0, 0, 0, 13, 15, 33, 33, 33, 33, 9, 11, 0, 0, 0, 25, 26, 26, 27, 0, 0, 0, 0, 13, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 14, 15, 16, 16, 0, 0, 17, 10, 10, 10, 10, 10, 11, 16, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 22, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 13, 15, 37, 37, 37, 37, 13, 15, 33, 33, 33, 33, 9, 11, 0, 0, 0, 0, 0, 18, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 21, 10, 10, 11, 0, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 33, 33, 33, 33, 33, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 14, 14, 15, 45, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 37, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 29, 30, 30, 30, 30, 30, 31, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 31, 24];
 	var animalList =
	[
	 	{x: 15, y: 5},
	 	{x: 51, y: 5},
	 	{x: 90, y: 8}
	];
	// Specific tiles list
	var PLATFORM_TILE_LIST = [9, 10, 11, 17, 19, 21, 23];
	var BLOCK_TILE_LIST = [18, 22, 25, 26, 27, 29, 30, 31];
	var ANIMATED_TILE_LIST = [33, 37, 41, 45];

	var WOLRD_MAP_WIDTH = 100;
	var WOLRD_MAP_HEIGHT = 10;
	var TILE_PER_LINE = 4; // The number of tile per line on tile image
	
	/*
	 * The world map
	 */
	var WorldMap = function() {
		
		// World is made of 2 images, to animate some elements (waterfalls...)
		this.currentAnimationSprite = 0; // The current frame of current image, to know when we have to change it
		this.currentDisplayedImage = 0; // The current displayed image (0 or 1)
		this.imageList = []; // The world image list
	};
	WorldMap.prototype.create = function() {
		// Draws the first image
		for(var imageNumber = 0; imageNumber < WORLD_IMAGE_NUMBER; ++imageNumber) {
			// Clear canvas and draws the second image. The only difference is that we add an offset for alternative images (always just after on tile map)
			context.clearRect(0, 0, canvas.width, canvas.height);
			this.imageList.push(this.generateImage(imageNumber));
		}
		isWorldMapReady = true;
	};
	WorldMap.prototype.getCellState = function(x, y) {
		var cell = worldMapDesign[x + y * WOLRD_MAP_WIDTH];
		if(PLATFORM_TILE_LIST.indexOf(cell) !== -1) {
			return CELL_PLATFORM;
		}
		if(BLOCK_TILE_LIST.indexOf(cell) !== -1) {
			return CELL_BLOCK;
		}
		return CELL_EMPTY;
	};
	WorldMap.prototype.generateImage = function(offset) {
		// Inits world images. Creates a tmp canvas to draw full world images
		var canvas = document.createElement("canvas");
		canvas.width = WOLRD_MAP_WIDTH * CELL_SIZE;
		canvas.height = WOLRD_MAP_HEIGHT * CELL_SIZE;
		var context = canvas.getContext("2d");

		for(var cell in worldMapDesign) {
			var x = cell % WOLRD_MAP_WIDTH;
			var y = Math.floor(cell / WOLRD_MAP_WIDTH);
			var tile = worldMapDesign[cell] - 1;
			if(tile < 0) {
				continue;
			}
			if(ANIMATED_TILE_LIST.indexOf(tile + 1) !== -1) {
				tile += offset;
			}
			var tileX = tile % TILE_PER_LINE;
			var tileY = Math.floor(tile / TILE_PER_LINE);
			context.drawImage(game.tileSet, tileX * CELL_SIZE, tileY * CELL_SIZE, CELL_SIZE, CELL_SIZE, CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
		}

		var image = new Image();
		image.src = canvas.toDataURL();
		return image;
	};
	WorldMap.prototype.updatePosition = function() {
		if(!peach.hasBlockCollision) {
			this.x -= 1.2 * peach.moveDirection * PEACH_VELOCITY_X;
		}
		this.y = peach.y < CENTER_Y_LIMIT ? CENTER_Y_LIMIT - peach.y : 0;
	};
	
	// Inits canvas
	var canvas = document.getElementById('peach');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var context = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	
	function Animal(x, y) {
		this.x = x * CELL_SIZE;
		this.y = y * CELL_SIZE;
		peach.currentVelocityY = 0;
		this.moveDirection = MOVE_RIGHT;
		this.currentAnimationSprite = 0;
		this.currentSprite = 0;
		// Position on the tileset
		this.spriteX = 2;
		this.spriteY = 12;
	};
	Animal.prototype.updatePosition = function() {
		this.x += GOOMBA_VELOCITY_X * this.moveDirection;
		// Checks collision/fall state
		if(this.moveDirection === MOVE_LEFT) {
			// Checks left cells (peach is 2 cells high) While jumping, peach can be in contact with 3 cells. (floor, floor + 1, ceil + 1). When exactly on a ceil, floor = ceil
			var leftCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE) - 1, Math.floor(this.y / CELL_SIZE));
			var bottomLeftCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE) - 1, Math.floor(this.y / CELL_SIZE) + 1);
			if(leftCellState === CELL_BLOCK || bottomLeftCellState === CELL_EMPTY) {
				this.setOppositeDirection();
			}
		} else {
			var rightCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE), Math.floor(this.y / CELL_SIZE));
			var bottomRightCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE), Math.floor(this.y / CELL_SIZE) + 1);
			if(rightCellState === CELL_BLOCK || bottomRightCellState === CELL_EMPTY) {
				this.setOppositeDirection();
			}
		}
		
	};
	Animal.prototype.setOppositeDirection = function() {
		this.moveDirection = this.moveDirection === MOVE_LEFT ?  MOVE_RIGHT : MOVE_LEFT;
	}
	
	function Peach() {
		// Inits Peach
		this.isJumping = false;
		window.addEventListener('keydown', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //space
		        	// Player has to release and press again to make a new jump
		        	if(!this.isJumping) {
			        	this.startJump();
		        	}
		            break;
		        case 37: //left
		        	this.moveDirection = MOVE_LEFT;
		        	this.spriteDirection = MOVE_LEFT;
		            break;
		        case 39: //right
		        	this.moveDirection = MOVE_RIGHT;
		        	this.spriteDirection = MOVE_RIGHT;
		            break;
		    }
		}.bind(this));

		window.addEventListener('keyup', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //up
		        	this.isJumping = false;
		        	this.stopJump();
		            break;
		        case 37: //left
		        case 39: //right
		        	this.moveDirection = MOVE_STOP;
		        	this.currentSprite = 0; // Resets move animation
		            break;
		    }
		}.bind(this));
	};
	
	Peach.prototype.startJump = function() {
		if(this.isOnGround) {
			this.currentVelocityY = -12;
			this.isOnGround = false;
			this.isJumping = true;
		}
	};

	Peach.prototype.stopJump = function() {
	    if(this.currentVelocityY < -4) {
	    	this.currentVelocityY = -4;
	    }
	};

	Peach.prototype.startFall = function() {
		if(this.isOnGround) {
			this.currentVelocityY = .5;
			this.isOnGround = false;
		}
	};

	Peach.prototype.stopFall = function() {
		this.currentVelocityY = 0;
		this.isOnGround = true;
		this.y = Math.floor(this.y / CELL_SIZE) * CELL_SIZE;
	};

	Peach.prototype.updatePosition = function() {
		var hasTouchFloor = false;
		// Gets the current cell where peach is (center bottom position, at her feets). For collision detection, add/remove 0.5 * PEACH_WIDTH to get correct cell to check
		var cellX = (worldMap.x - canvas.width / 2 + PEACH_WIDTH) / CELL_SIZE;
		var cellY = Math.floor((this.y) / CELL_SIZE);	

		// Updates X position
		if(this.moveDirection !== MOVE_STOP) {
			if(++this.currentAnimationSprite > MOVE_TICK_FRAME_NUMBER) {
				this.currentAnimationSprite = 0;
				this.currentSprite = ++this.currentSprite % 2;
			}
			this.hasBlockCollision = false;
			
			if(this.moveDirection === MOVE_LEFT) {
				// Checks left cells (peach is 2 cells high) While jumping, peach can be in contact with 3 cells. (floor, floor + 1, ceil + 1). When exactly on a ceil, floor = ceil
				var topLeftCellState = worldMap.getCellState(- Math.floor(cellX + .5 * PEACH_WIDTH / CELL_SIZE), cellY);
				var leftCellState = worldMap.getCellState(- Math.floor(cellX  + .5 * PEACH_WIDTH / CELL_SIZE), cellY + 1);
				var bottomLeftCellState = worldMap.getCellState(- Math.floor(cellX  + .5 * PEACH_WIDTH / CELL_SIZE), Math.ceil((this.y) / CELL_SIZE) + 1);
				if(topLeftCellState === CELL_BLOCK || leftCellState === CELL_BLOCK || bottomLeftCellState === CELL_BLOCK) {
					this.hasBlockCollision = true;
				}
			} else {
				// Checks right cells (peach is 2 celles high)
				var topRightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), cellY);
				var rightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), cellY + 1);
				var bottomRightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), Math.ceil((this.y) / CELL_SIZE) + 1);
				if(topRightCellState === CELL_BLOCK || rightCellState === CELL_BLOCK || bottomRightCellState === CELL_BLOCK) {
					this.hasBlockCollision = true;
				}
			}
		}

		// Updates Y position
		if(!this.isOnGround) {
			this.currentSprite = PEACH_JUMP;
			this.currentVelocityY = Math.min(this.currentVelocityY + GRAVITY, 11);
			this.y += this.currentVelocityY;
		}
		
		// At the bottom of the game = death, resets game
		if(this.y > SCREEN_HEIGHT * CELL_SIZE) {
			game.reset();
			return;
		}

		// Checks Y collision/platform
		if(this.currentVelocityY >= 0) { // If is not jumping top, checks the cell below
			var bottomCellState = worldMap.getCellState(- Math.floor(cellX), Math.floor((this.y + PEACH_HEIGHT) / CELL_SIZE));
			if(bottomCellState === CELL_PLATFORM || bottomCellState === CELL_BLOCK) {
				if(this.currentVelocityY > 0 && this.y % CELL_SIZE < 12) {
					this.stopFall();
					this.currentSprite = 0;
					hasTouchFloor = true;
				}
			}
			else {
				this.startFall();
			}
		} else {
			// If is jumping top, checks if there is a block above. Checks a little before and after peach center (20%)
			var topLeftCellState = worldMap.getCellState(- Math.floor(cellX + .2 * PEACH_WIDTH / CELL_SIZE), cellY);
			var topRightCellState = worldMap.getCellState(- Math.floor(cellX - .2 * PEACH_WIDTH / CELL_SIZE), cellY);
			if(topLeftCellState === CELL_BLOCK || topRightCellState === CELL_BLOCK) {
				this.currentVelocityY = 0; // Stops jump at this height
			}
		}
	}
	
	/**
	 * Constructor
	 */
	function Game() {
		this.backgroundElement = document.getElementById('bg');
	};

	Game.prototype.draw = function() {
		if(!isWorldMapReady)
			return;

		context.clearRect(0, 0, canvasWidth, canvasHeight);
		
		if(++worldMap.currentAnimationSprite > WORLD_TICK_FRAME_NUMBER) {
			worldMap.currentAnimationSprite = 0;
			worldMap.currentDisplayedImage = ++worldMap.currentDisplayedImage % WORLD_IMAGE_NUMBER;
		}
		var worldImage = worldMap.imageList[worldMap.currentDisplayedImage];

		context.drawImage(worldImage, Math.floor(worldMap.x), worldMap.y);
		context.save();
		context.translate(peach.x, Math.max(CENTER_Y_LIMIT, peach.y));
		if(peach.spriteDirection === MOVE_LEFT) {
			context.scale(-1, 1);
		}

		context.drawImage(game.tileSet, peach.currentSprite * PEACH_WIDTH, 0, PEACH_WIDTH, PEACH_HEIGHT, -PEACH_WIDTH / 2, 0, PEACH_WIDTH, PEACH_HEIGHT);
		context.restore();

		for(var animalIndex in this.animalList) {
			var animal = this.animalList[animalIndex];
			context.save();
			if(worldMap.currentDisplayedImage % 2) {
				context.translate(Math.floor(worldMap.x) + animal.x,  worldMap.y + animal.y);
				context.scale(-1, 1);
			} else {
				context.translate(Math.floor(worldMap.x) + animal.x - CELL_SIZE,  worldMap.y + animal.y);
			}
			context.drawImage(game.tileSet, GOOMBA_SPRITE_X * CELL_SIZE, GOOMBA_SPRITE_Y * CELL_SIZE, CELL_SIZE, CELL_SIZE, 0, 0, CELL_SIZE, CELL_SIZE);
			context.restore();
		}
		/*
		context.beginPath();
		context.rect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = 'rgba(0, 0, 0, 0.5)';
		context.fill();

		context.beginPath();
		var scoreText = $.text({ctx: context, x: canvasWidth / 2, y: 50, text: "PEACH IS BORED AND DECIDES TO FIND MARIO\n\nAS HER DRESS HAS NO POCKET\nSHE CANNOT COLLECT COINS,\n\nBUT AS A PRINCESS\nSHE CAN COLLECT THE ANIMALS SHE MEETS.", valign: 'top', halign: 'center', scale: 2, render: 1, vspacing: 10, hspacing: 2, snap: 0});
		context.fillStyle = 'hsla(0, 100%, 100%, 1)';
		context.fill();*/

		context.beginPath();
		var scoreText = $.text({ctx: context, x: 10, y: 10, text: "SCORE:", valign: 'top', halign: 'left', scale: 2, render: 1, vspacing: 10, hspacing: 2, snap: 0});
		context.fillStyle = 'hsla(0, 100%, 100%, 1)';
		context.fill();

	}
	
	Game.prototype.updateBackgroundPosition = function() {
		this.backgroundElement.style.backgroundPositionX = Math.floor(0.5 * worldMap.x) + 'px';
		this.backgroundElement.style.backgroundPositionY = Math.floor(0.3 * worldMap.y ) + 'px';
		document.getElementById('game').style.backgroundPositionY = Math.floor(0.05 * worldMap.y ) + 'px';
	}
	
	Game.prototype.reset = function() {
		// Initial position, far on right (peach starts on right side on go back to left, from negative x value to 0
		worldMap.x = - (WOLRD_MAP_WIDTH - SCREEN_WIDTH) * CELL_SIZE;

		// Inits peach
		peach.currentAnimationSprite = 0;
		peach.currentSprite = 0;
		// Start position
		peach.x = CELL_SIZE * SCREEN_WIDTH / 2;
		peach.y = CELL_SIZE * (SCREEN_HEIGHT - 3);
		peach.currentVelocityY = 0;
		peach.moveDirection = MOVE_STOP; // If Peach is moving, and its direction (-1 = left, 0 = stop, 1 = right)
		peach.spriteDirection = MOVE_LEFT; // when movement is stopped, keeps the curret sprite direction
		peach.hasBlockCollision = false;
		
		this.animalList = [];
		// Inits animals
		for(var index in animalList) {
			this.animalList.push(new Animal(animalList[index].x, animalList[index].y));
		}
	}

	Game.prototype.start = function() {
		// Loads assets
		this.tileSet = new Image();
		this.tileSet.src = 'assets/img/tileset.png';
		this.tileSet.addEventListener('load', function() {
			worldMap.create();
		}.bind(this));

		
		this.reset();
		
		var gameLoop = function () {
			window.requestAnimationFrame(gameLoop.bind(this));
			playFrameEvents();
		};
		
		var playFrameEvents = function() {
			peach.updatePosition();
			worldMap.updatePosition();
			for(var index in this.animalList) {
				this.animalList[index].updatePosition();
			}
			this.updateBackgroundPosition();
			this.draw();
		}.bind(this);
		
		gameLoop();
		
		this.draw();
	}

	var worldMap = new WorldMap();
	var peach = new Peach();
	var game = new Game();
	game.start();
	
	var $ = {};
	$.definitions = {};
	$.textLine = function( opt ) {
		var textLength = opt.text.length,
			letterHeight = 5;
		var letterX = 0;
		for( var i = 0; i < textLength; ++i ) {
			var letter = $.definitions.letters[ ( opt.text.charAt( i ) ) ] || $.definitions.letters[ 'unknown' ];
			for( var y = 0; y < letterHeight; ++y ) {
				for( var x = 0; x < letterHeight; ++x ) {
					if( letter[ y ][ x ] === 1 ) {
						opt.ctx.rect( opt.x + ( x * opt.scale ) + ( ( letterX * opt.scale ) + opt.hspacing * i ), opt.y + y * opt.scale, opt.scale, opt.scale );
					}
				}
			}
			letterX += letter[0].length
		}
	};

	$.text = function( opt ) {
		var size = 5,
			letterSize = size * opt.scale,
			lines = opt.text.split('\n'),
			linesCopy = lines.slice( 0 ),
			lineCount = lines.length,
			longestLine = linesCopy.sort( function ( a, b ) { return b.length - a.length; } )[ 0 ],
			textWidth = ( longestLine.length * letterSize ) + ( ( longestLine.length - 1 ) * opt.hspacing ),
			textHeight = ( lineCount * letterSize ) + ( ( lineCount - 1 ) * opt.vspacing );

		var sx = opt.x,
			sy = opt.y,
			ex = opt.x + textWidth,
			ey = opt.y + textHeight;

		if( opt.halign == 'center' ) {
			sx = opt.x - textWidth / 2;
			ex = opt.x + textWidth / 2;
		} else if( opt.halign == 'right' ) {
			sx = opt.x - textWidth;
			ex = opt.x;
		}

		if( opt.valign == 'center' ) {
			sy = opt.y - textHeight / 2;
			ey = opt.y + textHeight / 2;
		} else if( opt.valign == 'bottom' ) {
			sy = opt.y - textHeight;
			ey = opt.y;
		}

		var	cx = sx + textWidth / 2,
			cy = sy + textHeight / 2;

		if( opt.render ) {
			for( var i = 0; i < lineCount; ++i ) {
				var line = lines[ i ],			
					lineWidth = (line.length - 1) * opt.hspacing,
					x = opt.x,
					y = opt.y + ( letterSize + opt.vspacing ) * i;
				
				for( var letterNumber = 0; letterNumber < line.length; ++letterNumber ) {
					var letter = $.definitions.letters[ ( line.charAt( letterNumber ) ) ] || $.definitions.letters[ 'unknown' ];
					lineWidth += letter[0].length * opt.scale;
				}

				if( opt.halign == 'center' ) {
					x = opt.x - lineWidth / 2;
				} else if( opt.halign == 'right' ) {
					x = opt.x - lineWidth;
				}

				if( opt.valign == 'center' ) {
					y = y - textHeight / 2;
				} else if( opt.valign == 'bottom' ) {
					y = y - textHeight;
				}

				if( opt.snap ) {
					x = Math.floor( x );
					y = Math.floor( y );
				}

				$.textLine( {
					ctx: opt.ctx,
					x: x,
					y: y,
					text: line,
					hspacing: opt.hspacing,
					scale: opt.scale
				} );
			}
		}

		return {
			sx: sx,
			sy: sy,
			cx: cx,
			cy: cy,
			ex: ex,
			ey: ey,
			width: textWidth,
			height: textHeight
		}
	};

	$.definitions.letters = {
		'1': [
			 [  , ,  1,  , 0 ],
			 [  , 1, 1,  , 0 ],
			 [  ,  , 1,  , 0 ],
			 [  ,  , 1,  , 0 ],
			 [ 1, 1, 1, 1, 1 ]
			 ],
		'2': [
			 [ 1, 1, 1, 1, 0 ],
			 [  ,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 0 ],
			 [ 1, 1, 1, 1, 1 ]
			 ],
		'3': [
			 [ 1, 1, 1, 1, 0 ],
			 [  ,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 1 ],
			 [  ,  ,  ,  , 1 ],
			 [ 1, 1, 1, 1, 0 ]
			 ],
		'4': [
			 [ 1,  ,  , 1, 0 ],
			 [ 1,  ,  , 1, 0 ],
			 [ 1, 1, 1, 1, 1 ],
			 [  ,  ,  , 1, 0 ],
			 [  ,  ,  , 1, 0 ]
			 ],
		'5': [
			 [ 1, 1, 1, 1, 1 ],
			 [ 1,  ,  ,  , 0 ],
			 [ 1, 1, 1, 1, 0 ],
			 [  ,  ,  ,  , 1 ],
			 [ 1, 1, 1, 1, 0 ]
			 ],
		'6': [
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 0 ],
			 [ 1, 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ]
			 ],
		'7': [
			 [ 1, 1, 1, 1, 1 ],
			 [  ,  ,  ,  , 1 ],
			 [  ,  ,  , 1, 0 ],
			 [  ,  , 1,  , 0 ],
			 [  ,  , 1,  , 0 ]
			 ],
		'8': [
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ]
			 ],
		'9': [
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 1 ],
			 [  ,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ]
			 ],
		'0': [
			 [  , 1, 1, 1, 0 ],
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1, 1, 1, 0 ]
			 ],
		'A': [
			 [  , 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ]
			 ],
		'B': [
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ]
			 ],
		'C': [
			 [  , 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [  , 1, 1 ]
			 ],
		'D': [
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ]
			 ],
		'E': [
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ]
			 ],
		'F': [
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ]
			 ],
		'G': [
			 [  , 1, 1, 1 ],
			 [ 1,  ,  , 0 ],
			 [ 1,  , 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'H': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],
		'I': [
			 [ 1, 1, 1 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [ 1, 1, 1 ]
			 ],
		'J': [
			 [  ,  ,  , 1 ],
			 [  ,  ,  , 1 ],
			 [  ,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'K': [
			 [ 1,  ,  , 1 ],
			 [ 1,  , 1, 0 ],
			 [ 1, 1,  , 0 ],
			 [ 1,  , 1, 0 ],
			 [ 1,  ,  , 1 ]
			 ],
		'L': [
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ]
			 ],
		'M': [
			 [ 1,  ,  ,  , 1 ],
			 [ 1, 1,  , 1, 1 ],
			 [ 1,  , 1,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ]
			 ],
		'N': [
			 [ 1,  ,  , 1 ],
			 [ 1, 1,  , 1 ],
			 [ 1,  , 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],  
		'O': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'P': [
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 0 ],
			 [ 1,  ,  , 0 ]
			 ],
		'Q': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1,],
			 [ 1,  ,  , 1 ],
			 [ 1,  , 1, 0 ],
			 [  , 1,  , 1 ]
			 ],
		'R': [
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 0 ],
			 [ 1,  , 1, 0 ],
			 [ 1,  ,  , 1 ]
			 ],
		'S': [
			 [  , 1, 1, 1 ],
			 [ 1,  ,  , 0 ],
			 [  , 1, 1, 0 ],
			 [  ,  ,  , 1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'T': [
			 [ 1, 1, 1 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ]
			 ],
		'U': [
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [  , 1, 0 ]
			 ],
		'V': [
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1,  , 1, 0 ],
			 [  , 1,  , 1, 0 ],
			 [  ,  , 1,  , 0 ]
			 ],
		'W': [
			 [ 1,  , 1,  , 1 ],
			 [ 1,  , 1,  , 1 ],
			 [ 1,  , 1,  , 1 ],
			 [  , 1,  , 1, 0 ],
			 [  , 1,  , 1, 0 ]
			 ],
		'X': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],
		'Y': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [  ,  , ,  1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'Z': [
			 [ 1, 1, 1, 1 ],
			 [  ,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 0 ],
			 [ 1, 1, 1, 1 ]
			 ],   
		' ': [
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ]
			 ],
		',': [
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [  1,  , 0 ],
			 [  1,  , 0 ]
			 ],
		'.': [
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [  1,  , 0 ]
			 ],
		 '+': [
			 [  ,  ,  ,  , 0 ],
			 [  ,  , 1,  , 0 ],
			 [  , 1, 1, 1, 0 ],
			 [  ,  , 1,  , 0 ],
			 [  ,  ,  ,  , 0 ]
			 ],
		'/': [
			 [  ,  ,  ,  , 1 ],
			 [  ,  ,  , 1, 0 ],
			 [  ,  , 1,  , 0 ],
			 [  , 1,  ,  , 0 ],
			 [ 1,  ,  ,  , 0 ]
			 ],
		':': [
			 [  ,  , 0 ],
			 [  , 1, 0 ],
			 [  ,  , 0 ],
			 [  , 1, 0 ],
			 [  ,  , 0 ]
			 ],
		'@': [
			 [  1, 1, 1, 1, 1 ],
			 [   ,  ,  ,  , 1 ],
			 [  1, 1, 1,  , 1 ],
			 [  1,  , 1,  , 1 ],
			 [  1, 1, 1, 1, 1 ]
			 ]
	};
	
}(window, document));
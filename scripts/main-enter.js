"use strict";

var tileSize = 64;

var makeEntity = require("../lib/make-entity");

function makeTrim(entityPool, name, x, y) {
	return makeEntity(entityPool, name, x * tileSize, y * tileSize, tileSize, tileSize);
}

function makeBlock(entityPool, name, x, y) {
	var entity = makeTrim(entityPool, name, x, y);
	entity.collisions = [];
	return entity;
}

function makeBunny(entityPool, x, y) {
	var entity = makeEntity(entityPool, "bunny", x, y, 102, 64);
	entity.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 1,
		"name": "bunny"
	};
	entity.velocity = {
		x: 0,
		y: 0
	};
	entity.collisions = [];
	entity.bunny = true;
	entity.zindex = 2;
}

function makeTree(entityPool, x, y) {
	var entity = makeEntity(entityPool, "tree", x, y, 136, 242);
	entity.zindex = 1;
	return entity;
}

function makeBush(entityPool, x, y) {
	var entity = makeEntity(entityPool, "bush1", x, y, 108, 80);
	entity.zindex = 1;
	return entity;
}

function makeFence(entityPool, x, y) {
	var entity = makeEntity(entityPool, "fence", x, y, 122, 64);
	entity.zindex = 1;
	return entity;
}

module.exports = function(data) {
	var landscapes = [ "-", "-", "-", "/", "\\", " "];
	var col = 1;
	var row = 0;
	var cols = [null];

	data.sounds.play("Rolemusic_-_07_-_Beach_Wedding_Dance", true);

	var levelWidth = 200;
	while (col < levelWidth + 10) {
		var type = landscapes[Math.floor(Math.random() * landscapes.length)];
		if (col < 10 || col >= levelWidth) {
			type = "-";
		}
		if (type === "-") {
			var len = Math.floor(Math.random() * 10) + 1;

			for (var i = 0; i < len; i++) {
				cols.push({type: type, row: row});
			}

			if (col >= 10 && len > 3) {
				var r = Math.random();

				var bx = (col + 1) * tileSize;
				var by = (row - 2) * tileSize;
				if (r > 0.6) {
					makeBunny(data.entities, bx, by);
				} else {
					var r = Math.random();
					if (r > 0.7) {
						makeTree(data.entities, bx, (row * tileSize) - 242);
					} else if (r > 0.4) {
						makeFence(data.entities, bx, (row * tileSize) - 64);
					} else {
						makeBush(data.entities, bx, (row * tileSize) - 80);
					}
				}
			}
			col += len;
		}
		if (type === " ") {
			var len = Math.floor(Math.random() * 5) + 1;
			for (var i = 0; i < len; i++) {
				cols.push(null);
			}
			col += len;
		}
		if (type === "/") {
			row--;
			cols.push({type: type, row: row});
			col++;
		}
		if (type === "\\") {
			cols.push({type: type, row: row});
			row++;
			col++;
		}
	}

	for (var col = 0; col < cols.length; col++) {
		var c = cols[col];
		var last = col > 0 ? cols[col-1] : undefined;
		if (c !== null) {
			var sprite = randomSprite(c.type);
			if (c.type === "-") {
				makeTrim(data.entities, "ground5", col, c.row - 1);
				if (!last) {
					makeTrim(data.entities, "ground1", col - 1, c.row - 1);
					for (var y = 0; y < 5; y++) {
						makeTrim(data.entities, "ground7", col - 1, c.row + y);
					}
					makeTrim(data.entities, "ground13", col - 1, c.row + y);
				}
			} else if (c.type === "\\") {
				makeTrim(data.entities, "ground6", col, c.row - 1);
				if (!last) {
					makeTrim(data.entities, "ground1", col - 1, c.row - 1);
					for (var y = 0; y < 5; y++) {
						makeTrim(data.entities, "ground7", col - 1, c.row + y);
					}
					makeTrim(data.entities, "ground13", col - 1, c.row + y);
				}
			} else if (c.type === "/") {
				makeTrim(data.entities, "ground1", col, c.row - 1);
				if (!last) {
					makeTrim(data.entities, "ground1", col - 1, c.row);
					for (var y = 1; y < 5; y++) {
						makeTrim(data.entities, "ground7", col - 1, c.row + y);
					}
					makeTrim(data.entities, "ground13", col - 1, c.row + y);
				}
			}
			makeBlock(data.entities, sprite, col, c.row);
			for (var y = 1; y < 5; y++) {
				makeTrim(data.entities, randomSprite("-"), col, c.row + y);
			}
			makeTrim(data.entities, randomSprite("v"), col, c.row + y);
		} else {
			if (last) {
				if (last.type === "-") {
					makeTrim(data.entities, "ground6", col, last.row - 1);
					for (var y = 0; y < 5; y++) {
						makeTrim(data.entities, "ground12", col, last.row + y);
					}
					makeTrim(data.entities, "ground19", col, last.row + y);
				} else if (last.type === "\\") {
					makeTrim(data.entities, "ground6", col, last.row);
					for (var y = 1; y < 5; y++) {
						makeTrim(data.entities, "ground12", col, last.row + y);
					}
					makeTrim(data.entities, "ground19", col, last.row + y);
				} else if (last.type === "/") {
					makeTrim(data.entities, "ground6", col, last.row - 1);
					for (var y = 0; y < 5; y++) {
						makeTrim(data.entities, "ground12", col, last.row + y);
					}
					makeTrim(data.entities, "ground19", col, last.row + y);
				}
			}
		}
		if (col === levelWidth + 5) {
			var goal = makeEntity(data.entities, "carrot-patch", col * tileSize, ((c.row - 1) * tileSize) - 15, 256, 128);
			goal.zindex = 1;
			goal.goal = true;
			goal.collisions = [];
			goal.timers = {
				next: {
					running: false,
					time: 0,
					max: 3000,
					script: "./scripts/goal-next-level"
				}
			};
		}
	}
};

function randomSprite(type) {
	var sprites = {
		"-": ["ground8", "ground9", "ground10", "ground11"],
		"/": ["ground2"],
		"\\": ["ground4"],
		"v": ["ground14", "ground15", "ground16", "ground18"]
	};
	var possibleSprites = sprites[type];
	return possibleSprites[Math.floor(Math.random() * possibleSprites.length)];
}

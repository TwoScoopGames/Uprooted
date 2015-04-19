"use strict";

var tileSize = 64;

function makeTrim(entityPool, name, x, y) {
	var entity = entityPool.add();
	entity.position = { x: x * tileSize, y: y * tileSize };
	entity.size = { width: tileSize, height: tileSize };
	entity.image = {
		"name": name,
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": tileSize,
		"sourceHeight": tileSize,
		"destinationX": 0,
		"destinationY": 0,
		"destinationWidth": tileSize,
		"destinationHeight": tileSize
	};
	return entity;
}

function makeBlock(entityPool, name, x, y) {
	var entity = makeTrim(entityPool, name, x, y);
	entity.collisions = [];
}


module.exports = function(data) {
	var landscapes = [ "-", "-", "-", "/", "\\", " "];
	var col = 1;
	var row = 0;
	var cols = [null];

	while (col < 200) {
		var type = landscapes[Math.floor(Math.random() * landscapes.length)];
		if (col < 10) {
			type = "-";
		}
		if (type === "-") {
			var len = Math.floor(Math.random() * 10) + 1;

			for (var i = 0; i < len; i++) {
				cols.push({type: type, row: row});
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

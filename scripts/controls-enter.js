"use strict";

var tileSize = 64;

var makeEntity = require("../lib/make-entity");

function makeTrim(entityPool, name, x, y) {
	return makeEntity(entityPool, name, 470 + x * tileSize, 300 + y * tileSize, tileSize, tileSize);
}

function makeBlock(entityPool, name, x, y) {
	var entity = makeTrim(entityPool, name, x, y);
	entity.collisions = [];
	return entity;
}


module.exports = function(data) {
	var row = 0;
	var cols = [null, { type: "-", row: 0 }, null];

	for (var col = 0; col < cols.length; col++) {
		var c = cols[col];
		var last = col > 0 ? cols[col-1] : undefined;
		if (c !== null) {
			var sprite = randomSprite(c.type);
			if (c.type === "-") {
				makeTrim(data.entities, "ground5", col, c.row - 1);
				if (!last) {
					makeTrim(data.entities, "ground1", col - 1, c.row - 1);
					for (var y = 0; y < 1; y++) {
						makeTrim(data.entities, "ground7", col - 1, c.row + y);
					}
					makeTrim(data.entities, "ground13", col - 1, c.row + y);
				}
			}
			makeBlock(data.entities, sprite, col, c.row);
			for (var y = 1; y < 1; y++) {
				makeTrim(data.entities, randomSprite("-"), col, c.row + y);
			}
			makeTrim(data.entities, randomSprite("v"), col, c.row + y);
		} else {
			if (last) {
				if (last.type === "-") {
					makeTrim(data.entities, "ground6", col, last.row - 1);
					for (var y = 0; y < 1; y++) {
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

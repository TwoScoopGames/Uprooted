"use strict";

var tileSize = 64;
function makeBlock(entityPool, name, x, y) {
	var entity = entityPool.add();
	entity.position = { x: x, y: y };
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
	entity.collisions = [];
}


module.exports = function(data) {
	var landscapes = [ "-", "-", "-", "/", "\\", " "];
	var col = 0;
	var row = 0;
	while (col < 200) {
		var type = landscapes[Math.floor(Math.random() * landscapes.length)];
		if (col < 10) {
			type = "-";
		}
		if (type === "-") {
			var len = Math.floor(Math.random() * 10) + 1;

			for (var i = 0; i < len; i++) {
				makeBlock(data.entities, "ground11", (col + i) * tileSize, (row * tileSize));
			}
			col += len;
		}
		if (type === " ") {
			var len = Math.floor(Math.random() * 5) + 1;
			col += len;
		}
		if (type === "/") {
			row--;
			makeBlock(data.entities, "ground11", col * tileSize, (row * tileSize));
			col++;
		}
		if (type === "\\") {
			row++;
			makeBlock(data.entities, "ground11", col * tileSize, (row * tileSize));
			col++;
		}
	}
};

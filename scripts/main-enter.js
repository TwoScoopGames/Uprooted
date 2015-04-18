"use strict";

function makeBlock(entityPool, name, x, y) {
	var entity = entityPool.add();
	entity.position = { x: x, y: y };
	entity.size = { width: 96, height: 96 };
	entity.image = {
		"name": name,
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": 96,
		"sourceHeight": 96,
		"destinationX": 0,
		"destinationY": 0,
		"destinationWidth": 96,
		"destinationHeight": 96
	};
	entity.collisions = [];
}


module.exports = function(data) {
	console.log("main enter");

	var landscapes = [ "-", "-", "-", "/", "\\", " "];
	var col = 0;
	var row = 0;
	while (col < 200) {
		var type = landscapes[Math.floor(Math.random() * landscapes.length)];
		console.log("making", type, "at", row, col);
		if (type === "-") {
			var len = Math.floor(Math.random() * 10) + 1;

			for (var i = 0; i < len; i++) {
				makeBlock(data.entities, "ground11", (col + i) * 96, (row * 96) + 500);
			}
			col += len;
		}
		if (type === " ") {
			var len = Math.floor(Math.random() * 5) + 1;
			col += len;
		}
		if (type === "/") {
			row--;
			makeBlock(data.entities, "ground11", col * 96, (row * 96) + 500);
			col++;
		}
		if (type === "\\") {
			row++;
			makeBlock(data.entities, "ground11", col * 96, (row * 96) + 500);
			col++;
		}
	}
};

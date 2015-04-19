"use strict";

module.exports = function(entityPool, name, x, y, width, height) {
	var entity = entityPool.add();
	entity.position = { x: x, y: y };
	entity.size = { width: width, height: height };
	entity.image = {
		"name": name,
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": width,
		"sourceHeight": height,
		"destinationX": 0,
		"destinationY": 0,
		"destinationWidth": width,
		"destinationHeight": height
	};
	return entity;
};

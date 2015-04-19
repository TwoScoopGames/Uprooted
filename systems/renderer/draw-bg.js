"use strict";

module.exports = function(ecs, data) {
	ecs.add(function() {
		var bg = data.images.get("background");
		if (!bg) {
			return;
		}
		var camera = data.entities.entities[2];
		if (!camera) {
			return;
		}
		var ypct = Math.max(Math.min((camera.position.y + 500) / 1000.0, 1), 0);
		var bgy = -640 * ypct;
		data.context.drawImage(bg, 0, bgy);
	});
};

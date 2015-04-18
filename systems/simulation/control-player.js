"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.velocity.y += 0.01; // gravity

		if (entity.position.y > 400) { // floor
			entity.position.y = 400;
			entity.velocity.y = 0;
			entity.velocity.x = 0;
		}

		if (data.input.button("left")) {
			entity.charge.left += elapsed;
		} else if (entity.charge.left > 0) {
			console.log("release left", entity.charge.left);
			entity.velocity.y = -1;
			entity.velocity.x = - entity.charge.left / 1000;
			entity.charge.left = 0;
		}
		if (data.input.button("right")) {
			entity.charge.right += elapsed;
		} else if (entity.charge.right > 0) {
			console.log("release right", entity.charge.right);
			entity.velocity.y = -1;
			entity.velocity.x = entity.charge.right / 1000;
			entity.charge.right = 0;
		}
	}, ["player"]);
};

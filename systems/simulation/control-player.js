"use strict";

function resolveCollisions(data, entity) {
	for (var i = 0; i < entity.collisions.length; i++) {
		var block = data.entities.entities[entity.collisions[i]];
		if (block.position.y < entity.position.y) {
			entity.position.y = block.position.y;
			entity.velocity.y = 0;
			entity.velocity.x = 0;
			entity.state = "idle";
		}
	}
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		if (entity.state === undefined) {
			entity.state = "jumping";
		}

		if (entity.state === "idle") {
			if (data.input.button("left")) {
				entity.state = "charging";
			}
			if (data.input.button("right")) {
				entity.state = "charging";
			}
		}
		else if (entity.state === "charging") {
			if (data.input.button("left")) {
				entity.charge.left += elapsed;
			} else if (data.input.button("right")) {
				entity.charge.right += elapsed;
			} else {
				entity.velocity.y = -1;
				entity.velocity.x = (entity.charge.right - entity.charge.left) / 1000;
				entity.charge.left = 0;
				entity.charge.right = 0;
				entity.state = "jumping";
			}
		}
		else if (entity.state === "jumping") {
			entity.velocity.y += 0.01; // gravity
			if (data.input.button("left")) {
				entity.velocity.x = 0;
				entity.velocity.y = 1.5;
				entity.state = "diving";
			} else if (data.input.button("right")) {
				entity.velocity.x = 0;
				entity.velocity.y = 1.5;
				entity.state = "diving";
			}
			resolveCollisions(data, entity);
		}
		else if (entity.state === "diving") {
			resolveCollisions(data, entity);
		}
	}, ["player"]);
};

"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		if (entity.collisions) {
			for (var i = 0; i < entity.collisions.length; i++) {
				var block = data.entities.entities[entity.collisions[i]];
				if (block.player && block.state === "diving") {
					delete entity.collisions;
					break;
				}
				if (entity.position.y + entity.size.height > block.position.y) {
					entity.position.y = block.position.y - entity.size.height;
					entity.velocity.y = 0;
				}
			}
		}
		entity.velocity.y += 0.01;
	}, ["bunny"]);
};

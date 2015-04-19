"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		if (entity.collisions) {
			for (var i = 0; i < entity.collisions.length; i++) {
				var block = data.entities.entities[entity.collisions[i]];
				if (block.player) {
					if (block.state === "diving") {
						entity.animation.name = "bunny-die";
						data.sounds.play("bunny-die");
						delete entity.collisions;
						break;
					} else {
						block.state = "dead";
						data.sounds.play("death");
					}
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

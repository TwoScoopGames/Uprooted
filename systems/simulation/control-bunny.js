"use strict";

var makeEntity = require("../../lib/make-entity");

function makeParticle(data, x, y) {
	var particle = makeEntity(data.entities, "particle-bunny", x, y, 12, 10);
	particle.zindex = 6;
	particle.velocity = {
		x: (Math.random() * 2.0) - 1.0,
		y: (Math.random() * 2.0) - 1.0
	};
	particle.particle = true;
	return particle;
}

function sprayParticles(data, x, y, n) {
	for (var i = 0; i < n; i++) {
		makeParticle(data, x, y);
	}
}

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
						sprayParticles(data, entity.position.x + (entity.size.width / 2), entity.position.y + (entity.size.height / 2), 30);
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

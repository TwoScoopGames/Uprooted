"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		entity.velocity.y += 0.01;

		var camera = data.entities.entities[2];
		if (entity.position.x > camera.position.x + camera.size.width ||
			entity.position.y > camera.position.y + camera.size.height ||
			entity.position.x + entity.size.width < camera.position.x ||
			entity.position.y + entity.size.height < camera.position.y) {
			delete data.entities.entities[entity.id];
		}
	}, ["velocity", "particle"]);
};

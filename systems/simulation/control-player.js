"use strict";

var makeEntity = require("../../lib/make-entity");

function resolveCollisions(data, entity) {
	for (var i = 0; i < entity.collisions.length; i++) {
		var block = data.entities.entities[entity.collisions[i]];
		if (block.position.y < entity.position.y) {
			entity.position.y = block.position.y;
			entity.velocity.y = 0;
			entity.velocity.x = 0;
			if (entity.state === "diving") {
				data.sounds.play("land");
			}
			entity.state = "idle";
			setAnimation(entity, "carrot-idle", true);
		}
		if (block.goal) {
			console.log("goal");

			data.sounds.play("victory");

			var cameraPos = data.entities.entities[2].position;

			var rooted = makeEntity(data.entities, "rooted", cameraPos.x, cameraPos.y + canvas.height / 2 - 21, 1136, 42);
			rooted.zindex = 2;

			block.image.name = "carrot-patch2";
			block.timers.next.running = true;
			delete entity.player;
			delete entity.image;
			delete entity.animation;
			entity.state = "idle";
			entity.velocity.x = 0;
			entity.velocity.y = 0;
		}
	}
}

function makeParticles(data, x, y) {
	var imageName = "particle-dirt" + Math.floor((Math.random() * 9) + 1);
	var image = data.images.get(imageName);
	var particle = makeEntity(data.entities, imageName, x, y, image.width, image.height);
	particle.zindex = 5;
	particle.velocity = {
		x: (Math.random() * 2.0) - 1.0,
		y: (Math.random() * 2.0) - 1.0
	};
	particle.particle = true;
	return particle;
}

function sprayParticles(data, x, y, n) {
	for (var i = 0; i < n; i++) {
		makeParticles(data, x, y);
	}
}

function setAnimation(entity, name, loop) {
	if (entity.animation.name === name) {
		return;
	}
	entity.animation.name = name;
	entity.animation.loop = loop;
	entity.animation.frame = 0;
	entity.animation.time = 0;
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		if (entity.state === undefined) {
			entity.state = "jumping";
		}
		if (entity.position.y > 2000 && entity.state !== "dead") {
			data.sounds.play("death");
			entity.state = "dead";
		}
		if (entity.position.y > 3000) {
			data.switchScene("main");
		}

		if (entity.state === "idle") {
			if (data.input.button("left")) {
				entity.state = "charging-intro";
				setAnimation(entity, "carrot-charge-intro", false);
			}
			if (data.input.button("right")) {
				entity.state = "charging-intro";
				setAnimation(entity, "carrot-charge-intro", false);
			}
		}
		if (entity.state === "charging-intro") {
			if (entity.animation.frame === 4) {
				entity.state = "charging";
				data.sounds.play("charge", true);
				setAnimation(entity, "carrot-charge-loop", true);
			}
		}
		if (entity.state === "charging-intro" || entity.state === "charging") {
			if (data.input.button("left")) {
				entity.charge.left += elapsed;
			} else if (data.input.button("right")) {
				entity.charge.right += elapsed;
			} else {
				entity.velocity.y = -1.2;
				entity.velocity.x = (entity.charge.right - entity.charge.left) / 500;
				entity.charge.left = 0;
				entity.charge.right = 0;
				entity.state = "jumping";
				data.sounds.stop("charge");
				data.sounds.play("jump");
				sprayParticles(data, entity.position.x + (entity.size.width / 2), entity.position.y + (entity.size.height / 2), 10);
				setAnimation(entity, entity.velocity.x > 0 ? "carrot-jump-right" : "carrot-jump-left", false);
			}
		}
		if (entity.state === "jumping") {
			entity.velocity.y += 0.01; // gravity
			if (data.input.button("left") || data.input.button("right")) {
				entity.velocity.x = 0;
				entity.velocity.y = 1.5;
				entity.state = "diving";
				data.sounds.play("dive");
				setAnimation(entity, "carrot-pound", false);
			}
			resolveCollisions(data, entity);
			if (entity.state === "idle") {
				sprayParticles(data, entity.position.x + (entity.size.width / 2), entity.position.y + (entity.size.height / 2), 10);
			}
		}
		if (entity.state === "diving") {
			resolveCollisions(data, entity);
			if (entity.state === "idle") {
				sprayParticles(data, entity.position.x + (entity.size.width / 2), entity.position.y + (entity.size.height / 2), 20);
			}
		}
		if (entity.state === "dead") {
			entity.velocity.y = 1.5;
			setAnimation(entity, "carrot-hurt", true);
		}
	}, ["player"]);
};

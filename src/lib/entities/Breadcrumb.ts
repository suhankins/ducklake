import { Vector3, Sphere } from 'three';
import PhysicsEntity from './PhysicsEntity';
import { getRandomAngle } from '../utils/AngleHelpers';
import Ripple from './Ripple';

import type { Object3D } from 'three';
import type Game from '../Game';

export default class Breadcrumb extends PhysicsEntity {
    name = 'breadcrumb';

    collision: Sphere;
    mass = 1;

    velocity: Vector3;
    terminalVelocity = 15;
    deceleration = 4;
    static readonly GO_UNDER_WATER_SPEED = -0.25;

    model: Object3D;

    timer = 3;

    constructor(game: Game, position: Vector3) {
        super(game);
        this.model = Breadcrumb.MODEL.clone();
        this.model.position.copy(position);
        this.model.rotation.set(0, getRandomAngle(), 0);
        this.velocity = new Vector3(
            Math.random() * 3,
            5 + Math.random() * 5,
            Math.random() * 3
        );
        this.collision = new Sphere(this.model.position, 0.35);
    }

    enteredWater() {
        this.game.addEntity(
            new Ripple(
                this.game,
                new Vector3().copy(this.position).setY(0.01),
                0.2,
                0.7,
                1.4
            )
        );
    }

    update(dt: number) {
        this.capVelocity();
        this.checkCollisions();
        this.pushAway(dt);
        this.decelerate(dt);
        this.applyVelocity(dt);
        if (this.isYVelocityCloseToZero(dt)) {
            this.timer -= dt;
        }
        if (this.timer > 0) {
            this.updateGravity(dt);
            return;
        }
        this.model.position.y += Breadcrumb.GO_UNDER_WATER_SPEED * dt;
        if (this.model.position.y < -2) {
            this.destroy();
        }
    }
}

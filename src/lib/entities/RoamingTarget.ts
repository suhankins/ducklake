import { Object3D, Sphere, Vector3 } from 'three';
import CollidableEntity from './CollidableEntity';

import type Duck from './Duck/Duck';
import type ITarget from './ITarget';
import type Game from '../Game';

/**
 * Entity that represents duck's target when it's just roaming around.
 */
export default class RoamingTarget extends CollidableEntity implements ITarget {
    name = 'target';

    model: Object3D;
    collision: Sphere;

    /**
     * Duck that goes to this target.
     */
    duck: Duck;

    constructor(game: Game, duck: Duck, position?: Vector3) {
        super(game);
        this.duck = duck;
        this.model = new Object3D();
        this.position = position ?? new Vector3();
        this.collision = new Sphere(this.model.position, 0.7);
    }

    onReached() {
        this.destroy();
    }

    update(_dt: number) {
        if (this.duck.target !== this) this.destroy();
    }

    getDebugString(): string {
        return `Targetted by ${this.duck.name} #${this.duck.id}`;
    }
}

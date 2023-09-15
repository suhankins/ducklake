import { Euler, Object3D, Sphere, Vector3 } from 'three';
import { PhysicsEntity } from './PhysicsEntity';

/**
 * Bread. Intended for ducks to be eaten.
 *
 * Physics are very unrealistic,
 * but I think it looks more fun this way.
 */
export default class Bread extends PhysicsEntity {
    static BREADS: { [id: number]: Bread } = {};
    static BREAD_LIMIT = 24;

    static CHECK_BREADS() {
        const breadKeys = Object.keys(this.BREADS).map((value) =>
            parseInt(value)
        );
        if (breadKeys.length <= this.BREAD_LIMIT) return;
        const oldestBreadIndex = breadKeys.sort((a, b) => a - b)[0];
        this.BREADS[oldestBreadIndex].destroy();
    }

    name: string = 'bread';

    collision: Sphere;
    mass = 1;

    velocity: Vector3 = new Vector3();
    angularVelocity: Euler = new Euler();

    terminalVelocity: number = 10;
    angularTerminalVelocity: number = 2;

    deceleration: number = 2;

    model: Object3D;

    constructor(position?: Vector3) {
        super();
        Bread.BREADS[this.id] = this;
        this.model = Bread.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.model.rotation.y = Math.random() * Math.PI * 2 - Math.PI;
        this.collision = new Sphere(this.model.position, 0.7);
        Bread.CHECK_BREADS();
    }

    update(dt: number): void {
        this.updateGravity(dt);
        // Capping velocity
        this.capVelocity();
        this.checkCollisions();
        this.pushAway(dt);
        this.decelerate(dt);
        // Adding velocity to our position, so moving the bread
        this.applyVelocity(dt);
    }

    destroy() {
        super.destroy();
        delete Bread.BREADS[this.id];
    }
}
